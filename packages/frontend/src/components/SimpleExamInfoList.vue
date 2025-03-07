<template>
    <ElSkeleton v-if="dataLoading" :rows="10" animated :throttle="300" />
    <template v-else-if="data.length > 0">
        <ExamInfoList :data />
        <RouterLink :to="{ name: 'exam-info-category', params: { id: categoryId } }" class="more-link">
            查看更多
        </RouterLink>
    </template>
    <ElEmpty v-else description="暂无信息" />
</template>

<script lang="ts" setup>
import ExamInfoList from './ExamInfoList.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { ElEmpty, ElSkeleton } from 'element-plus';
import { CountExamInfoFail } from 'types/api/count-exam-info';
import type { ExamInfoInList } from 'types/api/get-exam-info';
import { onMounted, ref } from 'vue';

const props = defineProps({
    categoryId: {
        type: Number,
        required: true,
    },
});

const dataLoading = ref(true);
const data = ref<ExamInfoInList[]>([]);
const loadData = async () => {
    try {
        const response = await request('/get-exam-info', {
            categoryId: props.categoryId,
            from: 0,
            count: 10,
        });
        if (!response.success) {
            switch (response.reason) {
                case CountExamInfoFail.CATEGORY_NOT_EXISTS:
                    myAlert.error('加载考试信息失败: 类别不存在');
                    break;
                case CountExamInfoFail.UNKNOWN:
                    myAlert.error('加载考试信息失败: 未知错误');
            }
            return;
        }

        data.value = [...response.data];
        dataLoading.value = false;
    } catch (e) {
        myAlert.error('加载考试信息失败: 网络错误');
    }
};
onMounted(loadData);
</script>

<style lang="scss" scoped>
.more-link {
    color: var(--el-text-color-regular);
    margin-top: 0.5em;
}
</style>
