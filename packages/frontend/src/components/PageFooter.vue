<template>
    <div class="outer-frame">
        <div class="inner-frame" v-html="content"></div>
    </div>
</template>

<script lang="ts" setup>
import rawContent from '@/assets/footer.md?raw';
import kramed from 'kramed';
import { computed } from 'vue';

const content = computed(() => kramed(rawContent));
</script>

<style lang="scss" scoped>
.outer-frame {
    padding: 1rem;
}

.inner-frame {
    text-align: center;
    color: var(--el-text-color-regular);
}
</style>
