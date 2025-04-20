<template>
    <div class="main-frame">
        <h2>练习成绩</h2>
        <ElSkeleton v-if="resultsLoading" :rows="10" animated :throttle="300" />
        <template v-else>
            <div class="summary-container">
                <div
                    class="summary"
                    v-for="i in results.length"
                    :style="summaryStyle(i)"
                    @click="currentResultId = i - 1"
                >
                    {{ i }}
                </div>
            </div>
            <template v-if="currentResult.type == QuestionType.CHOICE">
                <MarkdownComponent :content="currentResult.question.description" />
                <div class="choice-frame" v-for="i in currentResult.question.choices.length">
                    <div class="choice-id">{{ String.fromCharCode('A'.charCodeAt(0) + i - 1) }}</div>
                    <MarkdownComponent :content="currentResult.question.choices[i - 1]" />
                </div>
                <p>
                    <span>我的答案：</span>
                    <span>{{ String.fromCharCode('A'.charCodeAt(0) + currentResult.myAnswer) }}</span>
                    <span>，正确答案：</span>
                    <span>{{ String.fromCharCode('A'.charCodeAt(0) + currentResult.answer) }}</span>
                </p>
            </template>
            <template v-else>
                <MarkdownComponent :content="currentResult.question.description" />
                <h2>我的答案</h2>
                <MarkdownComponent :content="currentResult.myAnswer" />
                <h2>解析</h2>
                <MarkdownComponent :content="currentResult.answer" />
            </template>
        </template>
    </div>
</template>

<script lang="ts" setup>
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElSkeleton } from 'element-plus';
import { QuestionType } from 'types/api/get-exam-questions';
import { GetExamResultFail, type ChoiceQuestionResult, type SubjectiveQuestionResult } from 'types/api/get-exam-result';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    examToken: {
        type: String,
        required: true,
    },
});

const session = useSessionStore();
const results = ref<(ChoiceQuestionResult | SubjectiveQuestionResult)[]>([]);
const resultsLoading = ref(true);
const loadResults = async () => {
    try {
        const response = await request('/get-exam-result', {
            token: session.token,
            examToken: props.examToken,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetExamResultFail.NOT_LOGGED_IN:
                    myAlert.error('获取练习成绩失败: 未登录');
                    break;
                case GetExamResultFail.NOT_EXISTS:
                    myAlert.error('获取练习成绩失败: 练习不存在');
                    break;
                case GetExamResultFail.NO_ANSWER:
                    myAlert.error('获取练习成绩失败: 练习未作答');
                    break;
                case GetExamResultFail.UNKNOWN:
                    myAlert.error('获取练习成绩失败: 未知错误');
            }
            return;
        }
        results.value = response.data;
        resultsLoading.value = false;
    } catch (e) {
        myAlert.error('获取练习成绩失败: 网络错误');
    }
};

onMounted(async () => {
    await loadResults();
});

const currentResultId = ref(0);
const currentResult = computed(() => results.value[currentResultId.value]);

const summaryStyle = (id: number) => {
    const borderColor = id == currentResultId.value + 1 ? 'var(--el-color-primary)' : 'var(--el-border-color)';
    let backgroundColor: string;
    const result = results.value[id - 1];
    if (result.type == QuestionType.CHOICE) {
        backgroundColor = result.answer == result.myAnswer ? 'var(--el-color-success)' : 'var(--el-color-error)';
    } else {
        backgroundColor = 'var(--el-color-warning)';
    }
    return { borderColor, backgroundColor };
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
    margin-top: 1rem;
}

.summary-container {
    display: flex;
    margin-bottom: 1rem;
}

.summary {
    font-size: 1.5rem;
    font-weight: bold;
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    border-radius: 1rem;
    border: 1px solid;
    &:not(:first-child) {
        margin-left: 0.5rem;
    }
    &:hover {
        color: var(--el-color-primary);
    }
}

.choice-frame {
    display: flex;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    &:not(:first-child) {
        margin-top: 1rem;
    }
}

.choice-id {
    font-size: 2rem;
    font-weight: bold;
    padding: 0 1rem;
    margin-right: 1rem;
    border-right: 1px solid var(--el-border-color);
}
</style>
