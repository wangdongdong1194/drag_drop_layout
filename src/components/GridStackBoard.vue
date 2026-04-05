<template>
    <div ref="gridContainer" class="grid-stack"></div>
</template>

<script setup lang="ts">
    import { createApp, onBeforeUnmount, onMounted, ref, watch, type App as VueApp } from 'vue'
    import { GridStack, type GridStackNode } from 'gridstack'
    import type { GridLayoutItem, WidgetItem } from '../types/grid'
    import 'gridstack/dist/gridstack.min.css'

    const emit = defineEmits<{
        layoutChange: [layout: GridLayoutItem[]]
        widgetSelect: [widgetId: string]
    }>()

    const props = defineProps<{
        widgets: WidgetItem[]
        selectedWidgetId?: string
    }>()

    const gridContainer = ref<HTMLElement | null>(null)
    let grid: GridStack | null = null
    const widgetApps = new Map<string, VueApp>()
    const selectedWidgetId = ref('')

    const syncSelectedStyle = () => {
        if (!grid) {
            return
        }

        ; (grid.engine.nodes ?? []).forEach((node) => {
            if (!node.el) {
                return
            }

            node.el.classList.toggle('is-selected', String(node.id) === selectedWidgetId.value)
        })
    }

    const setSelectedWidget = (widgetId: string) => {
        selectedWidgetId.value = widgetId
        syncSelectedStyle()
        emit('widgetSelect', widgetId)
    }

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
        syncSelectedStyle()
    }

    const mountWidgetComponent = (widgetId: string, widgetComponent: WidgetItem['component'], hostEl: HTMLElement) => {
        const app = createApp(widgetComponent)
        app.mount(hostEl)
        widgetApps.set(widgetId, app)
    }

    const unmountWidgetComponent = (widgetId: string) => {
        const app = widgetApps.get(widgetId)
        if (!app) {
            return
        }

        app.unmount()
        widgetApps.delete(widgetId)
    }

    const addWidgetInternal = (widget: WidgetItem, selectAfterAdd: boolean) => {
        if (!grid) {
            return false
        }

        const exists = (grid.engine.nodes ?? []).some(node => String(node.id) === widget.id)
        if (exists) {
            return false
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
            return false
        }

        const mountPoint = document.createElement('div')
        mountPoint.className = 'vue-widget-host'
        contentEl.replaceChildren(mountPoint)
        mountWidgetComponent(widget.id, widget.component, mountPoint)
        if (selectAfterAdd) {
            setSelectedWidget(widget.id)
        } else {
            syncSelectedStyle()
        }
        syncLayoutData()
        return true
    }

    const addWidget = (widget: WidgetItem) => addWidgetInternal(widget, true)

    const removeWidget = (widgetId: string) => {
        if (!grid) {
            return false
        }

        const node = (grid.engine.nodes ?? []).find(item => String(item.id) === widgetId)
        if (!node?.el) {
            return false
        }

        unmountWidgetComponent(widgetId)
        grid.removeWidget(node.el)
        if (selectedWidgetId.value === widgetId) {
            selectedWidgetId.value = ''
            emit('widgetSelect', '')
        }
        syncLayoutData()
        return true
    }

    const onGridClick = (event: MouseEvent) => {
        if (!grid) {
            return
        }

        const target = event.target as HTMLElement | null
        const itemEl = target?.closest('.grid-stack-item') as HTMLElement | null
        if (!itemEl) {
            return
        }

        const node = (grid.engine.nodes ?? []).find(item => item.el === itemEl)
        if (!node?.id) {
            return
        }

        setSelectedWidget(String(node.id))
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

        props.widgets.forEach((widget) => {
            addWidgetInternal(widget, false)
        })

        gridContainer.value.addEventListener('click', onGridClick)
        grid.on('change', syncLayoutData)
        syncLayoutData()
    })

    watch(
        () => props.selectedWidgetId,
        (widgetId) => {
            selectedWidgetId.value = widgetId ?? ''
            syncSelectedStyle()
        },
        { immediate: true },
    )

    onBeforeUnmount(() => {
        gridContainer.value?.removeEventListener('click', onGridClick)
        widgetApps.forEach((app) => app.unmount())
        widgetApps.clear()

        if (grid) {
            grid.off('change')
            grid.destroy(false)
            grid = null
        }
    })

    defineExpose({
        addWidget,
        removeWidget,
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

    :deep(.grid-stack-item.is-selected .grid-stack-item-content) {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
        border-radius: 10px;
    }

    :deep(.vue-widget-host) {
        min-width: 100%;
    }
</style>
