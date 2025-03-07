<template>
    <div class="main-frame">
        <ElSkeleton v-if="categoryLoading" :rows="0" animated :throttle="300" />
        <h3 v-else>{{ categoryName }}</h3>
        <ElSkeleton v-if="categoryLoading" :rows="20" animated :throttle="300" />
        <template v-else-if="pageCount > 0">
            <ElSkeleton v-if="pageLoading" :rows="20" animated :throttle="300" />
            <ExamInfoList v-else :data="pageData" />
            <PageSelector v-model="currentPage" :total="pageCount" @change="gotoPage" />
        </template>
        <ElEmpty v-else description="暂无信息" />
    </div>
</template>

<script lang="ts" setup>
import ExamInfoList from '@/components/ExamInfoList.vue';
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import router from '@/router';
import { ElEmpty, ElSkeleton } from 'element-plus';
import { CountExamInfoFail } from 'types/api/count-exam-info';
import type { ExamInfoInList } from 'types/api/get-exam-info';
import { GetExamInfoCategoryFail } from 'types/api/get-exam-info-category';
import { onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const categoryLoading = ref(true);
const categoryName = ref('');
const loadCategory = async () => {
    try {
        const response = await request('/get-exam-info-category', { id: props.id });
        if (!response.success) {
            switch (response.reason) {
                case GetExamInfoCategoryFail.NOT_EXISTS:
                    myAlert.error('类别不存在');
                    break;
                case GetExamInfoCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        categoryName.value = response.name;
        categoryLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const pageLoading = ref(true);
const currentPage = ref(0);
const pageData = ref<ExamInfoInList[]>([]);
const gotoPage = async (page: number) => {
    pageLoading.value = true;
    try {
        const response = await request('/get-exam-info', {
            categoryId: props.id,
            count: 50,
            from: currentPage.value * 50,
        });
        if (!response.success) {
            switch (response.reason) {
                case CountExamInfoFail.CATEGORY_NOT_EXISTS:
                    myAlert.error('类别不存在');
                    router.back();
                    break;
                case CountExamInfoFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        pageData.value = [...response.data];
        pageLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const countLoading = ref(true);
const pageCount = ref(0);
const loadCount = async () => {
    try {
        const response = await request('/count-exam-info', { categoryId: props.id });
        if (!response.success) {
            switch (response.reason) {
                case CountExamInfoFail.CATEGORY_NOT_EXISTS:
                    myAlert.error('类别不存在');
                    router.back();
                    break;
                case CountExamInfoFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        pageCount.value = Math.ceil(response.count / 50);
        countLoading.value = false;
        if (pageCount.value > 0) {
            await gotoPage(0);
        }
    } catch (e) {
        myAlert.error('网络错误');
    }
};
onMounted(async () => {
    await Promise.all([loadCategory(), loadCount()]);
});
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: 60rem;
    margin: 1rem auto;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    > h3 {
        margin-top: 0.5rem;
        margin-left: 0.5rem;
    }
}
</style>
