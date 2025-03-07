<template>
    <div class="category-container">
        <ElSkeleton :rows="1" animated v-if="categoryLoading" :throttle="300" />
        <ElFormItem label="上传到" v-else>
            <ElSelect v-model="selectedCategory" :empty-values="[-1]">
                <ElOption
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                />
            </ElSelect>
        </ElFormItem>
    </div>
    <div v-if="selectedCategory >= 0">
        <ElButton @click="uploadInfo" :disabled="uploading">选择一个文件夹</ElButton>
        <div class="log-container" v-if="logs.length > 0">
            <div v-for="i in logs">{{ i }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request, upload } from '@/request';
import { ElButton, ElFormItem, ElOption, ElSelect, ElSkeleton } from 'element-plus';
import { onMounted, ref } from 'vue';
import { parseAttachments, rebuildMarkdown, type ParsedAttachments } from '@/lib/parse-attachments';
import { useSessionStore } from '@/stores/session';
import { UploadFileFail } from 'types/lib/upload-file-fail';
import { CreateExamInfoFail } from 'types/api/create-exam-info';

const categoryLoading = ref(true);
const categories = ref<{ id: number; name: string }[]>([]);
const loadCategories = async () => {
    try {
        const response = await request('/get-exam-info-categories', {});
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        categories.value = [...response.data];
        categoryLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(async () => {
    await loadCategories();
});

const selectedCategory = ref(-1);

const logs = ref<string[]>([]);

const uploading = ref(false);

const session = useSessionStore();

const uploadInfo = async () => {
    uploading.value = true;
    const attachments: { firstAttachment?: File; attachments: File[] }[] = [];
    const markdownList: {
        name: string;
        parsed: ParsedAttachments;
        uploadSuccess: boolean;
    }[] = [];

    const directoryHandle = (await (window as any).showDirectoryPicker()) as FileSystemDirectoryHandle;

    /* 新增的目录遍历和文件处理逻辑 */
    async function collectMdFiles(dirHandle: FileSystemDirectoryHandle) {
        const mdFiles: Array<{ fileHandle: FileSystemFileHandle; dirHandle: FileSystemDirectoryHandle }> = [];
        async function traverse(currentDirHandle: FileSystemDirectoryHandle) {
            for await (const entry of (currentDirHandle as any).values() as FileSystemHandle[]) {
                if (entry.kind === 'file' && entry.name.endsWith('.md')) {
                    mdFiles.push({ fileHandle: entry as FileSystemFileHandle, dirHandle: currentDirHandle });
                } else if (entry.kind === 'directory') {
                    await traverse(entry as FileSystemDirectoryHandle);
                }
            }
        }
        await traverse(dirHandle);
        return mdFiles;
    }

    async function resolveAttachmentFile(relativePath: string, dirHandle: FileSystemDirectoryHandle) {
        try {
            const parts = relativePath.split(/[\\/]/);
            let currentDirHandle = dirHandle;
            for (let i = 0; i < parts.length - 1; i++) {
                currentDirHandle = await currentDirHandle.getDirectoryHandle(parts[i]);
            }
            const fileHandle = await currentDirHandle.getFileHandle(parts[parts.length - 1]);
            return await fileHandle.getFile();
        } catch (error) {
            return null;
        }
    }

    try {
        const mdFiles = await collectMdFiles(directoryHandle);

        for (const mdFile of mdFiles) {
            const file = await mdFile.fileHandle.getFile();
            const content = await file.text();
            const parsed = parseAttachments(content);

            // 收集附件路径并验证存在性
            const attachmentPaths = [
                ...(parsed.firstAttachment ? [parsed.firstAttachment] : []),
                ...parsed.fragments.map((f) => f.attachment).filter(Boolean),
            ];

            const attachmentFiles: File[] = [];
            let allAttachmentsExist = true;

            for (const path of attachmentPaths) {
                const file = await resolveAttachmentFile(path, mdFile.dirHandle);
                if (!file) {
                    allAttachmentsExist = false;
                    break;
                }
                attachmentFiles.push(file);
            }

            if (!allAttachmentsExist) continue;

            // 构建附件结构
            const firstFile = parsed.firstAttachment ? attachmentFiles.shift()! : undefined;
            attachments.push({
                firstAttachment: firstFile,
                attachments: attachmentFiles,
            });

            // 添加至Markdown列表
            markdownList.push({
                name: file.name.replace(/\.md$/, ''),
                parsed: parsed,
                uploadSuccess: true,
            });
        }
    } catch (error) {
        myAlert.error('目录处理失败');
        uploading.value = false;
        return;
    }
    /* 结束新增逻辑 */

    logs.value.push('开始上传附件');

    await Promise.all(
        attachments.map((obj, i) => {
            const editFirstAttachment = (success: boolean, newName?: string) => {
                markdownList[i].uploadSuccess = success;
                markdownList[i].parsed.firstAttachment = newName ?? '';
            };
            const editAttachment = (index: number) => (success: boolean, newName?: string) => {
                markdownList[i].uploadSuccess = success;
                markdownList[i].parsed.fragments[index].attachment = newName ?? '';
            };

            const allFiles = obj.attachments.map((file, j) => ({ file, callback: editAttachment(j) }));
            if (obj.firstAttachment) {
                allFiles.push({ file: obj.firstAttachment, callback: editFirstAttachment });
            }

            return Promise.all(
                allFiles.map((o) =>
                    (async () => {
                        const { file, callback } = o;
                        try {
                            logs.value.push(`开始上传${file.name}`);
                            const response = await upload(file, session.token);
                            if (!response.success) {
                                switch (response.reason) {
                                    case UploadFileFail.NOT_LOGGED_IN:
                                        logs.value.push(`上传${file.name}失败: 未登录`);
                                        break;
                                    case UploadFileFail.UNKNOWN:
                                        logs.value.push(`上传${file.name}失败: 未知错误`);
                                }
                                callback(false);
                                return;
                            }
                            logs.value.push(`上传${file.name}成功`);
                            callback(true, response.uploadedName);
                        } catch (e) {
                            logs.value.push(`上传 ${file.name}失败: 网络错误`);
                            callback(false);
                        }
                    })(),
                ),
            );
        }),
    );

    logs.value.push('开始上传考试信息');

    await Promise.all(
        markdownList
            .filter((o) => o.uploadSuccess)
            .map((o) =>
                (async () => {
                    logs.value.push(`开始上传${o.name}`);
                    try {
                        const response = await request('/create-exam-info', {
                            token: session.token,
                            title: o.name,
                            content: rebuildMarkdown(o.parsed),
                            categoryId: selectedCategory.value,
                        });

                        if (!response.success) {
                            switch (response.reason) {
                                case CreateExamInfoFail.NOT_LOGGED_IN:
                                    logs.value.push(`上传${o.name}失败: 未登录`);
                                    break;
                                case CreateExamInfoFail.NO_PERMISSION:
                                    logs.value.push(`上传${o.name}失败: 无权限`);
                                    break;
                                case CreateExamInfoFail.CATEGORY_NOT_EXISTS:
                                    logs.value.push(`上传${o.name}失败: 类别不存在`);
                                    break;
                                case CreateExamInfoFail.UNKNOWN:
                                    logs.value.push(`上传${o.name}失败: 未知错误`);
                            }
                            return;
                        }

                        logs.value.push(`上传${o.name}成功`);
                    } catch (e) {
                        logs.value.push(`上传${o.name}失败: 网络错误`);
                    }
                })(),
            ),
    );
    uploading.value = false;
};
</script>

<style lang="scss" scoped>
.category-container {
    margin-bottom: 1rem;
}

.upload-icon {
    font-size: 5rem;
}

.log-container {
    margin-top: 1rem;
    padding: 0.5em;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    font-family: 'Jetbrains Mono', 'Consolas', 'Courier New', Courier, monospace;
}
</style>
