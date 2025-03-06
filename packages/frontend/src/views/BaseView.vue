<template>
    <div class="content-body" ref="contentBody">
        <div style="font-size: 0">-</div>
        <el-affix>
            <div class="header" ref="baseHeader">
                <div class="elem-left">
                    <RouterLink to="/">
                        <img src="@/assets/logo.png" />
                        SITES
                    </RouterLink>
                </div>
                <div class="elem-middle">
                    <RouterLink to="/">必背资料</RouterLink>
                    <RouterLink to="/">模拟练习</RouterLink>
                    <RouterLink to="/">考试信息</RouterLink>
                    <RouterLink to="/">社区论坛</RouterLink>
                </div>
                <div class="elem-right">
                    <el-switch v-model="isDark" class="theme-switch" @change="updateTheme">
                        <template #active-action>
                            <FontAwesomeIcon :icon="faMoon" class="moon" />
                        </template>
                        <template #inactive-action>
                            <FontAwesomeIcon :icon="faSun" class="sun" />
                        </template>
                    </el-switch>
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
        </el-affix>
        <div class="user-menu" v-if="userMenuVisible" :style="{ '--header-height': `${headerHeight}px` }">
            <div>
                <el-popconfirm title="确定要登出吗？" @confirm="logout">
                    <template #reference>
                        <a>
                            <FontAwesomeIcon :icon="faRightFromBracket" />
                            登出
                        </a>
                    </template>
                    <template #actions="{ confirm, cancel }">
                        <el-button size="small" @click="confirm">是</el-button>
                        <el-button size="small" @click="cancel">否</el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
        <RouterView />
        <div style="font-size: 0">-</div>
    </div>
    <div class="footer" ref="pageFooter" :style="footerStyle">
        <PageFooter />
    </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme';
import { storeToRefs } from 'pinia';
import { computed, onBeforeUnmount, onMounted, ref, type StyleValue } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMoon, faSun, faUser } from '@fortawesome/free-regular-svg-icons';
import { faRightFromBracket, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { useSessionStore } from '@/stores/session';
import { request } from '@/request';
import { FailReason } from 'types/api/user-info';
import { myAlert } from '@/lib/myAlert';
import PageFooter from '@/components/PageFooter.vue';

const { isDark } = storeToRefs(useThemeStore());
const session = useSessionStore();
const { loggedIn } = storeToRefs(session);

const updateTheme = () => {
    const htmlElem = document.querySelector('html');
    if (!htmlElem) {
        return;
    }
    if (isDark.value) {
        htmlElem.classList.add('dark');
    } else {
        htmlElem.classList.remove('dark');
    }
};

const getUserInfo = async () => {
    if (!session.loggedIn || session.userInfo) {
        return;
    }

    try {
        const response = await request('/user-info', { token: session.token });
        if (!response.success) {
            switch (response.reason) {
                case FailReason.NOT_LOGGED_IN:
                    myAlert.error('获取用户信息失败: 未登录');
                case FailReason.UNKNOWN:
                    myAlert.error('获取用户信息失败: 未知错误');
            }
            return;
        }

        session.userInfo = {
            username: response.username,
            nickname: response.nickname,
        };
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

const logout = async () => {
    userMenuVisible.value = false;

    try {
        await request('/logout', { token: session.token });
    } catch (e) {}

    session.loggedIn = false;
    session.userInfo = undefined;
    myAlert.success('登出成功');
};

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

.theme-switch {
    --el-switch-on-color: var(--el-switch-off-color);
    .moon {
        color: var(--el-border-color);
    }
    .sun {
        color: var(--el-text-color-regular);
    }
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

    > div {
        padding: 0.25em;
    }
}

.footer {
    border-top: 1px solid var(--el-border-color);
}
</style>
