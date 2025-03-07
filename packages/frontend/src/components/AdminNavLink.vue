<template>
    <div class="outer-frame">
        <span class="current-title" v-if="isCurrent">
            <slot></slot>
        </span>
        <span class="disabled-title" v-else-if="disabled">
            <slot></slot>
        </span>
        <RouterLink class="to-link" :to="{ name: to }" v-else>
            <slot></slot>
        </RouterLink>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
    to: {
        type: String,
        required: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
});

const route = useRoute();
const isCurrent = computed(() => route.name == props.to);
</script>

<style lang="scss" scoped>
.outer-frame {
    padding: 0.25rem;
}

.current-title {
    font-weight: bold;
}

.disabled-title {
    color: var(--el-text-color-secondary);
}

.to-link {
    color: var(--el-text-color-primary);
    text-decoration: none;
}
</style>
