# 使用说明

## 配置组件间距
```
GridStackBoard.vue
grid = GridStack.init(
    {
        cellHeight: 90,
        margin: 4, // 接收字符串或数字修改间距宽度
        minRow: 4,
    },
    gridContainer.value,
)
```

## 配置整体间隔
```
GridStackBoard.vue
.grid-stack {
    margin: 4px; // 设置
}
```