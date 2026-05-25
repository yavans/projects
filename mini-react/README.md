# MiniReact — 自建 Virtual DOM + Hooks 框架

从头实现 React 核心机制的精简框架，约 350 行代码。

## 实现的功能

| 模块 | 说明 |
|------|------|
| **Virtual DOM** | `createElement()` / `h()` 创建虚拟节点树 |
| **Fiber 架构** | 可中断的 reconciliation，基于 `requestIdleCallback` 的分片调度 |
| **Diff 算法** | 同层比较，type 相同则 UPDATE，不同则 PLACEMENT/DELETION |
| **Hooks** | `useState`（状态管理 + 批量更新排队）、`useEffect`（依赖比较 + cleanup） |
| **事件系统** | 合成事件绑定，自动清理旧事件监听 |
| **组件系统** | 支持 Function Component，区分 host component 和 function component 的渲染路径 |

## 设计思路

```
JSX/h() → Virtual DOM Tree → Fiber Tree (reconciler) → DOM mutations (commit)
                                   ↑
                            requestIdleCallback 分片
```

- **build phase**（可中断）：遍历 fiber 树，diff 比较，标记 effectTag
- **commit phase**（不可中断）：统一执行 DOM 操作

## Demo

打开 `index.html` 可看到一个用 MiniReact 编写的完整 Todo 应用，包含增删改查、筛选、localStorage 持久化。

## 运行

```bash
# 直接打开浏览器
open index.html
```

在线预览：https://yavans.github.io/projects/mini-react/index.html
