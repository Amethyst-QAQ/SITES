<template>
    <div class="main-frame">
        <BackLink />
        <ElSkeleton v-if="itemLoading" :rows="10" animated :throttle="300" />
        <template v-else>
            <h1>{{ item!.title }}</h1>
            <MarkdownComponent :content="item!.content" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import BackLink from '@/components/BackLink.vue';
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { GetKnowledgeItemContentFail, type KnowledgeItemContent } from 'types/api/get-knowledge-item-content';
import { onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const itemLoading = ref(true);
const item = ref<KnowledgeItemContent | null>(null);
const loadItem = async () => {
    itemLoading.value = true;
    try {
        const response = await request('/get-knowledge-item-content', {
            id: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeItemContentFail.NOT_EXISTS:
                    myAlert.error('知识点不存在');
                    break;
                case GetKnowledgeItemContentFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        item.value = { ...response.data };
        itemLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(loadItem);
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    > h1 {
        text-align: center;
    }
}
</style>
