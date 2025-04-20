<template>
    <div class="main-frame">
        <BackLink />
        <ElSkeleton v-if="categoryLoading" :rows="10" animated :throttle="300" />
        <template v-else-if="category">
            <h1 class="category-title">{{ category.name }}</h1>
            <MarkdownComponent :content="category.description" />
        </template>
    </div>
    <div class="table-frame">
        <ElSkeleton v-if="countLoading" :rows="10" animated :throttle="300" />
        <template v-else-if="pageCount > 0">
            <ElSkeleton v-if="pageLoading" :rows="10" animated :throttle="300" />
            <ul v-else class="knowledge-list">
                <li v-for="row in pageData">
                    <span>{{ row.knowledge.title }}</span>
                    <div v-if="!session.loggedIn"><RouterLink to="/login">登录</RouterLink>后练习</div>
                    <ElButton v-else @click="createExam(row.knowledge.id)">开始练习</ElButton>
                </li>
            </ul>
            <PageSelector :total="pageCount" v-model="currentPage" @change="jumpToPage" />
        </template>
        <ElEmpty v-else description="暂无小考点" />
    </div>
</template>

<script lang="ts" setup>
import BackLink from '@/components/BackLink.vue';
import MarkdownComponent from '@/components/MarkdownComponent.vue';
import PageSelector from '@/components/PageSelector.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElSkeleton, ElEmpty, ElButton } from 'element-plus';
import { CountKnowledgeFail } from 'types/api/count-knowledge';
import { CreateExamFail } from 'types/api/create-exam';
import { GetKnowledgeFail, type KnowledgeInList } from 'types/api/get-knowledge';
import {
    GetKnowledgeCategoryContentFail,
    type KnowledgeCategoryContent,
} from 'types/api/get-knowledge-category-content';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const categoryLoading = ref(true);
const category = ref<KnowledgeCategoryContent | null>(null);

const router = useRouter();

const loadCategory = async () => {
    try {
        const response = await request('/get-knowledge-category-content', {
            id: props.id,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeCategoryContentFail.NOT_EXISTS:
                    myAlert.error('大考点不存在');
                    router.back();
                    break;
                case GetKnowledgeCategoryContentFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        category.value = { ...response.data };
        categoryLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const countLoading = ref(true);
const pageCount = ref(0);
type DataRow = {
    knowledge: KnowledgeInList;
};
const pageLoading = ref(true);
const pageData = ref<DataRow[]>([]);
const currentPage = ref(0);

const session = useSessionStore();

const jumpToPage = async (page: number) => {
    pageLoading.value = true;
    try {
        const response = await request('/get-knowledge', {
            from: page * 10,
            count: 10,
            categoryId: props.id,
        });

        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeFail.NOT_EXISTS:
                    myAlert.error('大考点不存在');
                    router.back();
                    break;
                case GetKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }

        pageData.value = response.data.map((knowledge) => ({
            knowledge,
            recordLoading: true,
        }));
        pageLoading.value = false;
        if (!session.loggedIn) {
            return;
        }
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const loadCount = async () => {
    try {
        const response = await request('/count-knowledge', {
            categoryId: props.id,
        });
        if (!response.success) {
            switch (response.reason) {
                case CountKnowledgeFail.NOT_EXISTS:
                    myAlert.error('大考点不存在');
                    router.back();
                    break;
                case CountKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        pageCount.value = Math.ceil(response.count / 10);
        countLoading.value = false;
        await jumpToPage(0);
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(async () => {
    await Promise.all([loadCategory(), loadCount()]);
});

const createExam = async (knowledgeId: number) => {
    try {
        const response = await request('/create-exam', { token: session.token, knowledgeId });
        if (!response.success) {
            switch (response.reason) {
                case CreateExamFail.NOT_LOGGED_IN:
                    myAlert.error('开始练习失败: 未登录');
                    break;
                case CreateExamFail.NOT_EXISTS:
                    myAlert.error('开始练习失败: 考点不存在');
                    break;
                case CreateExamFail.NO_QUESTIONS:
                    myAlert.error('开始练习失败: 没有任何习题');
                    break;
                case CreateExamFail.UNKNOWN:
                    myAlert.error('开始练习失败: 未知错误');
            }
            return;
        }
        router.push({
            name: 'exam',
            params: { examToken: response.examToken },
        });
    } catch (e) {
        myAlert.error('开始练习失败: 网络错误');
    }
};
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}

.category-title {
    text-align: center;
    word-break: break-all;
}

.table-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0rem auto;
    padding: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}

.knowledge-list {
    padding: 0;
    > li {
        display: flex;
        justify-content: space-between;
        padding: 0 1em;
        line-height: 2em;
        border-top: 1px solid var(--el-border-color);
        &:last-child {
            border-bottom: 1px solid var(--el-border-color);
        }

        a {
            color: var(--el-text-color-primary);
            text-decoration: none;
            word-break: break-all;
        }
    }
}
</style>
