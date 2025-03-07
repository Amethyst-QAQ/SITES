<template>
    <div class="outer-frame">
        <AdminNavLink to="admin-home">主页</AdminNavLink>
        <div class="title">考试信息</div>
        <AdminNavLink to="exam-info-category-management">考试信息类别管理</AdminNavLink>
        <AdminNavLink to="exam-info-upload">考试信息上传</AdminNavLink>
        <AdminNavLink to="exam-info-management">考试信息管理</AdminNavLink>
        <AdminNavLink to="exam-info-edit" disabled>考试信息编辑</AdminNavLink>
    </div>
</template>

<script lang="ts" setup>
import AdminNavLink from './AdminNavLink.vue';
</script>

<style lang="scss" scoped>
.outer-frame {
    padding: 0.25rem;
}

.title {
    padding: 0.25rem;
    font-size: large;
    font-weight: bold;
    color: var(--el-text-color-secondary);
}
</style>
