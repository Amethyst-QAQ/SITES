<template>
    <ElButton @click="uploadQuestions" :disabled="uploading">选择一个文件夹</ElButton>
    <div class="log-container" v-if="logs.length > 0">
        <div v-for="i in logs">{{ i }}</div>
    </div>
</template>

<script lang="ts" setup>
import { parseQuestion } from '@/lib/parse-question';
import { collectMdFiles } from '@/lib/upload-folder';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton } from 'element-plus';
import { UploadQuestionsFail, type ChoiceQuestion, type SubjectiveQuestion } from 'types/api/upload-questions';
import { ref } from 'vue';

const props = defineProps({
    knowledgeId: {
        type: Number,
        required: true,
    },
});

const logs = ref<string[]>([]);
const uploading = ref(false);
const session = useSessionStore();

const uploadQuestions = async () => {
    uploading.value = true;
    logs.value = [];
    try {
        const directoryHandle = (await (window as any).showDirectoryPicker()) as FileSystemDirectoryHandle;
        const mdFiles = await collectMdFiles(directoryHandle, logs.value);
        const questions: (ChoiceQuestion | SubjectiveQuestion)[] = [];
        for (const { fileHandle } of mdFiles) {
            const content = await (await fileHandle.getFile()).text();
            try {
                const parsed = parseQuestion(content);
                questions.push(parsed as any);
            } catch (e) {
                logs.value.push(`${fileHandle.name}格式不正确，已跳过`);
            }
        }
        try {
            const response = await request('/upload-questions', {
                knowledgeId: props.knowledgeId,
                token: session.token,
                questions,
            });
            if (response.success) {
                logs.value.push('上传成功');
            } else {
                switch (response.reason) {
                    case UploadQuestionsFail.NOT_LOGGED_IN:
                        logs.value.push('上传失败: 未登录');
                        break;
                    case UploadQuestionsFail.NO_PERMISSION:
                        logs.value.push('上传失败: 无权限');
                        break;
                    case UploadQuestionsFail.INVALID_DATA:
                        logs.value.push('上传失败: 数据无效');
                    case UploadQuestionsFail.UNKNOWN:
                        logs.value.push('上传失败: 未知错误');
                }
            }
        } catch (e) {
            logs.value.push('上传失败: 网络错误');
        }
    } catch (e) {
        logs.value.push('未知错误');
    } finally {
        uploading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.log-container {
    margin-top: 1rem;
    padding: 0.5em;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    font-family: 'Jetbrains Mono', 'Consolas', 'Courier New', Courier, monospace;
}
</style>
