<template>
    <ul class="outer-ul">
        <li v-for="i in data" class="exam-info">
            <RouterLink :to="{ name: 'exam-info-file', params: { id: i.id } }">
                {{ i.title }}
                <span>
                    创建时间: {{ new Date(i.createdAt).toLocaleDateString() }}, &ensp; 修改时间:
                    {{ new Date(i.updatedAt).toLocaleDateString() }}
                </span>
            </RouterLink>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import type { ExamInfoInList } from 'types/api/get-exam-info';

defineProps({
    data: {
        type: null as unknown as { new (...args: any[]): ExamInfoInList[] },
        required: true,
    },
});
</script>

<style lang="scss" scoped>
.outer-ul {
    padding: 0;
}

.exam-info {
    line-height: 2em;
    padding: 0 1em;
    border-top: 1px solid var(--el-border-color);

    &::marker {
        content: none;
    }

    &:last-child {
        border-bottom: 1px solid var(--el-border-color);
    }

    > a {
        display: flex;
        color: var(--el-text-color-primary);
        text-decoration: none;
    }

    span {
        font-size: small;
        color: var(--el-text-color-secondary);
        margin-left: auto;
    }
}
</style>
