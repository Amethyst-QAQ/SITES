<template>
    <ElAffix>
        <div class="header">
            <div class="elem-left">
                <RouterLink to="/">
                    <img src="@/assets/logo.png" />
                    SITES
                </RouterLink>
                <span>admin</span>
            </div>
            <div class="elem-right">
                <ThemeSwitch />
            </div>
        </div>
    </ElAffix>
    <RouterView />
</template>

<script lang="ts" setup>
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { ElAffix } from 'element-plus';
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
    display: flex;
    align-items: center;

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

    span:last-child {
        color: var(--el-text-color-secondary);
        font-size: large;
        margin-left: 0.5em;
    }
}

.elem-right {
    margin-left: auto;
}
</style>
