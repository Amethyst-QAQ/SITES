<template>
    <div class="title-frame">
        <h1>{{ title }}</h1>
    </div>
    <div class="main-frame">
        <MarkdownComponent :content="content" />
        <div class="send-container">
            <div v-if="session.loggedIn" class="send-bar">
                <ElInput v-model="inputtingComment" />
                <ElButton @click="createComment">发送</ElButton>
            </div>
            <span v-else><RouterLink class="login-link" to="/login">登录</RouterLink>后发送评论</span>
            <ElSkeleton v-if="countLoading" :rows="10" animated :throttle="300" />
            <template v-else-if="currentPage.length > 0">
                <div>
                    <div v-for="item in currentPage" class="comment">
                        <MarkdownComponent :content="item.content" />
                    </div>
                </div>
                <PageSelector :total="pageCount" v-model="currentPageId" @change="jumpToPage" />
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElInput, ElSkeleton } from 'element-plus';
import { CountCommentsFail } from 'types/api/count-comments';
import { CreateCommentFail } from 'types/api/create-comment';
import { type CommentInList, GetCommentsFail } from 'types/api/get-comments';
import { GetPostContentFail } from 'types/api/get-post-content';
import { onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const title = ref('');
const content = ref('');
const postLoading = ref(true);
const loadPost = async () => {
    try {
        const response = await request('/get-post-content', { id: props.id });
        if (!response.success) {
            switch (response.reason) {
                case GetPostContentFail.NOT_EXISTS:
                    myAlert.error('加载帖子失败: 帖子不存在');
                    break;
                case GetPostContentFail.UNKNOWN:
                    myAlert.error('加载帖子失败: 未知错误');
            }
            return;
        }
        title.value = response.data.title;
        content.value = response.data.content;
        postLoading.value = false;
        await loadCount();
    } catch (e) {
        myAlert.error('加载帖子失败: 网络错误');
    }
};

const session = useSessionStore();
const inputtingComment = ref('');

const pageCount = ref(0);
const countLoading = ref(true);
const currentPageId = ref(0);
const currentPage = ref<CommentInList[]>([]);
const pageLoading = ref(false);

const jumpToPage = async (id: number) => {
    currentPageId.value = id;
    pageLoading.value = true;
    try {
        const response = await request('/get-comments', { postId: props.id, from: id * 20, count: 20 });
        if (!response.success) {
            switch (response.reason) {
                case GetCommentsFail.NOT_EXISTS:
                    myAlert.error('获取评论列表失败: 帖子不存在');
                    break;
                case GetCommentsFail.UNKNOWN:
                    myAlert.error('获取评论列表失败: 未知错误');
            }
            return;
        }
        currentPage.value = response.data;
        pageLoading.value = false;
    } catch (e) {
        myAlert.error('获取评论列表失败: 网络错误');
    }
};

const loadCount = async () => {
    countLoading.value = true;
    try {
        const response = await request('/count-comments', { postId: props.id });
        if (!response.success) {
            switch (response.reason) {
                case CountCommentsFail.NOT_EXISTS:
                    myAlert.error('获取评论总数失败: 帖子不存在');
                    break;
                case CountCommentsFail.UNKNOWN:
                    myAlert.error('获取评论总数失败: 未知错误');
            }
            return;
        }
        pageCount.value = Math.ceil(response.count / 20);
        countLoading.value = false;
        await jumpToPage(0);
    } catch (e) {
        myAlert.error('获取评论总数失败: 网络错误');
    }
};

onMounted(async () => {
    await loadPost();
});

const createComment = async () => {
    try {
        const response = await request('/create-comment', {
            token: session.token,
            postId: props.id,
            content: inputtingComment.value,
        });
        if (!response.success) {
            switch (response.reason) {
                case CreateCommentFail.NOT_LOGGED_IN:
                    myAlert.error('发送评论失败: 未登录');
                    break;
                case CreateCommentFail.POST_NOT_EXISTS:
                    myAlert.error('发送评论失败: 帖子不存在');
                    break;
                case CreateCommentFail.PARENT_NOT_EXISTS:
                    myAlert.error('发送评论失败: 要回复的评论不存在');
                    break;
                case CreateCommentFail.UNKNOWN:
                    myAlert.error('发送评论失败: 未知错误');
            }
        }
        inputtingComment.value = '';
        await loadCount();
    } catch (e) {
        myAlert.error('发送评论失败: 网络错误');
    }
};
</script>

<style lang="scss" scoped>
.title-frame {
    max-width: var(--main-frame-width);
    margin: 0 auto;
}

.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.send-container {
    margin: 0.5rem 0;
}

.send-bar {
    display: flex;
    > *:first-child {
        margin-right: 1rem;
    }
}

.comment:not(:first-child) {
    border-top: 1px solid var(--el-border-color);
}
</style>
