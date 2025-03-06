<template>
    <div class="outer-frame" ref="outerFrame">
        <h1>登录</h1>
        <div class="inner-frame">
            <el-form label-width="auto">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="input.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="input.password" type="password" show-password />
                </el-form-item>
                <el-form-item>
                    <div class="button-box">
                        <el-button @click="login">登录</el-button>
                        <el-button @click="router.back()">取消</el-button>
                        <RouterLink to="/register">注册</RouterLink>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { request } from '@/request';
import { useRouter } from 'vue-router';
import { MD5 } from 'crypto-js';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { FailReason } from 'types/api/login';
import { useSessionStore } from '@/stores/session';
import { myAlert } from '@/lib/myAlert';

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
                case FailReason.NOT_EXISTS:
                    myAlert.error('用户不存在');
                    break;
                case FailReason.PASSWORD_ERROR:
                    myAlert.error('密码不正确');
                    break;
                case FailReason.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        session.loggedIn = true;
        session.token = response.token;
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
    margin-left: calc((100vw - 30rem) / 2);
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
</style>
