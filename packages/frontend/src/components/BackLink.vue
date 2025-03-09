<template>
    <a @click="router.back()" class="back-link">
        <FontAwesomeIcon :icon="faSquareCaretLeft" />
    </a>
</template>

<script lang="ts" setup>
import { faSquareCaretLeft } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style lang="scss" scoped>
.back-link {
    color: var(--el-text-color-regular);
}
</style>
