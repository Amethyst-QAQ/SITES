<template>
    <div class="main-frame">
        <BackLink />
        <ElSkeleton v-if="knowledgeLoading" :rows="10" animated :throttle="300" />
        <template v-else>
            <h1>{{ knowledge!.title }}</h1>
            <div class="importance">
                <ImportanceBar :value="knowledge!.importance" />
            </div>
        </template>
        <TreeComponent v-if="items.length > 0" :tree />
    </div>
    <div class="table-frame">
        <ElSkeleton v-if="itemsLoading" :rows="10" animated :throttle="300" />
        <template v-else-if="items.length > 0">
            <ul class="knowledge-list">
                <li v-for="row in items">
                    <RouterLink :to="{ name: 'knowledge-item', params: { id: row.item.id } }">
                        {{ row.item.title }}
                    </RouterLink>
                    <div v-if="!session.loggedIn"><RouterLink to="/login">登录</RouterLink>后查看学习进度</div>
                    <ElSkeleton v-else-if="row.learnedLoading" :rows="0" animated :throttle="300" />
                    <div v-else>
                        <ElTag v-if="row.learned" type="success">已学习</ElTag>
                        <ElTag v-else type="info">未学习</ElTag>
                    </div>
                </li>
            </ul>
        </template>
        <ElEmpty v-else description="暂无知识点" />
    </div>
</template>

<script lang="ts" setup>
import BackLink from '@/components/BackLink.vue';
import ImportanceBar from '@/components/ImportanceBar.vue';
import TreeComponent from '@/components/TreeComponent.vue';
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { useSessionStore } from '@/stores/session';
import { ElSkeleton, ElTag, ElEmpty } from 'element-plus';
import { GetCategoryLearnInfoFail } from 'types/api/get-category-learn-info';
import { GetKnowledgeItemsFail, type KnowledgeItemInList } from 'types/api/get-knowledge-items';
import { GetSingleKnowledgeFail } from 'types/api/get-single-knowledge';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    id: {
        type: Number,
        required: true,
    },
});

const knowledgeLoading = ref(true);
const knowledge = ref<{ title: string; importance: number } | null>(null);

const loadKnowledge = async () => {
    try {
        const response = await request('/get-single-knowledge', {
            id: props.id,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetSingleKnowledgeFail.NOT_EXISTS:
                    myAlert.error('小考点不存在');
                    break;
                case GetSingleKnowledgeFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        knowledge.value = { title: response.title, importance: response.importance };
        knowledgeLoading.value = false;
    } catch (e) {
        myAlert.error('网络错误');
    }
};

const itemsLoading = ref(true);
type DataRow = {
    item: KnowledgeItemInList;
    learned: boolean;
    learnedLoading: boolean;
};

const items = ref<DataRow[]>([]);

const session = useSessionStore();

const loadItems = async () => {
    try {
        const response = await request('/get-knowledge-items', {
            knowledgeId: props.id,
        });
        if (!response.success) {
            switch (response.reason) {
                case GetKnowledgeItemsFail.NOT_EXISTS:
                    myAlert.error('小考点不存在');
                    break;
                case GetKnowledgeItemsFail.UNKNOWN:
                    myAlert.error('未知错误');
            }
            return;
        }
        items.value = response.data.map((item) => ({
            item,
            learned: false,
            learnedLoading: true,
        }));
        itemsLoading.value = false;

        if (!session.loggedIn) {
            return;
        }

        await Promise.all(
            items.value.map(async (row) => {
                try {
                    const response = await request('/get-item-learn-info', {
                        token: session.token,
                        id: row.item.id,
                    });
                    if (!response.success) {
                        switch (response.reason) {
                            case GetCategoryLearnInfoFail.NOT_LOGGED_IN:
                                myAlert.error('未登录');
                                session.cleanSession();
                                break;
                            case GetCategoryLearnInfoFail.NOT_EXISTS:
                                myAlert.error('知识点不存在');
                                break;
                            case GetCategoryLearnInfoFail.UNKNOWN:
                                myAlert.error('未知错误');
                        }
                        return;
                    }
                    row.learned = response.learned;
                    row.learnedLoading = false;
                } catch (e) {
                    myAlert.error('网络错误');
                }
            }),
        );
    } catch (e) {
        myAlert.error('网络错误');
    }
};

onMounted(async () => {
    await Promise.all([loadKnowledge(), loadItems()]);
});

const tree = computed(() => [
    {
        name: knowledge.value!.title,
        children: items.value.map((row) => ({ name: row.item.title, children: [] })),
    },
]);
</script>

<style lang="scss" scoped>
.main-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;

    > h1 {
        text-align: center;
    }
}

.importance {
    display: flex;
    justify-content: center;
    margin-bottom: 0.5rem;
}

.table-frame {
    max-width: calc(var(--main-frame-width) - 2rem);
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}

.knowledge-list {
    padding: 0;
    > li {
        display: flex;
        padding: 0 1em;
        justify-content: space-between;
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
