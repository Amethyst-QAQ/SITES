<template>
    <div class="outer-frame">
        <AdminNavLink to="admin-home">主页</AdminNavLink>
        <div class="title">考试信息</div>
        <AdminNavLink to="exam-info-category-management">考试信息类别管理</AdminNavLink>
        <AdminNavLink to="exam-info-upload">考试信息上传</AdminNavLink>
        <AdminNavLink to="exam-info-management">考试信息管理</AdminNavLink>
        <AdminNavLink to="exam-info-edit" disabled>考试信息编辑</AdminNavLink>
        <div class="title">考试资料</div>
        <AdminNavLink to="knowledge-category-management">大考点管理</AdminNavLink>
        <AdminNavLink to="knowledge-category-edit" disabled>大考点编辑</AdminNavLink>
        <AdminNavLink to="knowledge-upload">考点上传</AdminNavLink>
        <AdminNavLink to="knowledge-management">小考点管理</AdminNavLink>
        <AdminNavLink to="knowledge-item-management" disabled>知识点管理</AdminNavLink>
        <AdminNavLink to="knowledge-item-edit" disabled>知识点编辑</AdminNavLink>
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
