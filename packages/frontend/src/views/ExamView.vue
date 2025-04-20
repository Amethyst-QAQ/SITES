<template>
    <div class="main-frame">
        <ElSkeleton v-if="questionsLoading" :rows="10" animated :throttle="300" />
        <template v-else>
            <h2 style="margin-block-start: 0">{{ `第 ${currentQuestionId + 1} / ${questions.length} 题` }}</h2>
            <template v-if="currentQuestion.type == QuestionType.CHOICE">
                <MarkdownComponent :content="currentQuestion.description" />
                <div
                    class="choice-frame"
                    v-for="i in currentQuestion.choices.length"
                    :style="currentChoiceStyle(i)"
                    @click="chooseAnswer(i)"
                >
                    <div class="choice-id">{{ String.fromCharCode('A'.charCodeAt(0) + i - 1) }}</div>
                    <MarkdownComponent :content="currentQuestion.choices[i - 1]" />
                </div>
            </template>
            <template v-else>
                <MarkdownComponent :content="currentQuestion.description" />
                <ElInput type="textarea" v-model="tempAnswer[currentQuestionId]" />
            </template>
            <div class="buttons-container">
                <ElButton :disabled="currentQuestionId == 0" @click="currentQuestionId--">上一题</ElButton>
                <ElButton :disabled="!canSubmit" @click="submit">提交</ElButton>
                <ElButton :disabled="currentQuestionId == questions.length - 1" @click="currentQuestionId++">
                    下一题
                </ElButton>
            </div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElInput, ElSkeleton } from 'element-plus';
import {
    GetExamQuestionsFail,
    QuestionType,
    type ChoiceQuestionInList,
    type SubjectiveQuestionInList,
} from 'types/api/get-exam-questions';
import { SubmitExamFail } from 'types/api/submit-exam';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    examToken: {
        type: String,
        required: true,
    },
});

const session = useSessionStore();

const questions = ref<(ChoiceQuestionInList | SubjectiveQuestionInList)[]>([]);
const questionsLoading = ref(true);
const currentQuestionId = ref(0);
const currentQuestion = computed(() => questions.value[currentQuestionId.value]);
const tempAnswer = ref<Record<number, number | string>>({});

const loadQuestions = async () => {
    try {
        const response = await request('/get-exam-questions', {
            token: session.token,
            examToken: props.examToken,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetExamQuestionsFail.NOT_LOGGED_IN:
                    myAlert.error('加载练习失败: 未登录');
                    break;
                case GetExamQuestionsFail.NOT_EXISTS:
                    myAlert.error('加载练习失败: 练习不存在');
                    break;
                case GetExamQuestionsFail.ENDED:
                    myAlert.error('加载练习失败: 练习已提交');
                    break;
                case GetExamQuestionsFail.UNKNOWN:
                    myAlert.error('加载练习失败: 未知错误');
            }
            return;
        }
        questions.value = response.data.questions;
        for (const [i, question] of response.data.questions.entries()) {
            if (question.type == QuestionType.SUBJECTIVE) {
                tempAnswer.value[i] = '';
            }
        }
    } catch (e) {
        myAlert.error('加载练习失败: 网络错误');
    }
    questionsLoading.value = false;
};

onMounted(async () => {
    await loadQuestions();
});

const currentChoiceStyle = (id: number) => {
    const currentAnswer = tempAnswer.value[currentQuestionId.value];
    if (currentAnswer === undefined) {
        return { borderColor: 'var(--el-border-color)' };
    }

    return {
        borderColor: currentAnswer == id - 1 ? 'var(--el-color-primary)' : 'var(--el-border-color)',
    };
};

const chooseAnswer = (id: number) => {
    tempAnswer.value[currentQuestionId.value] = id - 1;
};

const canSubmit = computed(() => {
    for (const [i, question] of questions.value.entries()) {
        if (question.type == QuestionType.CHOICE && tempAnswer.value[i] === undefined) {
            return false;
        }
    }
    return true;
});

const router = useRouter();

const submit = async () => {
    const answers = questions.value.map((_, i) => tempAnswer.value[i]);
    try {
        const response = await request('/submit-exam', {
            token: session.token,
            examToken: props.examToken,
            answers,
        });
        if (!response.success) {
            switch (response.reason) {
                case SubmitExamFail.NOT_LOGGED_IN:
                    myAlert.error('提交测试失败: 未登录');
                    break;
                case SubmitExamFail.WRONG_DATA:
                    myAlert.error('提交测试失败: 数据错误');
                    break;
                case SubmitExamFail.UNKNOWN:
                    myAlert.error('提交测试失败: 未知错误');
                    break;
            }
        }
        router.replace({
            name: 'exam-result',
            params: { examToken: props.examToken },
        });
    } catch (e) {
        myAlert.error('提交测试失败: 网络错误');
    }
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

.buttons-container {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.choice-frame {
    display: flex;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    &:not(:first-child) {
        margin-top: 1rem;
    }
    &:hover {
        background-color: rgba($color: white, $alpha: 0.1);
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
