<template>
    <main class="home">
        <div ref="gridContainer" class="grid-stack"></div>
    </main>
</template>

<script setup lang="ts">
    import { createApp, onBeforeUnmount, onMounted, ref, type App as VueApp } from 'vue'
    import { GridStack, type GridStackNode } from 'gridstack'
    import HelloWorld from '../components/HelloWorld.vue'
    import TestContent from '../components/TestContent.vue'
    import 'gridstack/dist/gridstack.min.css'

    const gridContainer = ref<HTMLElement | null>(null)
    const layoutData = ref<Array<{ id: string; x: number; y: number; w: number; h: number }>>([])
    let grid: GridStack | null = null
    const widgetApps: VueApp[] = []
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
            { id: 'a', x: 0, y: 0, w: 4, h: 3 },
            { id: 'b', x: 4, y: 0, w: 4, h: 3 },
            { id: 'c', x: 8, y: 0, w: 4, h: 3 },
        ]

        demoWidgets.forEach((widget) => {
            if (!grid) {
                return
            }

            const item = grid.addWidget({
                id: widget.id,
                x: widget.x,
                y: widget.y,
                w: widget.w,
                h: widget.h,
                content: '',
            })

            const contentEl = item.querySelector('.grid-stack-item-content') as HTMLElement | null
            if (contentEl) {
                const mountPoint = document.createElement('div')
                mountPoint.className = 'vue-widget-host'
                contentEl.replaceChildren(mountPoint)
                if (widget.id === 'a') {
                    const app = createApp(TestContent)
                    app.mount(mountPoint)
                    widgetApps.push(app)
                } else {
                    const app = createApp(HelloWorld)
                    app.mount(mountPoint)
                    widgetApps.push(app)                    
                }
            }
        })

        // 这里是“拖拽布局后获取响应数据”的核心位置
        grid.on('change', () => {
            syncLayoutData()
            console.log('layout changed:', layoutData.value)
        })

        syncLayoutData()
    })

    onBeforeUnmount(() => {
        widgetApps.forEach((app) => app.unmount())
        widgetApps.length = 0
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
        padding: 2px;
    }

    :deep(.grid-stack-item-content) {
        overflow: auto;
        border-radius: 5px;
        border: 1px solid #dbe3ef;
        background: linear-gradient(135deg, #ffffff, #f8fafc);
    }

    :deep(.vue-widget-host) {
        min-width: 100%;
    }
</style>