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
import { EditExamInfoFail } from 'types/api/edit-exam-info';
import { GetExamInfoContentFail, type ExamInfoContent } from 'types/api/get-exam-info-content';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const contentLoading = ref(true);

const content = ref<ExamInfoContent | undefined>(undefined);

const router = useRouter();

const loadContent = async () => {
    try {
        const response = await request('/get-exam-info-content', {
            id: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetExamInfoContentFail.NOT_EXISTS:
                    myAlert.error('信息不存在');
                    router.back();
                    break;
                case GetExamInfoContentFail.UNKNOWN:
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
        const response = await request('/edit-exam-info', {
            token: session.token,
            id: props.id,
            title: content.value!.title,
            content: content.value!.content,
        });

        if (!response.success) {
            switch (response.reason) {
                case EditExamInfoFail.NOT_LOGGED_IN:
                    myAlert.error('未登录');
                    session.loggedIn = false;
                    router.push('/');
                    break;
                case EditExamInfoFail.NO_PERMISSION:
                    myAlert.error('无权限');
                    router.push('/');
                    break;
                case EditExamInfoFail.NOT_EXISTS:
                    myAlert.error('编辑的内容不存在');
                    router.back();
                    break;
                case EditExamInfoFail.UNKNOWN:
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
