<template>
    <div class="category-container">
        <ElSkeleton :rows="1" animated v-if="categoryLoading" :throttle="300" />
        <ElFormItem label="选择类别" v-else>
            <ElSelect v-model="selectedCategory" :empty-values="[-1]" @change="selectCategory">
                <ElOption
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id"
                />
            </ElSelect>
        </ElFormItem>
    </div>
    <ElRow v-if="selectedCategory > 0">
        <ElCol :span="12" class="col-frame">
            <h3>考试信息列表</h3>
            <ElSkeleton animated v-if="tableLoading" :throttle="300" />
            <ElTable v-else-if="pageCount > 0" :data="currentPageData" class="page-table">
                <ElTableColumn label="标题">
                    <template #default="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="创建时间">
                    <template #default="scope">
                        <span class="time-span">{{ new Date(scope.row.createdAt).toLocaleString() }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="修改时间">
                    <template #default="scope">
                        <span class="time-span">{{ new Date(scope.row.updatedAt).toLocaleString() }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="重要性">
                    <template #default="scope">
                        <span>{{ scope.row.isImportant ? '是' : '否' }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="操作">
                    <template #default="scope">
                        <div>
                            <ElButton size="small" @click="toEdit(scope.row)">编辑</ElButton>
                        </div>
                        <ElButton size="small" @click="addToEditList(scope.row)">加入批量编辑列表</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <ElEmpty v-else description="暂无信息" />
            <PageSelector v-if="pageCount > 0" v-model="pageId" :total="pageCount" @change="jumpToPage" />
        </ElCol>
        <ElCol :span="12" class="col-frame">
            <h3>批量编辑列表</h3>
            <ElTable v-if="editList.length > 0" :data="editList" class="page-table">
                <ElTableColumn label="标题">
                    <template #default="scope">
                        <span>{{ scope.row.title }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="创建时间">
                    <template #default="scope">
                        <span class="time-span">{{ new Date(scope.row.createdAt).toLocaleString() }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="修改时间">
                    <template #default="scope">
                        <span class="time-span">{{ new Date(scope.row.updatedAt).toLocaleString() }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="重要性">
                    <template #default="scope">
                        <span>{{ scope.row.isImportant ? '是' : '否' }}</span>
                    </template>
                </ElTableColumn>
                <ElTableColumn label="操作">
                    <template #default="scope">
                        <ElButton @click="removeFromEditList(scope.row)">移除</ElButton>
                    </template>
                </ElTableColumn>
            </ElTable>
            <ElEmpty v-else description="暂无信息" />
            <ElRow v-if="editList.length > 0">
                <ElButton @click="setImportance(true)">设为重要</ElButton>
                <ElButton @click="setImportance(false)">设为不重要</ElButton>
                <ElPopconfirm
                    title="确认删除？"
                    confirm-button-text="是"
                    cancel-button-text="否"
                    confirm-button-type="danger"
                    @confirm="deleteAll"
                >
                    <template #reference>
                        <ElButton type="danger">删除</ElButton>
                    </template>
                </ElPopconfirm>
            </ElRow>
        </ElCol>
    </ElRow>
</template>

<script lang="ts" setup>
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import {
    ElCol,
    ElFormItem,
    ElRow,
    ElSelect,
    ElOption,
    ElSkeleton,
    ElTable,
    ElEmpty,
    ElTableColumn,
    ElButton,
    ElPopconfirm,
} from 'element-plus';
import { CountExamInfoFail } from 'types/api/count-exam-info';
import { DeleteExamInfoFail } from 'types/api/delete-exam-info';
import type { ExamInfoInList } from 'types/api/get-exam-info';
import { SetExamInfoImportanceFail } from 'types/api/set-exam-info-importance';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const categoryLoading = ref(true);
const categories = ref<{ id: number; name: string }[]>([]);
const loadCategories = async () => {
    try {
        const response = await request('/get-exam-info-categories', {});
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

onMounted(async () => {
    await loadCategories();
});

const selectedCategory = ref(-1);

const tableLoading = ref(false);

const pageCount = ref(0);

const pageId = ref(0);

const currentPageData = ref<ExamInfoInList[]>([]);

const editList = ref<ExamInfoInList[]>([]);

const selectCategory = async () => {
    tableLoading.value = true;
    try {
        const response = await request('/count-exam-info', { categoryId: selectedCategory.value });
        if (!response.success) {
            switch (response.reason) {
                case CountExamInfoFail.CATEGORY_NOT_EXISTS:
                    myAlert.error('类别不存在');
                    break;
                case CountExamInfoFail.UNKNOWN:
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
    tableLoading.value = true;
    try {
        const response = await request('/get-exam-info', {
            categoryId: selectedCategory.value,
            from: pageId.value * 50,
            count: 50,
        });

        if (!response.success) {
            switch (response.reason) {
                case CountExamInfoFail.CATEGORY_NOT_EXISTS:
                    myAlert.error('类别不存在');
                    break;
                case CountExamInfoFail.UNKNOWN:
                    myAlert.error('未知错误');
                    break;
            }
            return;
        }

        currentPageData.value = [...response.data];
        tableLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const addToEditList = async (info: ExamInfoInList) => {
    if (editList.value.some((v) => v.id == info.id)) {
        return;
    }
    editList.value.push({ ...info });
};

const removeFromEditList = async (info: ExamInfoInList) => {
    editList.value = editList.value.filter((v) => v.id != info.id);
};

const session = useSessionStore();
const router = useRouter();

const setImportance = async (importance: boolean) => {
    try {
        const response = await request('/set-exam-info-importance', {
            token: session.token,
            data: editList.value.map((v) => ({
                id: v.id,
                importance,
            })),
        });
        if (!response.success) {
            switch (response.reason) {
                case SetExamInfoImportanceFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case SetExamInfoImportanceFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case SetExamInfoImportanceFail.NOT_EXISTS:
                    myAlert.error('选定的信息不存在');
                    editList.value = [];
                    await selectCategory();
                    break;
                case SetExamInfoImportanceFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        await jumpToPage(pageId.value);
        for (const obj of editList.value) {
            obj.isImportant = importance;
            obj.updatedAt = new Date().getTime();
        }
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const deleteAll = async () => {
    const ids = editList.value.map((v) => v.id);
    editList.value = [];
    tableLoading.value = true;
    pageCount.value = 0;
    try {
        const response = await request('/delete-exam-info', {
            token: session.token,
            ids,
        });
        if (!response.success) {
            switch (response.reason) {
                case DeleteExamInfoFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case DeleteExamInfoFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case DeleteExamInfoFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        await selectCategory();
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const toEdit = (info: ExamInfoInList) => {
    router.push({
        name: 'exam-info-edit',
        params: { id: info.id },
    });
};
</script>

<style lang="scss" scoped>
.category-container {
    margin-bottom: 1rem;
}

.col-frame {
    padding: 0.5rem;
    border: 1px solid var(--el-border-color);
    &:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
        border-right: 0;
    }

    &:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
    }
}

.page-table {
    margin-bottom: 0.5rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}

.time-span {
    font-size: small;
}
</style>
