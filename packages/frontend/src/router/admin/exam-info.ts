import type { RouteRecordRaw } from 'vue-router';
import ExamInfoCategoryManagementView from '@/views/admin/ExamInfoCategoryManagementView.vue';
import ExamInfoEditView from '@/views/admin/ExamInfoEditView.vue';
import ExamInfoManagementView from '@/views/admin/ExamInfoManagementView.vue';
import ExamInfoUploadView from '@/views/admin/ExamInfoUploadView.vue';

export const adminExamInfoRoutes: RouteRecordRaw[] = [
    {
        path: 'exam-info-category-management',
        name: 'exam-info-category-management',
        component: ExamInfoCategoryManagementView,
    },
    {
        path: 'exam-info-upload',
        name: 'exam-info-upload',
        component: ExamInfoUploadView,
    },
    {
        path: 'exam-info-management',
        name: 'exam-info-management',
        component: ExamInfoManagementView,
    },
    {
        path: 'exam-info-edit/:id',
        name: 'exam-info-edit',
        component: ExamInfoEditView,
        props: (route) => ({ id: parseInt(route.params.id as string) }),
    },
];
