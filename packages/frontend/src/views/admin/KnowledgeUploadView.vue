<template>
    <div class="category-container">
        <ElSkeleton :rows="1" animated v-if="categoryLoading" :throttle="300" />
        <template v-else-if="categoryPageCount > 0">
            <ElFormItem label="上传到">
                <ElSelect v-model="selectedCategory" :empty-values="[-1]">
                    <ElOption
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                    />
                </ElSelect>
            </ElFormItem>
            <PageSelector :total="categoryPageCount" v-model="currentCategoryPage" @change="jumpToPage" />
        </template>
        <ElEmpty v-else description="暂无大考点" />
    </div>
    <div v-if="selectedCategory >= 0">
        <MarkdownComponent :content="manual" />
        <ElButton @click="uploadKnowledge" :disabled="uploading">选择一个文件夹</ElButton>
        <div class="log-container" v-if="logs.length > 0">
            <div v-for="i in logs">{{ i }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { ElButton, ElFormItem, ElOption, ElSelect, ElSkeleton } from 'element-plus';
import { onMounted, ref } from 'vue';
import manual from '@/assets/knowledge-upload-manual.md?raw';
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import { useSessionStore } from '@/stores/session';
import { ListFileError, uploadFolder } from '@/lib/upload-folder';
import { CreateKnowledgeFail } from 'types/api/create-knowledge';
import { rebuildMarkdown } from '@/lib/parse-attachments';
import { CreateKnowledgeItemFail } from 'types/api/create-knowledge-item';

const categoryLoading = ref(true);
const categoryPageCount = ref(0);
const currentCategoryPage = ref(0);
const categories = ref<{ id: number; name: string }[]>([]);

const jumpToPage = async (page: number) => {
    try {
        categoryLoading.value = true;
        const response = await request('/get-knowledge-categories', {
            from: page * 10,
            count: 10,
        });
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

const loadCategories = async () => {
    try {
        const response = await request('/count-knowledge-categories', {});
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        categoryPageCount.value = Math.ceil(response.count / 10);
        currentCategoryPage.value = 0;
        await jumpToPage(0);
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

const uploadKnowledge = async () => {
    uploading.value = true;
    logs.value = [];

    const directoryHandle = (await (window as any).showDirectoryPicker()) as FileSystemDirectoryHandle;

    const children: { name: string; importance: number; dir: FileSystemDirectoryHandle }[] = [];
    for await (const entry of (directoryHandle as any).values()) {
        if (entry.kind === 'directory') {
            const dir = entry as FileSystemDirectoryHandle;
            const matchName = /^(\d+.\d+)-(.+)$/.exec(dir.name);
            if (matchName) {
                logs.value.push(`找到文件夹${dir.name}`);
                children.push({
                    name: matchName[2],
                    importance: parseFloat(matchName[1]),
                    dir,
                });
            }
        }
    }

    await Promise.all(
        children.map((o) =>
            (async () => {
                logs.value.push(`开始上传${o.name}`);
                try {
                    const createKnowledgeResponse = await request('/create-knowledge', {
                        token: session.token,
                        title: o.name,
                        importance: o.importance,
                        categoryId: selectedCategory.value,
                    });
                    if (!createKnowledgeResponse.success) {
                        switch (createKnowledgeResponse.reason) {
                            case CreateKnowledgeFail.NOT_LOGGED_IN:
                                logs.value.push(`上传${o.name}失败: 未登录`);
                                break;
                            case CreateKnowledgeFail.NO_PERMISSION:
                                logs.value.push(`上传${o.name}失败: 无权限`);
                                break;
                            case CreateKnowledgeFail.NOT_EXISTS:
                                logs.value.push(`上传${o.name}失败: 类别不存在`);
                                break;
                            case CreateKnowledgeFail.UNKNOWN:
                                logs.value.push(`上传${o.name}失败: 未知错误`);
                        }
                        return;
                    }
                    logs.value.push(`上传${o.name}成功`);

                    const knowledgeId = createKnowledgeResponse.id;

                    try {
                        const markdownList = (await uploadFolder(o.dir, logs.value)).map((m) => ({
                            name: m.name,
                            content: rebuildMarkdown(m.parsed),
                        }));

                        logs.value.push('开始上传知识点');
                        await Promise.all(
                            markdownList.map((m) =>
                                (async () => {
                                    logs.value.push(`开始上传${m.name}`);
                                    try {
                                        const response = await request('/create-knowledge-item', {
                                            token: session.token,
                                            title: m.name,
                                            content: m.content,
                                            knowledgeId,
                                        });

                                        if (!response.success) {
                                            switch (response.reason) {
                                                case CreateKnowledgeItemFail.NOT_LOGGED_IN:
                                                    logs.value.push(`上传${m.name}失败: 未登录`);
                                                    break;
                                                case CreateKnowledgeItemFail.NO_PERMISSION:
                                                    logs.value.push(`上传${m.name}失败: 无权限`);
                                                    break;
                                                case CreateKnowledgeItemFail.NOT_EXISTS:
                                                    logs.value.push(`上传${m.name}失败: 类别不存在`);
                                                    break;
                                                case CreateKnowledgeItemFail.UNKNOWN:
                                                    logs.value.push(`上传${m.name}失败: 未知错误`);
                                            }
                                            return;
                                        }

                                        logs.value.push(`上传${m.name}成功`);
                                    } catch (e) {
                                        logs.value.push(`上传${o.name}失败: 网络错误`);
                                    }
                                })(),
                            ),
                        );
                    } catch (e) {
                        if (e instanceof ListFileError) {
                            logs.value.push(`获取文件列表失败`);
                        } else {
                            logs.value.push(`未知错误`);
                        }
                        return;
                    }
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

.log-container {
    margin-top: 1rem;
    padding: 0.5em;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    font-family: 'Jetbrains Mono', 'Consolas', 'Courier New', Courier, monospace;
}
</style>
