<template>
    <div class="main-table">
        <div class="loading-skeleton-container" v-if="tableLoading">
            <ElSkeleton animated :throttle="300" />
        </div>
        <ElTable :data="tableData" v-else-if="tableData.length > 0">
            <ElTableColumn label="类别">
                <template #default="scope">
                    <ElInput v-model="scope.row.name" v-if="scope.row.editing" />
                    <span v-else>{{ scope.row.name }}</span>
                </template>
            </ElTableColumn>
            <ElTableColumn label="操作">
                <template #default="scope">
                    <ElButton v-if="scope.row.editing" @click="saveRow(scope.row)">保存</ElButton>
                    <ElButton v-else @click="editRow(scope.row)">编辑</ElButton>
                    <ElPopconfirm
                        title="确认删除？"
                        confirm-button-text="是"
                        cancel-button-text="否"
                        confirm-button-type="danger"
                        @confirm="deleteRow(scope.row)"
                    >
                        <template #reference>
                            <ElButton :disabled="scope.row.editing" type="danger">删除</ElButton>
                        </template>
                    </ElPopconfirm>
                </template>
            </ElTableColumn>
        </ElTable>
        <ElEmpty v-loading="tableLoading" v-else description="暂无类别" />
    </div>
    <div class="create-container">
        <ElFormItem label="新建类别">
            <ElInput v-model="newCategoryName" />
        </ElFormItem>
        <ElButton class="create-button" :disabled="tableLoading" @click="createCategory">新建</ElButton>
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import router from '@/router';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElEmpty, ElFormItem, ElInput, ElPopconfirm, ElSkeleton, ElTable, ElTableColumn } from 'element-plus';
import { CreateExamInfoCategoryFail } from 'types/api/create-exam-info-category';
import { DeleteExamInfoCategoryFail } from 'types/api/delete-exam-info-category';
import { EditExamInfoCategoryFail } from 'types/api/edit-exam-info-category';
import { onMounted, ref } from 'vue';

const tableLoading = ref(false);

type DataRow = { id: number; name: string; editing: boolean };

const tableData = ref<DataRow[]>([]);

const getData = async () => {
    try {
        tableLoading.value = true;
        const response = await request('/get-exam-info-categories', {});
        if (!response.success) {
            myAlert.error('获取类别列表失败: 未知错误');
            return;
        }
        tableData.value = response.data.map((d) => ({ ...d, editing: false }));
        tableLoading.value = false;
    } catch (e) {
        myAlert.error('获取类别列表失败: 网络错误');
        tableLoading.value = false;
    }
};

onMounted(getData);

const editRow = (row: DataRow) => {
    row.editing = true;
};

const session = useSessionStore();

const saveRow = async (row: DataRow) => {
    tableLoading.value = true;
    try {
        const response = await request('/edit-exam-info-category', {
            token: session.token,
            id: row.id,
            name: row.name,
        });

        if (!response.success) {
            tableLoading.value = false;
            switch (response.reason) {
                case EditExamInfoCategoryFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.loggedIn = false;
                    router.push('/');
                    break;
                case EditExamInfoCategoryFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case EditExamInfoCategoryFail.NOT_EXISTS:
                    myAlert.error('要编辑的对象不存在');
                    await getData();
                    break;
                case EditExamInfoCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        await getData();
    } catch (e) {
        myAlert.error('网络错误');
        tableLoading.value = false;
    }
};

const deleteRow = async (row: DataRow) => {
    tableLoading.value = true;
    try {
        const response = await request('/delete-exam-info-category', {
            token: session.token,
            id: row.id,
        });

        if (!response.success) {
            tableLoading.value = false;
            switch (response.reason) {
                case DeleteExamInfoCategoryFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.loggedIn = false;
                    router.push('/');
                    break;
                case DeleteExamInfoCategoryFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case DeleteExamInfoCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        await getData();
    } catch (e) {
        myAlert.error('网络错误');
        tableLoading.value = false;
    }
};

const newCategoryName = ref('');

const createCategory = async () => {
    if (newCategoryName.value.length == 0) {
        myAlert.error('类别名称不能为空');
        return;
    }
    try {
        tableLoading.value = true;
        const response = await request('/create-exam-info-category', {
            token: session.token,
            name: newCategoryName.value,
        });

        if (!response.success) {
            tableLoading.value = false;
            switch (response.reason) {
                case CreateExamInfoCategoryFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.loggedIn = false;
                    router.push('/');
                    break;
                case CreateExamInfoCategoryFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case CreateExamInfoCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        newCategoryName.value = '';
        await getData();
    } catch (e) {
        myAlert.error('网络错误');
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

.create-container {
    display: flex;
    .create-button {
        margin-left: 1rem;
    }
}
</style>
