<template>
    <div class="chart-container" ref="chartContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type PropType } from 'vue';
import * as echarts from 'echarts/core';
import { TreeChart } from 'echarts/charts';
import { SVGRenderer } from 'echarts/renderers';

type Tree = {
    name: string;
    children: Tree;
}[];

const props = defineProps({
    tree: {
        type: Array as PropType<Tree>,
        required: true,
    },
});

const chartContainer = ref<HTMLDivElement>();

const chart = ref<echarts.ECharts | null>(null);

onMounted(() => {
    echarts.use([TreeChart, SVGRenderer]);
    chart.value = echarts.init(chartContainer.value, null, {
        renderer: 'svg',
    });
    chart.value.setOption({
        series: [
            {
                type: 'tree',
                data: props.tree,
                label: {
                    position: 'left',
                    verticalAlign: 'middle',
                    align: 'right',
                    fontSize: '1rem',
                    color: 'var(--el-text-color-primary)',
                },
                leaves: {
                    label: {
                        position: 'right',
                        verticalAlign: 'middle',
                        align: 'left',
                    },
                },
            },
        ],
    });
});
</script>

<style lang="scss" scoped>
.chart-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
}
</style>
