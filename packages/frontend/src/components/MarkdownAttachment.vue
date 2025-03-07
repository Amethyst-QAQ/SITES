<template>
    <p>
        <ElCard>
            <div class="main-frame">
                <FontAwesomeIcon :icon="faFile" class="file-icon" />
                <ElSkeleton :rows="0" animated v-if="fileLoading" :throttle="300" />
                <template v-else>
                    <span>附件:</span>
                    <a :download="file!.name" :href="`/api/files/${fileId}${file!.ext}`">
                        {{ file!.name }}
                        <span>下载</span>
                    </a>
                </template>
            </div>
        </ElCard>
    </p>
</template>

<script lang="ts" setup>
import { myAlert } from '@/lib/my-alert';
import { request } from '@/request';
import { faFile } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ElCard, ElSkeleton } from 'element-plus';
import { GetFileFail, type GotFile } from 'types/api/get-file';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    file: {
        type: [String, Number],
        required: true,
    },
});

const fileId = computed(() => {
    if (typeof props.file == 'string') {
        return parseInt(/^([0-9]+)\.\S+$/.exec(props.file)![1]);
    } else {
        return props.file;
    }
});

const fileLoading = ref(true);
const file = ref<GotFile | undefined>(undefined);
const loadFile = async () => {
    try {
        const response = await request('/get-file', { id: fileId.value });
        if (!response.success) {
            switch (response.reason) {
                case GetFileFail.NOT_EXISTS:
                    myAlert.error('加载附件失败: 文件不存在');
                    break;
                case GetFileFail.UNKNOWN:
                    myAlert.error('加载附件失败: 未知错误');
            }
            return;
        }
        file.value = { ...response.data };
        fileLoading.value = false;
    } catch (e) {
        myAlert.error('加载附件失败: 网络错误');
    }
};

onMounted(loadFile);
</script>

<style lang="scss" scoped>
.main-frame {
    display: flex;
    align-items: center;

    > span {
        font-weight: bold;
        margin-right: 0.5em;
    }

    > a {
        color: var(--el-text-color-regular);
        display: flex;
        flex-grow: 1;
        &:hover {
            color: var(--el-text-color-primary);
        }

        span {
            margin-left: auto;
        }
    }
}

.file-icon {
    margin-right: 0.5em;
}
</style>
