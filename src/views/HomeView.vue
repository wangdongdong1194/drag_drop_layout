<template>
    <main class="home">
        <GridStackBoard :widget-components="widgetComponents" @layout-change="onLayoutChange" />
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import GridStackBoard from '../components/GridStackBoard.vue'
    import HelloWorld from '../components/HelloWorld.vue'
    import TestContent from '../components/TestContent.vue'

    type GridLayoutItem = {
        id: string
        x: number
        y: number
        w: number
        h: number
    }

    const layoutData = ref<GridLayoutItem[]>([])
    const widgetComponents = {
        a: TestContent,
        b: HelloWorld,
        c: HelloWorld,
    }

    const onLayoutChange = (layout: GridLayoutItem[]) => {
        layoutData.value = layout
        console.log('layout changed:', layoutData.value)
    }
</script>

<style scoped>
    .home {
        padding: 20px;
    }
</style>