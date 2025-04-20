<template>
    <div class="category-container">
        <ElSkeleton :rows="1" animated v-if="categoryLoading" :throttle="300" />
        <template v-else-if="categoryPageCount > 0">
            <ElFormItem label="选择大考点">
                <ElSelect v-model="selectedCategory" :empty-values="[-1]" @change="selectCategory">
                    <ElOption
                        v-for="category in categories"
                        :key="category.id"
                        :label="category.name"
                        :value="category.id"
                    />
                </ElSelect>
            </ElFormItem>
            <PageSelector :total="categoryPageCount" v-model="currentCategoryPage" @change="jumpToCategoryPage" />
        </template>
        <ElEmpty v-else description="暂无大考点" />
    </div>
    <template v-if="pageCount > 0">
        <ElSkeleton :rows="20" animated v-if="tableLoading" :throttle="300" />
        <ElTable class="main-table" v-else :data="currentPageData">
            <ElTableColumn label="小考点">
                <template #default="scope">
                    <ElInput v-model="scope.row.title" v-if="scope.row.editing" />
                    <span v-else>{{ scope.row.title }}</span>
                </template>
            </ElTableColumn>
            <ElTableColumn label="重要性">
                <template #default="scope">
                    <ElInputNumber
                        v-model="scope.row.importance"
                        v-if="scope.row.editing"
                        :min="0"
                        :max="1"
                        :step="0.1"
                    />
                    <ImportanceBar v-else :value="scope.row.importance" />
                </template>
            </ElTableColumn>
            <ElTableColumn label="操作">
                <template #default="scope">
                    <ElButton
                        @click="
                            router.push({
                                name: 'question-upload',
                                params: { knowledgeId: scope.row.id },
                            })
                        "
                    >
                        上传习题
                    </ElButton>
                    <ElButton v-if="scope.row.editing" @click="saveRow(scope.row)">保存</ElButton>
                    <ElButton v-else @click="scope.row.editing = true">编辑</ElButton>
                    <ElButton
                        @click="
                            router.push({
                                name: 'knowledge-item-management',
                                params: { knowledgeId: scope.row.id },
                            })
                        "
                    >
                        知识点管理
                    </ElButton>
                    <ElPopconfirm
                        title="确认删除？"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        confirm-button-type="danger"
                        @confirm="deleteRow(scope.row)"
                    >
                        <template #reference>
                            <ElButton type="danger">删除</ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
        <PageSelector :total="pageCount" v-model="pageId" @change="jumpToPage" />
    </template>
    <ElEmpty v-else-if="selectedCategory > 0" description="暂无小考点" />
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { onMounted, ref } from 'vue';
import {
    ElFormItem,
    ElOption,
    ElSelect,
    ElSkeleton,
    ElEmpty,
    ElTable,
    ElTableColumn,
    ElButton,
    ElPopconfirm,
    ElInput,
    ElInputNumber,
} from 'element-plus';
import PageSelector from '@/components/PageSelector.vue';
import { GetKnowledgeFail, type KnowledgeInList } from 'types/api/get-knowledge';
import { CountKnowledgeFail } from 'types/api/count-knowledge';
import ImportanceBar from '@/components/ImportanceBar.vue';
import { useSessionStore } from '@/stores/session';
import { useRouter } from 'vue-router';
import { DeleteKnowledgeFail } from 'types/api/delete-knowledge';
import { EditKnowledgeFail } from 'types/api/edit-knowledge';

const categoryLoading = ref(true);
const categoryPageCount = ref(0);
const currentCategoryPage = ref(0);
const categories = ref<{ id: number; name: string }[]>([]);

const jumpToCategoryPage = async (page: number) => {
    try {
        categoryLoading.value = true;
        const response = await request('/get-knowledge-categories', {
            from: page * 10,
            count: 10,
        });
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        categories.value = [...response.data];
        categoryLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const loadCategories = async () => {
    try {
        const response = await request('/count-knowledge-categories', {});
        if (!response.success) {
            myAlert.error('未知错误');
            return;
        }
        categoryPageCount.value = Math.ceil(response.count / 10);
        currentCategoryPage.value = 0;
        await jumpToCategoryPage(0);
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(async () => {
    await loadCategories();
});

const selectedCategory = ref(-1);

const tableLoading = ref(false);

const pageCount = ref(0);

const pageId = ref(0);

type DataRow = KnowledgeInList & { editing: boolean };

const currentPageData = ref<DataRow[]>([]);

const selectCategory = async () => {
    tableLoading.value = true;
    try {
        const response = await request('/count-knowledge', {
            categoryId: selectedCategory.value,
        });
        if (!response.success) {
            switch (response.reason) {
                case CountKnowledgeFail.NOT_EXISTS:
                    myAlert.error('大考点不存在');
                    break;
                case CountKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        pageCount.value = Math.ceil(response.count / 50);
        if (pageCount.value > 0) {
            pageId.value = 0;
            await jumpToPage(0);
        } else {
            tableLoading.value = false;
        }
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const jumpToPage = async (newPageId: number) => {
    try {
        tableLoading.value = true;
        const response = await request('/get-knowledge', {
            categoryId: selectedCategory.value,
            from: newPageId * 50,
            count: 50,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeFail.NOT_EXISTS:
                    myAlert.error('大考点不存在');
                    break;
                case GetKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        currentPageData.value = response.data.map((d) => ({ ...d, editing: false }));
        pageId.value = newPageId;
        tableLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const session = useSessionStore();
const router = useRouter();

const saveRow = async (row: DataRow) => {
    try {
        const response = await request('/edit-knowledge', {
            token: session.token,
            id: row.id,
            title: row.title,
            importance: row.importance,
        });

        if (!response.success) {
            switch (response.reason) {
                case EditKnowledgeFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case EditKnowledgeFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case EditKnowledgeFail.NOT_EXISTS:
                    myAlert.error('要编辑的对象不存在');
                    await selectCategory();
                    break;
                case EditKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        row.editing = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const deleteRow = async (row: KnowledgeInList) => {
    tableLoading.value = true;
    try {
        const response = await request('/delete-knowledge', {
            token: session.token,
            ids: [row.id],
        });
        if (!response.success) {
            switch (response.reason) {
                case DeleteKnowledgeFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case DeleteKnowledgeFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case DeleteKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        await selectCategory();
    } catch (e) {
        myAlert.error('网络错误');
    }
};
</script>

<style lang="scss" scoped>
.category-container {
    margin-bottom: 1rem;
}

.main-table {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    margin-bottom: 1rem;
}
</style>
