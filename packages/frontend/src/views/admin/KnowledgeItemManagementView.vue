<template>
    <BackLink />
    <ElSkeleton :rows="5" animated v-if="dataLoading" />
    <ElTable class="main-table" v-else-if="data.length > 0" :data>
        <ElTableColumn label="标题" prop="title" />
        <ElTableColumn label="操作">
            <template #default="scope">
                <ElButton
                    @click="
                        router.push({
                            name: 'knowledge-item-edit',
                            params: { id: scope.row.id },
                        })
                    "
                >
                    编辑
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
    <ElEmpty v-else description="暂无知识点" />
</template>

<script lang="ts" setup>
import BackLink from '@/components/BackLink.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElEmpty, ElSkeleton, ElTable, ElTableColumn, ElButton, ElPopconfirm } from 'element-plus';
import { DeleteKnowledgeItemsFail } from 'types/api/delete-knowledge-items';
import { GetKnowledgeItemsFail, type KnowledgeItemInList } from 'types/api/get-knowledge-items';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    knowledgeId: {
        type: Number,
        required: true,
    },
});

const dataLoading = ref(true);
const data = ref<KnowledgeItemInList[]>([]);

const loadData = async () => {
    try {
        const response = await request('/get-knowledge-items', {
            knowledgeId: props.knowledgeId,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeItemsFail.NOT_EXISTS:
                    myAlert.error('小考点不存在');
                    break;
                case GetKnowledgeItemsFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        data.value = [...response.data];
        dataLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(() => {
    loadData();
});

const session = useSessionStore();
const router = useRouter();

const deleteRow = async (row: KnowledgeItemInList) => {
    try {
        const response = await request('/delete-knowledge-items', {
            token: session.token,
            ids: [row.id],
        });
        if (!response.success) {
            switch (response.reason) {
                case DeleteKnowledgeItemsFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    break;
                case DeleteKnowledgeItemsFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    break;
                case DeleteKnowledgeItemsFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        data.value = data.value.filter((item) => item.id !== row.id);
    } catch (e) {
        myAlert.error('网络错误');
    }
};
</script>

<style lang="scss" scoped>
.main-table {
    margin-top: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}
</style>
