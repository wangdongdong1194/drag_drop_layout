<template>
    <div ref="gridContainer" class="grid-stack"></div>
</template>

<script setup lang="ts">
    import { createApp, onBeforeUnmount, onMounted, ref, type App as VueApp, type Component } from 'vue'
    import { GridStack, type GridStackNode } from 'gridstack'
    import 'gridstack/dist/gridstack.min.css'

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

    const emit = defineEmits<{
        layoutChange: [layout: GridLayoutItem[]]
    }>()

    const props = defineProps<{
        widgetComponents: WidgetItem[]
    }>()

    const gridContainer = ref<HTMLElement | null>(null)
    let grid: GridStack | null = null
    const widgetApps: VueApp[] = []

    const syncLayoutData = () => {
        if (!grid) {
            emit('layoutChange', [])
            return
        }

        const nodes = (grid.save(false) as GridStackNode[]) ?? []
        const layout = nodes.map(node => ({
            id: String(node.id),
            x: node.x ?? 0,
            y: node.y ?? 0,
            w: node.w ?? 1,
            h: node.h ?? 1,
        }))

        emit('layoutChange', layout)
    }

    const mountWidgetComponent = (widgetComponent: Component, hostEl: HTMLElement) => {
        const app = createApp(widgetComponent)
        app.mount(hostEl)
        widgetApps.push(app)
    }

    onMounted(() => {
        if (!gridContainer.value) {
            return
        }

        grid = GridStack.init(
            {
                cellHeight: 90,
                margin: 4,
                minRow: 4,
            },
            gridContainer.value,
        )

        props.widgetComponents.forEach((widget) => {
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
            if (!contentEl) {
                return
            }

            const mountPoint = document.createElement('div')
            mountPoint.className = 'vue-widget-host'
            contentEl.replaceChildren(mountPoint)
            mountWidgetComponent(widget.component, mountPoint)
        })

        grid.on('change', syncLayoutData)
        syncLayoutData()
    })

    onBeforeUnmount(() => {
        widgetApps.forEach((app) => app.unmount())
        widgetApps.length = 0

        if (grid) {
            grid.off('change')
            grid.destroy(false)
            grid = null
        }
    })
</script>

<style scoped>
    .grid-stack {
        /* background: blueviolet; */
        margin: 4px;
    }

    :deep(.grid-stack-item-content) {
        overflow: auto;
        background: greenyellow;
    }

    :deep(.vue-widget-host) {
        min-width: 100%;
    }
</style>
