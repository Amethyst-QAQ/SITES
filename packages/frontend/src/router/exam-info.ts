import ExamInfoCategoryView from '@/views/ExamInfoCategoryView.vue';
import ExamInfoFileView from '@/views/ExamInfoFileView.vue';
import ExamInfoView from '@/views/ExamInfoView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const examInfoRoute: RouteRecordRaw = {
    path: 'exam-info',
    children: [
        {
            path: '',
            name: 'exam-info',
            component: ExamInfoView,
        },
        {
            path: 'category/:id',
            name: 'exam-info-category',
            component: ExamInfoCategoryView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
        },
        {
            path: 'file/:id',
            name: 'exam-info-file',
            component: ExamInfoFileView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
        },
    ],
};
