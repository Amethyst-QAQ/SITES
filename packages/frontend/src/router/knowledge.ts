import KnowledgeCategoriesView from '@/views/KnowledgeCategoriesView.vue';
import KnowledgeCategoryView from '@/views/KnowledgeCategoryView.vue';
import KnowledgeItemsView from '@/views/KnowledgeItemsView.vue';
import KnowledgeItemView from '@/views/KnowledgeItemView.vue';
import KnowledgeView from '@/views/KnowledgeView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const knowledgeRoute: RouteRecordRaw = {
    path: 'knowledge',
    children: [
        {
            path: '',
            name: 'knowledge',
            component: KnowledgeView,
        },
        {
            path: 'categories',
            name: 'knowledge-categories',
            component: KnowledgeCategoriesView,
        },
        {
            path: 'category/:id',
            name: 'knowledge-category',
            component: KnowledgeCategoryView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
        },
        {
            path: 'items/:id',
            name: 'knowledge-items',
            component: KnowledgeItemsView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
            meta: { isLearning: true },
        },
        {
            path: 'item/:id',
            name: 'knowledge-item',
            component: KnowledgeItemView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
            meta: { isLearning: true },
        },
    ],
};
