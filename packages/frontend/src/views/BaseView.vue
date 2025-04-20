<template>
    <div class="content-body" ref="contentBody">
        <div style="font-size: 0">-</div>
        <ElAffix>
            <div class="header" ref="baseHeader">
                <div class="elem-left">
                    <RouterLink to="/">
                        <img src="@/assets/logo.png" />
                        SITES
                    </RouterLink>
                </div>
                <div class="elem-middle">
                    <RouterLink to="/knowledge">必背资料</RouterLink>
                    <RouterLink to="/questions">模拟练习</RouterLink>
                    <RouterLink to="/exam-info">考试信息</RouterLink>
                    <RouterLink to="/">社区论坛</RouterLink>
                </div>
                <div class="elem-right">
                    <ThemeSwitch />
                    <div class="user-wrapper">
                        <FontAwesomeIcon :icon="faUser" class="user-icon" />
                        <RouterLink to="/login" v-if="!loggedIn">登录</RouterLink>
                        <span v-else @click="userMenuVisible = !userMenuVisible">
                            {{ session.userInfo?.nickname ?? '' }}
                            <FontAwesomeIcon :icon="faAngleDown" />
                        </span>
                    </div>
                </div>
            </div>
        </ElAffix>
        <div class="user-menu" v-if="userMenuVisible" :style="{ '--header-height': `${headerHeight}px` }">
            <UserMenu v-model="userMenuVisible" />
        </div>
        <RouterView />
        <div style="font-size: 0">-</div>
    </div>
    <div class="footer" ref="pageFooter" :style="footerStyle">
        <PageFooter />
    </div>
</template>

<script lang="ts" setup>
import PageFooter from '@/components/PageFooter.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import UserMenu from '@/components/UserMenu.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ElAffix } from 'element-plus';
import { storeToRefs } from 'pinia';
import { UserInfoFail } from 'types/api/user-info';
import { computed, onBeforeUnmount, onMounted, ref, type StyleValue } from 'vue';

const session = useSessionStore();
const { loggedIn } = storeToRefs(session);

const getUserInfo = async () => {
    if (!session.loggedIn || session.userInfo) {
        return;
    }

    try {
        const response = await request('/user-info', { id: session.userId });
        if (!response.success) {
            switch (response.reason) {
                case UserInfoFail.NOT_EXISTS:
                    myAlert.error('获取用户信息失败: 用户不存在');
                case UserInfoFail.UNKNOWN:
                    myAlert.error('获取用户信息失败: 未知错误');
            }
            return;
        }

        session.userInfo = { ...response.data };
    } catch (e) {
        myAlert.error('获取用户信息失败: 网络错误');
    }
};

const baseHeader = ref<HTMLDivElement>();
const contentBody = ref<HTMLDivElement>();
const pageFooter = ref<HTMLDivElement>();
const headerHeight = ref(0);
const bodyHeight = ref(0);
const footerHeight = ref(0);

const getHeaderHeight = () => {
    headerHeight.value = baseHeader.value!.offsetHeight;
};
const getBodyHeight = () => {
    bodyHeight.value = contentBody.value!.offsetHeight;
};
const getFooterHeight = () => {
    footerHeight.value = pageFooter.value!.offsetHeight;
};

const headerObserver = new ResizeObserver(getHeaderHeight);
const bodyObserver = new ResizeObserver(getBodyHeight);
const footerObserver = new ResizeObserver(getFooterHeight);

onMounted(async () => {
    getHeaderHeight();
    getBodyHeight();
    getFooterHeight();
    headerObserver.observe(baseHeader.value!);
    bodyObserver.observe(contentBody.value!);
    footerObserver.observe(pageFooter.value!);
    await getUserInfo();
});

onBeforeUnmount(() => {
    headerObserver.unobserve(baseHeader.value!);
    bodyObserver.unobserve(contentBody.value!);
    footerObserver.unobserve(pageFooter.value!);
});

const userMenuVisible = ref(false);

const footerStyle = computed((): StyleValue => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    const totalHeight = bodyHeight.value + footerHeight.value;
    if (totalHeight < window.innerHeight - rem) {
        return {
            position: 'fixed',
            bottom: 0,
            width: '100vw',
        };
    } else if (totalHeight < window.innerHeight + rem + footerHeight.value) {
        return {
            marginTop: `${window.innerHeight - bodyHeight.value + rem}px`,
        };
    } else {
        return {
            marginTop: '1rem',
        };
    }
});
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    align-items: center;
    padding: 0.5em;
    border-bottom: 1px solid var(--el-border-color);
    background-color: var(--el-bg-color);
}

.elem-left {
    font-size: x-large;
    font-weight: bold;
    padding-right: 0.5rem;
    border-right: 1px solid var(--el-border-color);

    a {
        display: flex;
        align-items: center;
        color: var(--el-text-color-primary);
        text-decoration: none;

        img {
            width: 1em;
            height: 1em;
            margin-right: 0.25em;
        }
    }
}

.elem-middle {
    padding-left: 0.5rem;
    a {
        padding: 0.5em;
        color: var(--el-text-color-primary);
        text-decoration: none;

        &:first-child {
            padding-left: 0;
        }

        &:hover {
            color: var(--el-text-color-secondary);
        }
    }
}

.elem-right {
    margin-left: auto;
    display: flex;
    align-items: center;
}

.user-wrapper {
    margin-left: 0.5rem;
    border-left: 1px solid var(--el-border-color);
    padding-left: 0.5rem;
    display: flex;
    align-items: center;

    .user-icon {
        margin-right: 0.5em;
    }

    a {
        color: var(--el-text-color-secondary);
    }

    > span {
        color: var(--el-text-color-secondary);
    }
}

.user-menu {
    position: fixed;
    top: calc(var(--header-height) + 4px);
    right: 4px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    background-color: var(--el-bg-color);
    z-index: 100;
}

.footer {
    border-top: 1px solid var(--el-border-color);
}
</style>
