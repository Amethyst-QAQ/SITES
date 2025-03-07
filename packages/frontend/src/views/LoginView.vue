<template>
    <div class="outer-frame" ref="outerFrame">
        <h1>登录</h1>
        <div class="inner-frame">
            <ElForm label-width="auto">
                <ElFormItem label="用户名" prop="username">
                    <ElInput v-model="input.username" />
                </ElFormItem>
                <ElFormItem label="密码" prop="password">
                    <ElInput v-model="input.password" type="password" show-password />
                </ElFormItem>
                <ElFormItem>
                    <div class="button-box">
                        <ElButton @click="login">登录</ElButton>
                        <ElButton @click="router.back()">取消</ElButton>
                        <RouterLink to="/register" replace>注册</RouterLink>
                    </div>
                </ElFormItem>
            </ElForm>
        </div>
    </div>
    <div class="theme-switch-container">
        <ThemeSwitch />
    </div>
</template>

<script lang="ts" setup>
import ThemeSwitch from '@/components/ThemeSwitch.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { MD5 } from 'crypto-js';
import { ElButton, ElForm, ElFormItem, ElInput } from 'element-plus';
import { LoginFail } from 'types/api/login';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const input = reactive({
    username: '',
    password: '',
});

const router = useRouter();

const session = useSessionStore();

const login = async () => {
    try {
        const response = await request('/login', {
            username: input.username,
            password: MD5(input.password).toString(),
        });
        if (!response.success) {
            switch (response.reason) {
                case LoginFail.NOT_EXISTS:
                    myAlert.error('用户不存在');
                    break;
                case LoginFail.PASSWORD_ERROR:
                    myAlert.error('密码不正确');
                    break;
                case LoginFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        session.loggedIn = true;
        session.token = response.token;
        session.userId = response.id;
        myAlert.success('登录成功');
        router.push('/');
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const outerFrame = ref<HTMLDivElement>();

const resizeFrame = () => {
    const height = outerFrame.value!.offsetHeight;
    outerFrame.value!.style.marginTop = `calc((100vh - ${height}px) / 2)`;
};

const resizeObserver = new ResizeObserver(resizeFrame);

onMounted(() => {
    resizeFrame();
    resizeObserver.observe(document.body);
});

onBeforeUnmount(() => {
    resizeObserver.unobserve(document.body);
});
</script>

<style lang="scss" scoped>
.outer-frame {
    width: 30rem;
    margin: 0 auto;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    h1 {
        text-align: center;
        margin-top: 0.4rem;
        margin-bottom: 0.4rem;
    }
}

.inner-frame {
    border-top: 1px solid var(--el-border-color);
    padding-top: 2rem;
    padding-bottom: 1rem;
    padding-left: 3rem;
    padding-right: 3rem;
}

.button-box {
    width: 100%;
    text-align: center;

    > a {
        margin-left: 12px;
    }
}

.theme-switch-container {
    position: fixed;
    right: 10px;
    top: 10px;
}
</style>
