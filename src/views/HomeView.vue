<template>
    <main class="home">
        <GridStackBoard :widget-components="widgetComponents" @layout-change="onLayoutChange" />
    </main>
</template>

<script setup lang="ts">
    import { ref, type Component } from 'vue'
    import GridStackBoard from '../components/GridStackBoard.vue'
    import TestContent from '../components/TestContent.vue'

    type GridLayoutItem = {
        id: string
        x: number
        y: number
        w: number
        h: number
    }

    type WidgetItem = GridLayoutItem & {
        component: Component
    }

    const layoutData = ref<GridLayoutItem[]>([])
    const widgetComponents: WidgetItem[] = [
        { id: 'a', component: TestContent, x: 2, y: 0, w: 4, h: 3 },
        { id: 'bb', component: TestContent, x: 4, y: 0, w: 4, h: 3 },
        { id: 'c', component: TestContent, x: 8, y: 0, w: 4, h: 3 },
    ]

    const onLayoutChange = (layout: GridLayoutItem[]) => {
        layoutData.value = layout
        console.log('layout changed:', layoutData.value)
    }
</script>

<style scoped>
</style>