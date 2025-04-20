<template>
    <div class="main-frame">
        <ElFormItem label="标题">
            <ElInput v-model="title" />
        </ElFormItem>
        <ElInput type="textarea" v-model="content" placeholder="正文" />
        <ElRow class="button-box">
            <ElButton @click="createPost">发帖</ElButton>
            <ElButton @click="router.back">取消</ElButton>
        </ElRow>
    </div>
</template>

<script setup lang="ts">
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElButton, ElFormItem, ElInput, ElRow } from 'element-plus';
import { CreatePostFail } from 'types/api/create-post';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const title = ref('');
const content = ref('');

const session = useSessionStore();
const router = useRouter();

const createPost = async () => {
    try {
        const response = await request('/create-post', {
            token: session.token,
            title: title.value,
            content: content.value,
        });
        if (!response.success) {
            switch (response.reason) {
                case CreatePostFail.NOT_LOGGED_IN:
                    myAlert.error('发帖失败: 未登录');
                    break;
                case CreatePostFail.UNKNOWN:
                    myAlert.error('发帖失败: 未知错误');
            }
            return;
        }
        router.replace({ name: 'post', params: { id: response.id } });
    } catch (e) {
        myAlert.error('发帖失败: 网络错误');
    }
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    padding: 1rem;
}

.button-box {
    margin-top: 0.5rem;
}
</style>
