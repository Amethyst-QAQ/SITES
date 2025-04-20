<template>
    <div class="main-frame">
        <BackLink />
        <h1>大考点列表</h1>
        <ElSkeleton v-if="countLoading" :rows="10" animated :throttle="300" />
        <template v-else-if="pageCount > 0">
            <ElSkeleton v-if="pageLoading" :rows="10" animated :throttle="300" />
            <ul v-else class="category-list">
                <li v-for="row in pageData">
                    <RouterLink :to="{ name: 'exam-knowledge', params: { id: row.category.id } }">
                        {{ row.category.name }}
                    </RouterLink>
                </li>
            </ul>
            <PageSelector :total="pageCount" v-model="currentPage" @change="jumpToPage" />
        </template>
        <ElEmpty v-else description="暂无大考点" />
    </div>
</template>

<script lang="ts" setup>
import BackLink from '@/components/BackLink.vue';
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElEmpty, ElSkeleton } from 'element-plus';
import { GetCategoryLearnInfoFail } from 'types/api/get-category-learn-info';
import type { KnowledgeCategoryInList } from 'types/api/get-knowledge-categories';
import { onMounted, ref } from 'vue';

const countLoading = ref(true);
const pageCount = ref(0);

type DataRow = {
    category: KnowledgeCategoryInList;
};

const pageLoading = ref(true);
const pageData = ref<DataRow[]>([]);
const currentPage = ref(0);

const session = useSessionStore();

const jumpToPage = async (page: number) => {
    try {
        pageLoading.value = true;
        const response = await request('/get-knowledge-categories', {
            from: page * 10,
            count: 10,
        });
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        pageData.value = response.data.map((category) => ({
            category,
            recordLoading: true,
        }));
        pageLoading.value = false;
        if (!session.loggedIn) {
            return;
        }
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const loadCount = async () => {
    try {
        const response = await request('/count-knowledge-categories', {});
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        pageCount.value = Math.ceil(response.count / 10);
        countLoading.value = false;
        await jumpToPage(0);
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(loadCount);
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 1rem);
    margin: 1rem auto;
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    > h1 {
        text-align: center;
    }
}

.category-list {
    padding: 0;
    > li {
        display: flex;
        padding: 0 1em;
        line-height: 2em;
        border-top: 1px solid var(--el-border-color);
        &:last-child {
            border-bottom: 1px solid var(--el-border-color);
        }

        a {
            color: var(--el-text-color-primary);
            text-decoration: none;
            word-break: break-all;
        }
    }
}

.progress-bar-container {
    margin-left: auto;
    width: 10em;
    flex-shrink: 0;
    display: flex;

    &.login-link a {
        text-decoration: underline;
    }

    &.real-bar > * {
        flex-grow: 1;
    }
}
</style>
