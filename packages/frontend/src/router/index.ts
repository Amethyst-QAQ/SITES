import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import RegisterView from '@/views/RegisterView.vue';
import LoginView from '@/views/LoginView.vue';
import BaseView from '@/views/BaseView.vue';
import { adminRoute } from './admin';
import { examInfoRoute } from './exam-info';
import { knowledgeRoute } from './knowledge';
import { useSessionStore } from '@/stores/session';

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
                examInfoRoute,
                knowledgeRoute,
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
        adminRoute,
    ],
});

router.beforeEach(async (to, from) => {
    const session = useSessionStore();
    if (!session.loggedIn) {
        return true;
    }

    if (to.meta.isLearning && !from.meta.isLearning) {
        await session.startLearning();
    } else if (!to.meta.isLearning && session.isLearning) {
        await session.stopLearning();
    }
    return true;
});

export default router;
