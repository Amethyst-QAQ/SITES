<template>
    <div class="outer-frame">
        <div v-if="isAdmin">
            <RouterLink to="/admin">管理员界面</RouterLink>
        </div>
        <div>
            <ElPopconfirm title="确定要登出吗？" @confirm="logout">
                <template #reference>
                    <a>
                        <FontAwesomeIcon :icon="faRightFromBracket" />
                        登出
                    </a>
                </template>
                <template #actions="{ confirm, cancel }">
                    <ElButton size="small" @click="confirm">是</ElButton>
                    <ElButton size="small" @click="cancel">否</ElButton>
                </template>
            </ElPopconfirm>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElPopconfirm, ElButton } from 'element-plus';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { computed } from 'vue';
import { PermissionLevel } from 'types/lib/permission-level';

const model = defineModel<boolean>({ default: false });
const session = useSessionStore();

const logout = async () => {
    model.value = false;

    try {
        await request('/logout', { token: session.token });
    } catch (e) {}

    session.cleanSession();
    session.userInfo = undefined;
    myAlert.success('登出成功');
};

const isAdmin = computed(() => {
    if (!session.userInfo) {
        return false;
    }
    return session.userInfo.permissionLevel >= PermissionLevel.ADMIN;
});
</script>

<style lang="scss" scoped>
.outer-frame {
    > div {
        padding: 0.5em;
        &:not(:first-child) {
            border-top: 1px solid var(--el-border-color);
        }
    }

    a {
        color: var(--el-text-color-primary);
        text-decoration: none;
    }
}
</style>
