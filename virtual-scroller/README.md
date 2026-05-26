# Virtual Scroller — 高性能虚拟滚动

原生 JS 实现的虚拟滚动组件，仅渲染可视区域内的 DOM 节点，支持 10 万+数据流畅滚动。

## 实现的功能

| 特性 | 说明 |
|------|------|
| **DOM 回收复用** | 只创建可见行 + overscan 缓冲区，滚出视野的节点移除 |
| **绝对定位** | 每行 `transform: translateY(i * rowHeight)` 定位，phantom 元素撑开总高度 |
| **RAF 节流** | `requestAnimationFrame` 合并高频 scroll 事件，避免卡顿 |
| **动态数据** | 可随意切换数据量（100 ~ 100 万），即时重建 |
| **性能监控** | 实时显示当前 DOM 节点数、渲染耗时、FPS |

## 核心原理

```
┌─────────────────┐
│  phantom (10万行高度)  │  ← 撑开原生滚动条
│  ┌───────────┐   │
│  │ row 523   │   │  ← 仅可视区域 ± overscan
│  │ row 524   │   │     每行绝对定位在 phantom 上
│  │ row 525   │   │
│  │   ...     │   │
│  └───────────┘   │
└─────────────────┘
```

100,000 条数据时，DOM 节点约 25 个（18 可见行 + 上下各 8 缓冲区），而非 100,000 个。

→ [在线预览](https://yavans.github.io/projects/virtual-scroller/index.html)
