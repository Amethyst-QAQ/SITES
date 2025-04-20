import CreatePostView from '@/views/CreatePostView.vue';
import ForumView from '@/views/ForumView.vue';
import PostView from '@/views/PostView.vue';
import type { RouteRecordRaw } from 'vue-router';

export const forumRoute: RouteRecordRaw = {
    path: 'forum',
    children: [
        {
            path: '',
            name: 'forum',
            component: ForumView,
        },
        {
            path: 'create-post',
            name: 'create-post',
            component: CreatePostView,
        },
        {
            path: 'post/:id',
            name: 'post',
            component: PostView,
            props: (route) => ({ id: parseInt(route.params.id as string) }),
        },
    ],
};
