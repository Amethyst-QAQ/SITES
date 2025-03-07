<template>
    <div class="outer-frame">
        <ElSkeleton :rows="20" animated v-if="contentLoading" :throttle="300" />
        <template v-else>
            <h1 class="main-title">{{ content!.title }}</h1>
            <p class="times">
                创建时间: {{ new Date(content!.createdAt).toLocaleString() }}; &ensp; 修改时间:
                {{ new Date(content!.updatedAt).toLocaleString() }}
            </p>
            <MarkdownComponent :content="content!.content" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { ElSkeleton } from 'element-plus';
import { GetExamInfoContentFail, type ExamInfoContent } from 'types/api/get-exam-info-content';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const contentLoading = ref(true);

const content = ref<ExamInfoContent | undefined>(undefined);

const router = useRouter();

const loadContent = async () => {
    try {
        const response = await request('/get-exam-info-content', {
            id: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetExamInfoContentFail.NOT_EXISTS:
                    myAlert.error('信息不存在');
                    router.back();
                    break;
                case GetExamInfoContentFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        content.value = { ...response.data };
        contentLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(loadContent);
</script>

<style lang="scss" scoped>
.outer-frame {
    max-width: 60rem;
    margin: 0 auto;
    margin-top: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.main-title {
    text-align: center;
    margin-top: 0.5rem;
}

.times {
    text-align: center;
    color: var(--el-text-color-secondary);
    font-size: small;
}
</style>
