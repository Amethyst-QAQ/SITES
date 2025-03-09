<template>
    <ElSkeleton :rows="25" animated v-if="contentLoading" :throttle="300" />
    <div v-else>
        <ElFormItem label="标题">
            <ElInput v-model="content!.title" />
        </ElFormItem>
        <ElInput v-model="content!.content" type="textarea" :rows="20" />
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
import { EditKnowledgeItemFail } from 'types/api/edit-knowledge-item';
import { GetKnowledgeItemContentFail, type KnowledgeItemContent } from 'types/api/get-knowledge-item-content';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const contentLoading = ref(true);

const content = ref<KnowledgeItemContent | undefined>(undefined);

const router = useRouter();

const loadContent = async () => {
    try {
        const response = await request('/get-knowledge-item-content', {
            id: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeItemContentFail.NOT_EXISTS:
                    myAlert.error('信息不存在');
                    router.back();
                    break;
                case GetKnowledgeItemContentFail.UNKNOWN:
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
        const response = await request('/edit-knowledge-item', {
            token: session.token,
            id: props.id,
            title: content.value!.title,
            content: content.value!.content,
        });

        if (!response.success) {
            switch (response.reason) {
                case EditKnowledgeItemFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.cleanSession();
                    router.push('/');
                    break;
                case EditKnowledgeItemFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case EditKnowledgeItemFail.NOT_EXISTS:
                    myAlert.error('编辑的内容不存在');
                    router.back();
                    break;
                case EditKnowledgeItemFail.UNKNOWN:
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
