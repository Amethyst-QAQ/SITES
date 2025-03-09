<template>
    <div class="importance-bar-main-frame" ref="mainFrame" :style="mainFrameStyle">
        <div class="left-frame">
            <FontAwesomeIcon v-for="_ in 5" :icon="faStar" />
        </div>
        <div class="right-frame">
            <FontAwesomeIcon v-for="_ in 5" :icon="faStar" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps({
    value: {
        type: Number,
        required: true,
    },
});

const mainFrame = ref<HTMLDivElement>();
const mainFrameFontSize = ref(0);
const resizeMainFrame = () => {
    mainFrameFontSize.value = parseFloat(getComputedStyle(mainFrame.value!).fontSize);
};
const mainFrameObserver = new ResizeObserver(resizeMainFrame);
onMounted(() => {
    resizeMainFrame();
    mainFrameObserver.observe(mainFrame.value!);
});

onBeforeUnmount(() => {
    mainFrameObserver.unobserve(mainFrame.value!);
});

const mainFrameStyle = computed(() => ({
    '--stroke-width': `${512 / mainFrameFontSize.value}px`,
    '--clip-size': `${(1 - props.value) * 100}%`,
}));
</script>

<style lang="scss">
.importance-bar-main-frame {
    position: relative;

    path {
        stroke: var(--el-border-color);
        stroke-width: var(--stroke-width);
    }

    .left-frame {
        color: var(--importance-bar-color);
        position: absolute;
        z-index: 50;
        clip-path: inset(0 var(--clip-size) 0 0);
    }

    .right-frame {
        color: transparent;
    }
}
</style>
