import { myAlert } from '@/lib/my-alert';
import { useSessionStore } from '@/stores/session';
import AdminHomeView from '@/views/admin/AdminHomeView.vue';
import AdminView from '@/views/AdminView.vue';
import { PermissionLevel } from 'types/lib/permission-level';
import type { RouteRecordRaw } from 'vue-router';
import { adminExamInfoRoutes } from './admin/exam-info';
import { adminKnowledgeRoutes } from './admin/knowledge';
import { adminQuestionRoutes } from './admin/question';

export const adminRoute: RouteRecordRaw = {
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
        ...adminExamInfoRoutes,
        ...adminKnowledgeRoutes,
        ...adminQuestionRoutes,
    ],
};
