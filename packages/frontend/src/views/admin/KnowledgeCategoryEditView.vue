<template>
    <ElSkeleton :rows="8" animated v-if="contentLoading" :throttle="300" />
    <div v-else>
        <ElFormItem label="名称">
            <ElInput v-model="content!.name" />
        </ElFormItem>

        <ElInput v-model="content!.description" type="textarea" :rows="10" />

        <ElRow class="button-box">
            <ElButton @click="save">保存</ElButton>
            <ElButton @click="router.back">取消</ElButton>
        </ElRow>
    </div>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElFormItem, ElInput, ElRow, ElSkeleton } from 'element-plus';
import { EditKnowledgeCategoryFail } from 'types/api/edit-knowledge-category';
import {
    GetKnowledgeCategoryContentFail,
    type KnowledgeCategoryContent,
} from 'types/api/get-knowledge-category-content';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const contentLoading = ref(true);
const content = ref<KnowledgeCategoryContent | undefined>(undefined);
const router = useRouter();

const loadContent = async () => {
    try {
        const response = await request('/get-knowledge-category-content', {
            id: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeCategoryContentFail.NOT_EXISTS:
                    myAlert.error('考点不存在');
                    router.back();
                    break;
                case GetKnowledgeCategoryContentFail.UNKNOWN:
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

const session = useSessionStore();

const save = async () => {
    try {
        const response = await request('/edit-knowledge-category', {
            token: session.token,
            id: props.id,
            name: content.value!.name,
            description: content.value!.description,
        });

        if (!response.success) {
            switch (response.reason) {
                case EditKnowledgeCategoryFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case EditKnowledgeCategoryFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case EditKnowledgeCategoryFail.NOT_EXISTS:
                    myAlert.error('编辑的考点不存在');
                    router.back();
                    break;
                case EditKnowledgeCategoryFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        myAlert.success('编辑成功');
        router.back();
    } catch (e) {
        myAlert.error('网络错误');
    }
};
</script>

<style lang="scss" scoped>
.button-box {
    margin-top: 0.5rem;
}
</style>
