import ExamKnowledgeCategoriesView from '@/views/ExamKnowledgeCategoriesView.vue';
import ExamKnowledgeView from '@/views/ExamKnowledgeView.vue';
import ExamResultView from '@/views/ExamResultView.vue';
import ExamView from '@/views/ExamView.vue';
import QuestionsView from '@/views/QuestionsView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const questionsRoute: RouteRecordRaw = {
    path: 'questions',
    children: [
        {
            path: '',
            name: 'questions',
            component: QuestionsView,
        },
        {
            path: 'exam/:examToken',
            name: 'exam',
            component: ExamView,
            props: (route) => ({ examToken: route.params.examToken as string }),
        },
        {
            path: 'exam-result/:examToken',
            name: 'exam-result',
            component: ExamResultView,
            props: (route) => ({ examToken: route.params.examToken as string }),
        },
        {
            path: 'exam-knowledge-categories',
            name: 'exam-knowledge-categories',
            component: ExamKnowledgeCategoriesView,
        },
        {
            path: 'exam-knowledge/:id',
            name: 'exam-knowledge',
            component: ExamKnowledgeView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
        },
    ],
};
