import QuestionUploadView from '@/views/admin/QuestionUploadView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const adminQuestionRoutes: RouteRecordRaw[] = [
    {
        path: 'question-upload/:knowledgeId',
        name: 'question-upload',
        component: QuestionUploadView,
        props: (route) => ({ knowledgeId: parseInt(route.params.knowledgeId as string) }),
    },
];
