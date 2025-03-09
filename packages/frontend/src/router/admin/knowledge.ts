import type { RouteRecordRaw } from 'vue-router';
import KnowledgeCategoryEditView from '@/views/admin/KnowledgeCategoryEditView.vue';
import KnowledgeCategoryManagementView from '@/views/admin/KnowledgeCategoryManagementView.vue';
import KnowledgeItemEditView from '@/views/admin/KnowledgeItemEditView.vue';
import KnowledgeItemManagementView from '@/views/admin/KnowledgeItemManagementView.vue';
import KnowledgeManagementView from '@/views/admin/KnowledgeManagementView.vue';
import KnowledgeUploadView from '@/views/admin/KnowledgeUploadView.vue';

export const adminKnowledgeRoutes: RouteRecordRaw[] = [
    {
        path: 'knowledge-category-management',
        name: 'knowledge-category-management',
        component: KnowledgeCategoryManagementView,
    },
    {
        path: 'knowledge-category-edit/:id',
        name: 'knowledge-category-edit',
        component: KnowledgeCategoryEditView,
        props: (route) => ({ id: parseInt(route.params.id as string) }),
    },
    {
        path: 'knowledge-upload',
        name: 'knowledge-upload',
        component: KnowledgeUploadView,
    },
    {
        path: 'knowledge-management',
        name: 'knowledge-management',
        component: KnowledgeManagementView,
    },
    {
        path: 'knowledge-item-management/:knowledgeId',
        name: 'knowledge-item-management',
        component: KnowledgeItemManagementView,
        props: (route) => ({ knowledgeId: parseInt(route.params.knowledgeId as string) }),
    },
    {
        path: 'knowledge-item-edit/:id',
        name: 'knowledge-item-edit',
        component: KnowledgeItemEditView,
        props: (route) => ({ id: parseInt(route.params.id as string) }),
    },
];
