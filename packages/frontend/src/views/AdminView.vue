<template>
    <ElAffix>
        <div class="header" ref="pageHeader">
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
    <div class="main-frame">
        <div class="aside" ref="aside" :style="{ '--header-height': `${headerHeight}px` }">
            <ElScrollbar>
                <AdminNav />
            </ElScrollbar>
        </div>
        <div class="aside-placeholder" ref="asidePlaceholder" :style="{ width: `${asideWidth}px` }"></div>
        <div class="router-container"><RouterView /></div>
    </div>
</template>

<script lang="ts" setup>
import AdminNav from '@/components/AdminNav.vue';
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { ElAffix, ElScrollbar } from 'element-plus';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const aside = ref<HTMLDivElement>();
const asidePlaceholder = ref<HTMLDivElement>();
const pageHeader = ref<HTMLDivElement>();
const asideWidth = ref(0);
const headerHeight = ref(0);
const getAsideWidth = () => {
    asideWidth.value = aside.value!.offsetWidth;
};
const getHeaderHeight = () => {
    headerHeight.value = pageHeader.value!.offsetHeight;
};
const asideObserver = new ResizeObserver(getAsideWidth);
const headerObserver = new ResizeObserver(getHeaderHeight);
onMounted(() => {
    getAsideWidth();
    getHeaderHeight();
    asideObserver.observe(aside.value!);
    headerObserver.observe(pageHeader.value!);
});
onBeforeUnmount(() => {
    asideObserver.unobserve(aside.value!);
    headerObserver.unobserve(pageHeader.value!);
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

.main-frame {
    display: flex;

    .aside {
        position: fixed;
        height: calc(100vh - var(--header-height));
        border-right: 1px solid var(--el-border-color);
    }

    .aside-placeholder {
        flex-shrink: 0;
    }
}

.router-container {
    padding: 1rem;
    flex-grow: 1;
    min-width: 0;
}
</style>
