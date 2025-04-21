<template>
    <div class="main-title">
        <img src="../assets/logo.png" />
        SITES
    </div>
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
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElCard, ElProgress, ElSkeleton } from 'element-plus';
import { GetLastLearnRecordFail } from 'types/api/get-last-learn-record';
import { GetLearnTimeFail } from 'types/api/get-learn-time';
import { GetTotalLearnInfoFail } from 'types/api/get-total-learn-info';
import { ref, computed, onMounted } from 'vue';

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

onMounted(async () => {
    await Promise.all([loadLearnTime(), loadLearnCount(), loadLastLearned()]);
});
</script>

<style lang="scss" scoped>
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

.main-title {
    max-width: var(--main-frame-width);
    display: flex;
    font-size: 128px;
    line-height: 128px;
    align-items: center;
    max-width: var(--main-frame-width);
    margin: 1rem auto;
    img {
        width: 128px;
        height: 128px;
        margin-top: 20px;
    }
}
</style>
