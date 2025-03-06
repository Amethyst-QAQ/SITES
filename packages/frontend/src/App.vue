<template>
    <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useThemeStore } from './stores/theme';
import { onMounted } from 'vue';

const theme = useThemeStore();

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

onMounted(updateTheme);
</script>

<style lang="scss" scoped></style>
