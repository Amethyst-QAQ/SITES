<template>
    <div class="outer-frame" ref="outerFrame">
        <h1>注册</h1>
        <div class="inner-frame">
            <el-form label-width="auto" :model="input" :rules="rules" status-icon ref="registerForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="input.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="input.password" type="password" show-password />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input v-model="input.confirmPassword" type="password" show-password />
                </el-form-item>
                <el-form-item>
                    <div class="button-box">
                        <el-button @click="register">注册</el-button>
                        <el-button @click="router.back()">取消</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { request } from '@/request';
import type { FormInstance, FormRules } from 'element-plus';
import { FailReason } from 'types/api/json/register';
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { MD5 } from 'crypto-js';

const input = reactive({
    username: '',
    password: '',
    confirmPassword: '',
});

const rules = reactive<FormRules<typeof input>>({
    username: {
        validator: (_1, _2, callback) => {
            if (/^[A-Za-z0-9_]+$/.test(input.username)) {
                const len = input.username.length;
                if (len > 16) {
                    callback('用户名的最大长度为16');
                    return false;
                }

                return true;
            }

            callback('用户名只能由大小写字母，数字和下划线组成');
            return false;
        },
        trigger: 'blur',
    },
    password: {
        validator: (_1, _2, callback) => {
            if (/^[A-Za-z0-9_!@#$%\^&*\(\)_\-~`\[\]\{\};\:'",.<>\/\?\|\\]+$/.test(input.password)) {
                const len = input.password.length;
                if (len > 16 || len < 8) {
                    callback('密码长度在8到16位之间');
                    return false;
                }
                return true;
            }
            callback('密码只能由大小写字母，数字和特殊符号(_!@#$%^&*()_-~`[]{};:\'",.<>/?|\\)组成');
            return false;
        },
        trigger: 'blur',
    },
    confirmPassword: {
        validator: (_1, _2, callback) => {
            if (input.confirmPassword != input.password) {
                callback('两次输入密码不一致');
                return false;
            }

            return true;
        },
        trigger: 'blur',
    },
});

const registerForm = ref<FormInstance>();

const router = useRouter();

const register = () => {
    registerForm.value?.validate(async (isValid) => {
        if (isValid) {
            try {
                const response = await request('/register', {
                    username: input.username,
                    password: MD5(input.password).toString(),
                });
                if (response.success) {
                    alert('注册成功');
                    router.push('/');
                } else {
                    switch (response.reason) {
                        case FailReason.EXISTS:
                            alert('用户名已存在');
                            break;
                        default:
                            alert('未知错误');
                    }
                }
            } catch (e) {
                alert('网络错误');
            }
        } else {
            alert('填写有误');
        }
    });
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
