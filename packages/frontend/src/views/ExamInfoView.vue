<template>
    <div class="important-frame">
        <h3>信息概览</h3>
        <ElSkeleton v-if="importantLoading" :rows="10" animated :throttle="300" />
        <ExamInfoList v-else-if="importantContent.length > 0" :data="importantContent" />
        <ElEmpty v-else description="暂无信息" />
    </div>
    <div class="category-frame">
        <h3>考试导航区</h3>
        <ElSkeleton v-if="categoriesLoading" :rows="10" animated />
        <ElTabs v-else-if="categories.length > 0" v-model="currentCategory">
            <ElTabPane v-for="i in categories" :label="i.name" :name="i.id">
                <SimpleExamInfoList v-if="currentCategory == i.id" :category-id="i.id" />
            </ElTabPane>
        </ElTabs>
        <ElEmpty v-else description="暂无信息" />
    </div>
</template>

<script lang="ts" setup>
import ExamInfoList from '@/components/ExamInfoList.vue';
import SimpleExamInfoList from '@/components/SimpleExamInfoList.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { ElEmpty, ElSkeleton, ElTabPane, ElTabs } from 'element-plus';
import type { ExamInfoInList } from 'types/api/get-exam-info';
import type { ExamInfoCategory } from 'types/api/get-exam-info-categories';
import { onMounted, ref } from 'vue';

const importantLoading = ref(true);
const importantContent = ref<ExamInfoInList[]>([]);
const loadImportant = async () => {
    try {
        const response = await request('/get-important-exam-info', {
            from: 0,
            count: 10,
        });
        if (!response.success) {
            myAlert.error('加载考试信息失败: 未知错误');
            return;
        }
        importantContent.value = [...response.data];
        importantLoading.value = false;
    } catch (e) {
        myAlert.error('加载考试信息失败: 网络错误');
    }
};

const categoriesLoading = ref(true);
const categories = ref<ExamInfoCategory[]>([]);
const currentCategory = ref(-1);
const loadCategories = async () => {
    try {
        const response = await request('/get-exam-info-categories', {});
        if (!response.success) {
            myAlert.error('加载考试信息类别失败: 未知错误');
            return;
        }

        categories.value = [...response.data];
        if (categories.value.length > 0) {
            currentCategory.value = categories.value[0].id;
        }
        categoriesLoading.value = false;
    } catch (e) {
        myAlert.error('加载考试信息类别失败: 网络错误');
    }
};

onMounted(async () => {
    await Promise.all([loadImportant(), loadCategories()]);
});
</script>

<style lang="scss" scoped>
.important-frame {
    max-width: 60rem;
    margin: 1rem auto;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    > h3 {
        margin-top: 0;
    }
}

.category-frame {
    max-width: 60rem;
    margin: 0 auto;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    > h3 {
        margin-top: 0;
    }
}
</style>
