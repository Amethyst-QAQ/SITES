<template>
    <MarkdownAttachment v-if="parsedContent.firstAttachment" :file="parsedContent.firstAttachment" />
    <template v-for="fragment in parsedContent.fragments">
        <div v-html="fragment.content"></div>
        <MarkdownAttachment :file="fragment.content" />
    </template>
    <div v-if="parsedContent.lastFragment" v-html="parsedContent.lastFragment"></div>
</template>

<script lang="ts" setup>
import { parseAttachments } from '@/lib/parse-attachments';
import { computed } from 'vue';
import kramed from 'kramed';
import MarkdownAttachment from './MarkdownAttachment.vue';

const props = defineProps({
    content: {
        type: String,
        required: true,
    },
});

const parsedContent = computed(() => {
    const parsed = parseAttachments(props.content);
    for (const fragment of parsed.fragments) {
        fragment.content = kramed(fragment.content);
    }
    if (parsed.lastFragment) {
        parsed.lastFragment = kramed(parsed.lastFragment);
    }
    return parsed;
});
</script>

<style lang="scss"></style>
