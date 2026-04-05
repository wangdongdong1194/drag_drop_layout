<template>
    <main class="home">
        <div class="toolbar">
            <button type="button" @click="addNewWidget">新增 Widget</button>
            <label class="select-label" for="widgetSelect">当前节点</label>
            <select id="widgetSelect" v-model="selectedWidgetId">
                <option value="">请选择</option>
                <option v-for="item in layoutData" :key="item.id" :value="item.id">
                    {{ item.id }}
                </option>
            </select>
            <button type="button" @click="addAfterSelectedWidget">在选中后添加</button>
            <button type="button" @click="removeSelectedWidget">删除选中节点</button>
        </div>
        <GridStackBoard ref="boardRef" :widgets="widgets" :selected-widget-id="selectedWidgetId"
            @layout-change="onLayoutChange" @widget-select="onWidgetSelect" />
    </main>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import GridStackBoard from '../components/GridStackBoard.vue'
    import TestContent from '../components/TestContent.vue'
    import ImgTitleDesc from '../templates/img_title_desc.vue'
    import type { GridLayoutItem, GridStackBoardExpose, WidgetItem } from '../types/grid'

    const layoutData = ref<GridLayoutItem[]>([])
    const boardRef = ref<GridStackBoardExpose | null>(null)
    const selectedWidgetId = ref('')
    let nextId = 1

    const widgets: WidgetItem[] = [
        { id: 'a', component: TestContent, x: 2, y: 0, w: 4, h: 3, scrollable: false },
        { id: 'bb', component: TestContent, x: 4, y: 0, w: 4, h: 3, scrollable: true },
        {
            id: 'c',
            component: ImgTitleDesc,
            componentProps: {
                src: 'https://p1.img.cctvpic.com/photoAlbum/page/performance/img/2026/4/5/1775365753054_325.jpg',
                title: '默认图文卡片',
                desc: '这是来自 HomeView 的初始传参这是来自 HomeView 的初始传参',
                link: 'https://www.cctv.com',
                openMode: 'blank',
            },
            x: 0,
            y: 0,
            w: 6,
            h: 4,
            scrollable: false,
        },
    ]

    const addNewWidget = () => {
        const id = `new-${nextId}`
        const added = boardRef.value?.addWidget({
            id,
            component: ImgTitleDesc,
            componentProps: {
                src: `https://picsum.photos/seed/${id}/480/320`,
                title: `新增卡片 ${id}`,
                desc: '这是通过 addWidget 传入的 props',
            },
            x: 0,
            y: 99,
            w: 4,
            h: 3,
        })

        if (added) {
            selectedWidgetId.value = id
            nextId += 1
        }
    }

    const addAfterSelectedWidget = () => {
        const selectedId = selectedWidgetId.value
        if (!selectedId) {
            return
        }

        const base = layoutData.value.find(item => item.id === selectedId)
        if (!base) {
            return
        }

        const id = `new-${nextId}`
        const added = boardRef.value?.addWidget({
            id,
            component: ImgTitleDesc,
            componentProps: {
                src: `https://picsum.photos/seed/${id}/480/320`,
                title: `跟随 ${selectedId} 新增`,
                desc: '在选中节点后插入',
            },
            x: base.x + base.w,
            y: base.y,
            w: base.w,
            h: base.h,
        })

        if (added) {
            selectedWidgetId.value = id
            nextId += 1
        }
    }

    const removeSelectedWidget = () => {
        const id = selectedWidgetId.value
        if (!id) {
            return
        }

        const removed = boardRef.value?.removeWidget(id)
        if (!removed) {
            return
        }

        selectedWidgetId.value = ''
    }

    const onLayoutChange = (layout: GridLayoutItem[]) => {
        layoutData.value = layout
        if (selectedWidgetId.value && !layout.some(item => item.id === selectedWidgetId.value)) {
            selectedWidgetId.value = ''
        }
        console.log('layout changed:', layoutData.value)
    }

    const onWidgetSelect = (widgetId: string) => {
        selectedWidgetId.value = widgetId
    }
</script>

<style scoped>
    .home {
        padding: 4px;
        min-width: 1280px;
        max-width: 1280px;
        margin: 0 auto;
    }

    .toolbar {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .toolbar button {
        border: 1px solid #d0d7de;
        border-radius: 6px;
        background: #fff;
        padding: 6px 10px;
        cursor: pointer;
    }

    .select-label {
        font-size: 14px;
        color: #334155;
    }

    .toolbar select {
        border: 1px solid #d0d7de;
        border-radius: 6px;
        background: #fff;
        padding: 6px 10px;
    }
</style>