<template>
    <div class="main-table">
        <div class="loading-skeleton-container" v-if="tableLoading">
            <ElSkeleton animated :throttle="300" />
        </div>
        <ElTable :data="tableData" v-else-if="tableData.length > 0">
            <ElTableColumn label="类别">
                <template #default="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </ElTableColumn>
            <ElTableColumn label="操作">
                <template #default="scope">
                    <ElButton @click="toEdit(scope.row)">编辑</ElButton>
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
        <ElEmpty v-loading="tableLoading" v-else description="暂无数据" />
    </div>

    <div class="pagination-container" v-if="pageCount > 0">
        <PageSelector v-model="pageId" :total="pageCount" @change="jumpToPage" />
    </div>

    <div class="create-container">
        <ElFormItem label="新建大考点">
            <ElInput v-model="newCategoryName" placeholder="大考点名称" />
        </ElFormItem>
        <ElFormItem label="描述">
            <ElInput v-model="newCategoryDescription" placeholder="大考点描述" />
        </ElFormItem>
        <ElButton class="create-button" :disabled="tableLoading" @click="createCategory">新建</ElButton>
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import PageSelector from '@/components/PageSelector.vue';
import { ElButton, ElEmpty, ElFormItem, ElInput, ElPopconfirm, ElSkeleton, ElTable, ElTableColumn } from 'element-plus';
import { CreateKnowledgeCategoryFail } from 'types/api/create-knowledge-category';
import { DeleteKnowledgeCategoriesFail } from 'types/api/delete-knowledge-categories';
import type { KnowledgeCategoryInList } from 'types/api/get-knowledge-categories';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const tableLoading = ref(false);
const tableData = ref<KnowledgeCategoryInList[]>([]);
const pageCount = ref(0);
const pageId = ref(0);
const pageSize = 10; // 每页显示的记录数

const session = useSessionStore();
const router = useRouter();

// 获取分类总数和计算页数
const getCount = async () => {
    tableLoading.value = true;
    tableData.value = [];
    pageCount.value = 0;
    try {
        const response = await request('/count-knowledge-categories', {});
        if (!response.success) {
            myAlert.error('获取分类总数失败');
            return;
        }

        pageCount.value = Math.ceil(response.count / pageSize);
        if (pageCount.value > 0) {
            await jumpToPage(0);
        } else {
            tableLoading.value = false;
        }
    } catch (e) {
        myAlert.error('获取分类总数失败: 网络错误');
        tableLoading.value = false;
    }
};

// 获取分类数据
const jumpToPage = async (newPageId: number) => {
    try {
        tableLoading.value = true;
        pageId.value = newPageId;

        const response = await request('/get-knowledge-categories', {
            from: newPageId * pageSize,
            count: pageSize,
        });

        if (!response.success) {
            myAlert.error('获取分类列表失败: 未知错误');
            return;
        }

        tableData.value = [...response.data];
        tableLoading.value = false;
    } catch (e) {
        myAlert.error('获取分类列表失败: 网络错误');
        tableLoading.value = false;
    }
};

onMounted(async () => {
    tableLoading.value = true;
    await getCount();
});

// 跳转到编辑页面
const toEdit = (category: KnowledgeCategoryInList) => {
    router.push({
        name: 'knowledge-category-edit',
        params: { id: category.id },
    });
};

// 删除分类
const deleteRow = async (category: KnowledgeCategoryInList) => {
    tableLoading.value = true;
    try {
        const response = await request('/delete-knowledge-categories', {
            token: session.token,
            ids: [category.id],
        });

        if (!response.success) {
            tableLoading.value = false;
            switch (response.reason) {
                case DeleteKnowledgeCategoriesFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case DeleteKnowledgeCategoriesFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case DeleteKnowledgeCategoriesFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        await getCount();
    } catch (e) {
        myAlert.error('删除失败: 网络错误');
        tableLoading.value = false;
    }
};

// 创建新分类
const newCategoryName = ref('');
const newCategoryDescription = ref('');

const createCategory = async () => {
    if (newCategoryName.value.trim().length === 0) {
        myAlert.error('分类名称不能为空');
        return;
    }

    try {
        tableLoading.value = true;
        const response = await request('/create-knowledge-category', {
            token: session.token,
            name: newCategoryName.value,
            description: newCategoryDescription.value,
        });

        if (!response.success) {
            tableLoading.value = false;
            switch (response.reason) {
                case CreateKnowledgeCategoryFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case CreateKnowledgeCategoryFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case CreateKnowledgeCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        newCategoryName.value = '';
        newCategoryDescription.value = '';
        await getCount();
    } catch (e) {
        myAlert.error('创建失败: 网络错误');
        tableLoading.value = false;
    }
};
</script>

<style lang="scss" scoped>
.main-table {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    margin-bottom: 1rem;

    .loading-skeleton-container {
        padding: 1rem;
    }
}

.pagination-container {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    > * {
        flex-grow: 1;
    }
}

.create-container {
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    .el-form-item {
        margin-right: 1rem;
        margin-bottom: 0;
    }

    .create-button {
        align-self: flex-end;
    }
}
</style>
