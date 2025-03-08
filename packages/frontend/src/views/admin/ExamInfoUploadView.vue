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
import { rebuildMarkdown } from '@/lib/parse-attachments';
import { uploadFolder } from '@/lib/upload-folder';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElFormItem, ElOption, ElSelect, ElSkeleton } from 'element-plus';
import { CreateExamInfoFail } from 'types/api/create-exam-info';
import { onMounted, ref } from 'vue';

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
    logs.value = [];

    const directoryHandle = (await (window as any).showDirectoryPicker()) as FileSystemDirectoryHandle;
    const markdownList = await uploadFolder(directoryHandle, logs.value);

    logs.value.push('开始上传考试信息');

    await Promise.all(
        markdownList.map((o) =>
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
