<template>
    <div class="send-frame">
        <ElButton @click="router.push('/forum/create-post')" v-if="session.loggedIn">发帖</ElButton>
        <span v-else><RouterLink class="login-link" to="/login">登录</RouterLink>后发帖</span>
    </div>
    <div class="main-frame">
        <ElSkeleton v-if="countLoading" :rows="10" animated :throttle="300" />
        <template v-else-if="posts.length > 0">
            <div v-for="post in posts" class="post-card">
                <h2>
                    <RouterLink :to="{ name: 'post', params: { id: post.id } }">{{ post.title }}</RouterLink>
                </h2>
            </div>
            <PageSelector :total="pageCount" v-model="currentPage" @change="jumpToPage" />
        </template>
        <ElEmpty v-else description="暂无帖子" />
    </div>
</template>

<script lang="ts" setup>
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import router from '@/router';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElEmpty, ElSkeleton } from 'element-plus';
import type { PostInList } from 'types/api/get-posts';
import { onMounted, ref } from 'vue';

const session = useSessionStore();

const countLoading = ref(true);
const pageCount = ref(0);
const currentPage = ref(0);
const pageLoading = ref(false);
const posts = ref<PostInList[]>([]);
const loadCount = async () => {
    try {
        const response = await request('/count-posts', {});
        if (!response.success) {
            myAlert.error('获取帖子数量失败: 未知错误');
            return;
        }
        pageCount.value = Math.ceil(response.count / 20);
        countLoading.value = false;
        await jumpToPage(0);
    } catch (e) {
        myAlert.error('获取帖子数量失败: 网络错误');
    }
};
const jumpToPage = async (page: number) => {
    pageLoading.value = true;
    currentPage.value = page;
    try {
        const response = await request('/get-posts', {
            from: page * 20,
            count: 20,
        });
        if (!response.success) {
            myAlert.error('获取帖子列表失败: 未知错误');
            return;
        }
        posts.value = response.data;
        pageLoading.value = false;
    } catch (e) {
        myAlert.error('获取帖子列表失败: 网络错误');
    }
};

onMounted(async () => {
    await loadCount();
});
</script>

<style lang="scss" scoped>
.send-frame {
    max-width: var(--main-frame-width);
    margin: 1rem auto;
}

.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.post-card {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 0.25rem 1rem 0.5rem 1rem;
    margin-bottom: 0.5rem;

    &:hover {
        background-color: rgba($color: white, $alpha: 0.1);
    }

    h2 {
        margin: 0;
    }

    a {
        color: var(--el-text-color-primary);
        text-decoration: none;
    }
}
</style>
