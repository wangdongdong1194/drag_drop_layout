import type { Component } from 'vue'

export type GridLayoutItem = {
    id: string
    x: number
    y: number
    w: number
    h: number
}

export type WidgetItem = GridLayoutItem & {
    component: Component
    componentProps?: Record<string, unknown>
}

export type GridStackBoardExpose = {
    addWidget: (widget: WidgetItem) => boolean
    removeWidget: (widgetId: string) => boolean
}
