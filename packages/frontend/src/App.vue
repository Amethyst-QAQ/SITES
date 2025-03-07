<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useSessionStore } from './stores/session';
import { request } from './request';
import { myAlert } from './lib/my-alert';

const theme = useThemeStore();
const intervalId = ref<number | undefined>(undefined);

const updateTheme = () => {
    const htmlElem = document.querySelector('html');
    if (!htmlElem) {
        return;
    }
    if (theme.isDark) {
        htmlElem.classList.add('dark');
    } else {
        htmlElem.classList.remove('dark');
    }
};

const session = useSessionStore();
const refreshToken = async () => {
    if (session.loggedIn) {
        try {
            const response = await request('/refresh-token', { token: session.token });
            if (!response.success) {
                throw new Error();
            }
        } catch (e) {
            myAlert.warning('登录会话已过期');
            session.loggedIn = false;
        }
    }
};

onMounted(() => {
    updateTheme();
    intervalId.value = setInterval(refreshToken, 5 * 60 * 1000);
});

onBeforeUnmount(() => {
    clearInterval(intervalId.value);
});
</script>

<style lang="scss" scoped></style>
