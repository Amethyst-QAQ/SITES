<template>
    <MarkdownComponent :content />
</template>

<script lang="ts" setup>
import content from '@/assets/admin-home.md?raw';
import MarkdownComponent from '@/components/MarkdownComponent.vue';
</script>

<style lang="scss" scoped></style>
