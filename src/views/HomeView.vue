<template>
    <main class="home">
        <div ref="gridContainer" class="grid-stack"></div>
    </main>
</template>

<script setup lang="ts">
    import { onBeforeUnmount, onMounted, ref } from 'vue'
    import { GridStack, type GridStackNode } from 'gridstack'
    import 'gridstack/dist/gridstack.min.css'

    const gridContainer = ref<HTMLElement | null>(null)
    const layoutData = ref<Array<{ id: string; x: number; y: number; w: number; h: number }>>([])
    let grid: GridStack | null = null
    const syncLayoutData = () => {
        if (!grid) {
            layoutData.value = []
            return
        }
        // 禁止拖拽和调整大小后，布局数据就不会变化了
        // grid.enableMove(false)
        // grid.enableResize(false)

        const nodes = (grid.save(false) as GridStackNode[]) ?? []
        layoutData.value = nodes.map(node => ({
            id: String(node.id),
            x: node.x ?? 0,
            y: node.y ?? 0,
            w: node.w ?? 1,
            h: node.h ?? 1,
        }))
    }

    onMounted(() => {
        if (!gridContainer.value) {
            return
        }

        grid = GridStack.init(
            {
                cellHeight: 90,
                margin: 8,
                minRow: 4,
            },
            gridContainer.value,
        )

        const demoWidgets = [
            { id: 'a', x: 0, y: 0, w: 1, h: 1, content: 'A: Sales KPI' },
            { id: 'b', x: 4, y: 0, w: 3, h: 1, content: 'B: Weekly Trend' },
            { id: 'c', x: 8, y: 0, w: 5, h: 4, content: 'C: Alerts' },
            { id: 'd', x: 0, y: 1, w: 2, h: 2, content: 'D: Team Tasks' },
            { id: 'e', x: 6, y: 2, w: 3, h: 2, content: 'E: Notes' },
        ]

        demoWidgets.forEach((widget) => {
            grid?.addWidget({
                id: widget.id,
                x: widget.x,
                y: widget.y,
                w: widget.w,
                h: widget.h,
                content: `<div class="card">${widget.content}</div>`,
            })
        })

        // 这里是“拖拽布局后获取响应数据”的核心位置
        grid.on('change', () => {
            syncLayoutData()
            console.log('layout changed:', layoutData.value)
        })

        syncLayoutData()
    })

    onBeforeUnmount(() => {
        grid?.destroy(false)
        grid = null
    })
</script>

<style scoped>
    .home {
        padding: 20px;
    }

    .grid-stack {
        min-height: 420px;
        background: #f3f4f6;
        border: 1px solid #d1d5db;
        border-radius: 5px;
        padding: 8px;
    }

    :deep(.grid-stack-item-content) {
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 1px solid #dbe3ef;
        background: linear-gradient(135deg, #ffffff, #f8fafc);
        color: #111827;
        font-weight: 600;
    }
</style>