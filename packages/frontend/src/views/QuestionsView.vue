<template>
    <div class="main-frame" style="margin-top: 1rem">
        <template v-if="session.loggedIn">
            <h3>练习记录</h3>
            <ElSkeleton v-if="historyLoading" :rows="5" animated :throttle="300" />
            <template v-else-if="history.length > 0">
                <div class="history-container">
                    <div class="history" v-for="i in history">
                        <div>
                            <span>提交时间:</span>
                            <span>{{ new Date(i.date).toLocaleDateString() }}</span>
                        </div>
                        <ElButton @click="gotoResult(i)">查看</ElButton>
                    </div>
                </div>
                <RouterLink class="login-link" to="/knowledge/categories">查看更多</RouterLink>
            </template>
            <ElEmpty v-else description="暂无练习记录" />
        </template>
        <span v-else><RouterLink class="login-link" to="/login">登录</RouterLink>后查看练习记录</span>
    </div>
    <div class="button-frame">
        <ElButton v-if="session.loggedIn" @click="createExam">开始练习</ElButton>
        <span v-else><RouterLink class="login-link" to="/login">登录</RouterLink>以开始练习</span>
    </div>
    <div class="main-frame">
        <h3>大考点列表</h3>
        <ElSkeleton v-if="categoriesLoading" :rows="5" animated :throttle="300" />
        <template v-else-if="categories.length > 0">
            <div class="scroll-bar-container">
                <ElScrollbar>
                    <div class="card-list">
                        <ElCard v-for="category in categories" class="category-card">
                            <div class="card-content">
                                <RouterLink :to="{ name: 'exam-knowledge', params: { id: category.id } }">
                                    {{ category.name }}
                                </RouterLink>
                            </div>
                        </ElCard>
                    </div>
                </ElScrollbar>
            </div>
            <RouterLink class="login-link" to="/questions/exam-knowledge-categories">查看更多</RouterLink>
        </template>
        <ElEmpty v-else description="暂无大考点" />
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElSkeleton, ElScrollbar, ElCard, ElEmpty } from 'element-plus';
import { CreateExamFail } from 'types/api/create-exam';
import { GetExamsFail, type ExamInList } from 'types/api/get-exams';
import type { KnowledgeCategoryInList } from 'types/api/get-knowledge-categories';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const session = useSessionStore();

const historyLoading = ref(true);
const history = ref<ExamInList[]>([]);
const loadHistory = async () => {
    if (!session.loggedIn) {
        return;
    }
    try {
        const response = await request('/get-exams', {
            from: 0,
            count: 10,
            token: session.token,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetExamsFail.NOT_LOGGED_IN:
                    myAlert.error('获取练习记录失败: 未登录');
                    break;
                case GetExamsFail.UNKNOWN:
                    myAlert.error('获取练习记录失败: 未知错误');
            }
            return;
        }
        history.value = response.data;
    } catch (e) {
        myAlert.error('获取练习记录失败: 网络错误');
    }
    historyLoading.value = false;
};

const categoriesLoading = ref(true);
const categories = ref<KnowledgeCategoryInList[]>([]);
const loadCategories = async () => {
    try {
        const response = await request('/get-knowledge-categories', {
            from: 0,
            count: 10,
        });
        if (!response.success) {
            myAlert.error('获取大考点列表失败: 未知错误');
            return;
        }
        categories.value = response.data;
        categoriesLoading.value = false;
    } catch (e) {
        myAlert.error('获取大考点列表失败: 网络错误');
    }
};

onMounted(async () => {
    await Promise.all([loadHistory(), loadCategories()]);
});

const router = useRouter();

const createExam = async () => {
    try {
        const response = await request('/create-exam', { token: session.token });
        if (!response.success) {
            switch (response.reason) {
                case CreateExamFail.NOT_LOGGED_IN:
                    myAlert.error('开始练习失败: 未登录');
                    break;
                case CreateExamFail.NOT_EXISTS:
                    myAlert.error('开始练习失败: 考点不存在');
                    break;
                case CreateExamFail.NO_QUESTIONS:
                    myAlert.error('开始练习失败: 没有任何习题');
                    break;
                case CreateExamFail.UNKNOWN:
                    myAlert.error('开始练习失败: 未知错误');
            }
            return;
        }
        router.push({
            name: 'exam',
            params: { examToken: response.examToken },
        });
    } catch (e) {
        myAlert.error('开始练习失败: 网络错误');
    }
};

const gotoResult = (i: { token: string }) => {
    router.push({
        name: 'exam-result',
        params: { examToken: i.token },
    });
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.button-frame {
    max-width: var(--main-frame-width);
    margin: 0 auto;
    padding: 1rem 0;
}

.card-list {
    display: flex;
}

.category-card {
    width: 10rem;
    word-break: break-all;
    flex-shrink: 0;

    &:not(:last-child) {
        margin-right: 1rem;
    }
}
.card-content {
    > a {
        color: var(--el-text-color-primary);
        text-decoration: none;
    }
    :last-child {
        margin-top: auto;
    }
}

.history {
    display: flex;
    justify-content: space-between;
    &:not(:first-child) {
        margin-top: 0.25rem;
        border-top: 1px solid var(--el-border-color);
        padding-top: 0.25rem;
    }
}
</style>
