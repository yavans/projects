# Drag & Drop Kanban — 拖拽看板

仿 Trello 的看板应用，HTML5 Drag & Drop API 实现，localStorage 持久化。

## 实现的功能

| 特性 | 说明 |
|------|------|
| **拖拽排序** | 卡片在同列内拖拽重排 + 跨列拖拽移动 |
| **Drag & Drop API** | `dragstart/dragover/drop` 事件链，`effectAllowed` 控制 |
| **视觉反馈** | 拖拽时卡片半透明 + 目标列高亮 + 插入位置指示 |
| **卡片管理** | 新建 / 删除卡片（Tag 标签 + 描述），模态框表单 |
| **列管理** | 动态新增列表 |
| **数据持久化** | localStorage 自动保存，刷新不丢失 |

## 技术要点

- 拖拽时源列和目标列通过 `data-col` 属性关联，`data-card` 定位具体卡片
- 松手时计算落点最近的卡片，插入到其上方（`splice(index, 0, card)`）
- `dragover` 必须 `preventDefault()` 才能触发 `drop`
- 删除按钮通过 `stopPropagation()` 防止触发父元素的 click 事件

→ [在线预览](https://yavans.github.io/projects/drag-drop-kanban/index.html)
