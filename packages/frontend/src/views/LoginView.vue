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
        if (response.success) {
            session.loggedIn = true;
            session.token = response.token;
            alert('登录成功');
            router.push('/');
        } else {
            switch (response.reason) {
                case FailReason.NOT_EXISTS:
                    alert('用户不存在');
                    break;
                case FailReason.PASSWORD_ERROR:
                    alert('密码不正确');
                    break;
                case FailReason.UNKNOWN:
                    alert('未知错误');
            }
        }
    } catch (e) {
        alert('网络错误');
    }
};

const outerFrame = ref<HTMLDivElement>();

const resizeFrame = () => {
    const height = outerFrame.value!.clientHeight;
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
}
</style>
