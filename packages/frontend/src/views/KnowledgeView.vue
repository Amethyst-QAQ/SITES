<template>
    <div class="learn-container">
        <div class="learn-data">
            <ElCard>
                <template #header>
                    <h3 class="card-title">今日学习时长</h3>
                </template>
                <span v-if="!session.loggedIn">
                    <RouterLink class="login-link" to="/login">登录</RouterLink>后查看
                </span>
                <ElSkeleton v-else-if="learnTimeLoading" animated :throttle="300" />
                <span v-else>{{ formatTime(learnTime!.today) }}</span>
            </ElCard>
            <ElCard>
                <template #header>
                    <h3 class="card-title">总学习时长</h3>
                </template>
                <span v-if="!session.loggedIn">
                    <RouterLink class="login-link" to="/login">登录</RouterLink>后查看
                </span>
                <ElSkeleton v-else-if="learnTimeLoading" animated :throttle="300" />
                <span v-else>{{ formatTime(learnTime!.total) }}</span>
            </ElCard>
            <ElCard>
                <template #header>
                    <h3 class="card-title">学习进度</h3>
                </template>
                <span v-if="!session.loggedIn">
                    <RouterLink class="login-link" to="/login">登录</RouterLink>后查看
                </span>
                <ElSkeleton v-else-if="learnTimeLoading" animated :throttle="300" />
                <ElProgress v-else :percentage="learnPercentage">
                    {{ learnCount?.learned ?? 'wtf' }} / {{ learnCount?.total ?? 'wtf' }}
                </ElProgress>
            </ElCard>
        </div>
        <ElCard class="last-learned">
            <template #header>
                <h3 class="card-title">上次学习</h3>
            </template>
            <span v-if="!session.loggedIn"> <RouterLink class="login-link" to="/login">登录</RouterLink>后查看 </span>
            <ElSkeleton v-else-if="lastLearnedLoading" animated :throttle="300" />
            <span v-else>{{ lastLearned }}</span>
        </ElCard>
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
                                <RouterLink :to="{ name: 'knowledge-category', params: { id: category.category.id } }">
                                    {{ category.category.name }}
                                </RouterLink>
                            </div>
                            <div v-if="session.loggedIn" class="card-content">
                                <ElSkeleton v-if="category.recordLoading" animated :throttle="300" />
                                <ElProgress
                                    v-else
                                    text-inside
                                    :stroke-width="12"
                                    :percentage="formatPercentage(category.record!.learned, category.record!.total)"
                                >
                                    学习进度:&ensp;{{ category.record!.learned }} / {{ category.record!.total }}
                                </ElProgress>
                            </div>
                            <div v-else class="card-content small-text">
                                <RouterLink class="login-link" to="/login">登录</RouterLink>后查看学习进度
                            </div>
                        </ElCard>
                    </div>
                </ElScrollbar>
            </div>
            <RouterLink class="login-link" to="/knowledge/categories">查看更多</RouterLink>
        </template>
        <ElEmpty v-else description="暂无大考点" />
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElCard, ElEmpty, ElProgress, ElScrollbar, ElSkeleton } from 'element-plus';
import { GetCategoryLearnInfoFail } from 'types/api/get-category-learn-info';
import type { KnowledgeCategoryInList } from 'types/api/get-knowledge-categories';
import { GetLastLearnRecordFail } from 'types/api/get-last-learn-record';
import { GetLearnTimeFail } from 'types/api/get-learn-time';
import { GetTotalLearnInfoFail } from 'types/api/get-total-learn-info';
import { computed, onMounted, ref } from 'vue';

const session = useSessionStore();

const learnTimeLoading = ref(true);
const learnTime = ref<{ today: number; total: number } | null>(null);
const loadLearnTime = async () => {
    lastLearnedLoading.value = true;
    if (!session.loggedIn) {
        return;
    }

    try {
        const response = await request('/get-learn-time', {
            token: session.token,
            utcOffset: new Date().getTimezoneOffset(),
        });

        if (!response.success) {
            switch (response.reason) {
                case GetLearnTimeFail.NOT_LOGGED_IN:
                    myAlert.error('获取学习时长失败: 未登录');
                    break;
                case GetLearnTimeFail.INVALID_UTC_OFFSET:
                    myAlert.error('获取学习时长失败: 无效的时区');
                    break;
                case GetLearnTimeFail.UNKNOWN:
                    myAlert.error('获取学习时长失败: 未知错误');
            }
            return;
        }

        learnTime.value = { today: response.today, total: response.total };
        learnTimeLoading.value = false;
    } catch (e) {
        myAlert.error('获取学习时长失败: 网络错误');
    }
};

const formatTwoDigits = (num: number) => num.toString().padStart(2, '0');
const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${formatTwoDigits(hours)}:${formatTwoDigits(minutes)}:${formatTwoDigits(seconds)}`;
};

const learnCountLoading = ref(true);
const learnCount = ref<{ learned: number; total: number } | null>(null);
const loadLearnCount = async () => {
    if (!session.loggedIn) {
        return;
    }

    try {
        const response = await request('/get-total-learn-info', {
            token: session.token,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetTotalLearnInfoFail.NOT_LOGGED_IN:
                    myAlert.error('获取学习进度失败: 未登录');
                    break;
                case GetTotalLearnInfoFail.UNKNOWN:
                    myAlert.error('获取学习进度失败: 未知错误');
            }
            return;
        }

        learnCount.value = { learned: response.learned, total: response.total };
        learnCountLoading.value = false;
    } catch (e) {
        myAlert.error('获取学习进度失败: 网络错误');
    }
};

const formatPercentage = (learned: number, total: number) => {
    if (!total) {
        return 0;
    }

    return (learned / total) * 100;
};

const learnPercentage = computed(() => {
    if (!learnCount.value) {
        return 0;
    }
    return formatPercentage(learnCount.value.learned, learnCount.value.total);
});

const lastLearnedLoading = ref(true);
const lastLearned = ref<string | null>(null);
const loadLastLearned = async () => {
    if (!session.loggedIn) {
        return;
    }

    try {
        const response = await request('/get-last-learn-record', {
            token: session.token,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetLastLearnRecordFail.NOT_LOGGED_IN:
                    myAlert.error('获取上次学习记录失败: 未登录');
                    break;
                case GetLastLearnRecordFail.UNKNOWN:
                    myAlert.error('获取上次学习记录失败: 未知错误');
            }
            return;
        }
        if (!response.data) {
            lastLearned.value = '无记录';
            lastLearnedLoading.value = false;
            return;
        }
        const id = response.data.id;

        const contentResponse = await request('/get-knowledge-item-content', { id });
        if (!contentResponse.success) {
            myAlert.error('获取上次学习记录失败: 未知错误');
            return;
        }

        lastLearned.value = contentResponse.data.title;
        lastLearnedLoading.value = false;
    } catch (e) {
        myAlert.error('获取上次学习记录失败: 网络错误');
    }
};

const categoriesLoading = ref(true);
const categories = ref<
    {
        category: KnowledgeCategoryInList;
        record?: { learned: number; total: number };
        recordLoading: boolean;
    }[]
>([]);
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
        categories.value = response.data.map((category) => ({ category, recordLoading: true }));
        categoriesLoading.value = false;

        if (session.loggedIn) {
            await Promise.all(
                categories.value.map((category) =>
                    (async () => {
                        const recordsResponse = await request('/get-category-learn-info', {
                            token: session.token,
                            id: category.category.id,
                        });
                        if (!recordsResponse.success) {
                            switch (recordsResponse.reason) {
                                case GetCategoryLearnInfoFail.NOT_LOGGED_IN:
                                    myAlert.error('获取大考点学习进度失败: 未登录');
                                    break;
                                case GetCategoryLearnInfoFail.UNKNOWN:
                                    myAlert.error('获取大考点学习进度失败: 未知错误');
                            }
                            return;
                        }

                        category.record = { learned: recordsResponse.learned, total: recordsResponse.total };
                        category.recordLoading = false;
                    })(),
                ),
            );
        }
    } catch (e) {
        myAlert.error('获取大考点列表失败: 网络错误');
    }
};

onMounted(async () => {
    await Promise.all([loadLearnTime(), loadLearnCount(), loadLastLearned(), loadCategories()]);
});
</script>

<style lang="scss">
.category-card {
    > div {
        padding: 1rem;
        height: calc(100% - 2rem);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .el-progress-bar__innerText {
        font-size: 10px;
        line-height: 12px;
        display: block;
    }
}
</style>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.learn-container {
    max-width: var(--main-frame-width);
    display: flex;
    margin: 1rem auto;
}

.learn-data {
    border: 1px solid var(--el-border-color);
    padding: 1rem;
    border-radius: 4px;
    display: flex;
    flex-grow: 1;

    > div:not(:last-child) {
        margin-right: 1rem;
    }

    > div:last-child {
        flex-grow: 1;
    }
}

.card-title {
    margin: 0;
}

.login-link {
    color: var(--el-text-color-regular);
}

.last-learned {
    margin-top: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
    max-width: 15rem;
}

.scroll-bar-container {
    padding: 1rem;
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

.small-text {
    font-size: small;
}
</style>
