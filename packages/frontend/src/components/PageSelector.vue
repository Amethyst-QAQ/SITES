<template>
    <div class="outer-frame">
        <ElButton size="small" :disabled="model == 0" @click="jump(0)">
            <FontAwesomeIcon :icon="faAnglesLeft" />
        </ElButton>
        <ElButton size="small" :disabled="model == 0" @click="jump(model - 1)">
            <FontAwesomeIcon :icon="faAngleLeft" />
        </ElButton>
        <div class="inner-frame">
            <ElInputNumber v-model="target" :min="1" :max="total" :controls="false" size="small" />
            <div class="text1">/</div>
            <div class="text2">{{ total }}</div>
            <ElButton size="small" @click="jump(target - 1)">跳转</ElButton>
        </div>
        <ElButton size="small" :disabled="model == total - 1" @click="jump(model + 1)">
            <FontAwesomeIcon :icon="faAngleRight" />
        </ElButton>
        <ElButton size="small" :disabled="model == total - 1" @click="jump(total - 1)">
            <FontAwesomeIcon :icon="faAnglesRight" />
        </ElButton>
    </div>
</template>

<script lang="ts" setup>
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ElButton, ElInputNumber } from 'element-plus';
import { ref } from 'vue';

const model = defineModel({ type: Number, required: true });

defineProps({
    total: {
        type: Number,
        required: true,
    },
});

const target = ref(model.value + 1);

const emit = defineEmits({
    change: (_value: number) => true,
});

const jump = (value: number) => {
    if (value != model.value) {
        model.value = value;
        target.value = model.value + 1;
        emit('change', value);
    }
};
</script>

<style lang="scss" scoped>
.outer-frame {
    display: flex;
    justify-content: space-between;
}

.inner-frame {
    display: flex;
    > .text1 {
        margin-left: 0.5rem;
    }
    > .text2 {
        margin: 0 0.5rem;
    }
}
</style>
