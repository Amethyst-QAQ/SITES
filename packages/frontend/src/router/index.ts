import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import BaseView from '@/views/BaseView.vue';
import AdminView from '@/views/AdminView.vue';
import { useSessionStore } from '@/stores/session';
import { myAlert } from '@/lib/my-alert';
import { PermissionLevel } from 'types/lib/permission-level';
import AdminHomeView from '@/views/admin/AdminHomeView.vue';
import ExamInfoUploadView from '@/views/admin/ExamInfoUploadView.vue';
import ExamInfoCategoryManagementView from '@/views/admin/ExamInfoCategoryManagementView.vue';
import ExamInfoManagementView from '@/views/admin/ExamInfoManagementView.vue';
import ExamInfoEditView from '@/views/admin/ExamInfoEditView.vue';
import ExamInfoView from '@/views/ExamInfoView.vue';
import ExamInfoFileView from '@/views/ExamInfoFileView.vue';
import ExamInfoCategoryView from '@/views/ExamInfoCategoryView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            component: BaseView,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: HomeView,
                },
                {
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
                            props: true,
                        },
                        {
                            path: 'file/:id',
                            name: 'exam-info-file',
                            component: ExamInfoFileView,
                            props: true,
                        },
                    ],
                },
            ],
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/admin',
            component: AdminView,
            beforeEnter: () => {
                const session = useSessionStore();
                if (!session.loggedIn || !session.userInfo) {
                    myAlert.error('未登录');
                    return false;
                }
                if (session.userInfo.permissionLevel < PermissionLevel.ADMIN) {
                    myAlert.error('权限不足');
                    return false;
                }
                return true;
            },
            children: [
                {
                    path: '',
                    name: 'admin-home',
                    component: AdminHomeView,
                },
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
                    props: true,
                },
            ],
        },
    ],
});

export default router;
