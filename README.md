# Projects

个人项目合集，涵盖前端框架原理、算法可视化、游戏开发与品牌页面设计。

---

## 🧠 MiniReact — Virtual DOM & Hooks 框架

从头实现 React 核心机制的精简框架（~350 行）。

- **Virtual DOM** diff 算法（同层比较，type → UPDATE / PLACEMENT / DELETION）
- **Fiber 架构**：`requestIdleCallback` 分片调度，可中断的 reconciliation
- **Hooks**：`useState`（状态队列）+ `useEffect`（依赖比较 + cleanup）
- **事件系统** + Function Component 支持

→ [源码](mini-react/) | [在线预览](https://yavans.github.io/projects/mini-react/index.html)

---

## ⚡ MyPromise — Promise/A+ 规范实现

完整实现 [Promise/A+ 规范](https://promisesaplus.com/)，含全部 ES6+ 扩展。

- **核心**：三态状态机 → Then 链 → 异步回调队列
- **Promise Resolution Procedure（2.3）**：thenable 递归解包、循环引用检测、多次调用保护
- **静态方法**：`all` / `race` / `allSettled` / `any` / `resolve` / `reject`
- **实例方法**：`then` / `catch` / `finally`

→ [源码](promise-aplus/) | [测试套件](https://yavans.github.io/projects/promise-aplus/test.html)

---

## 📊 Algorithm Visualizer

Canvas 动画可视化排序算法与路径搜索。

**排序：** Quick Sort · Merge Sort · Heap Sort · Bubble Sort · Insertion Sort
— 实时显示比较/交换次数，颜色标注操作位置

**路径搜索：** A\* · Dijkstra · BFS · DFS
— 交互式网格，鼠标绘制墙壁，拖动起终点，对比探索策略

→ [源码](algo-visualizer/) | [在线预览](https://yavans.github.io/projects/algo-visualizer/index.html)

---

## 🔄 MiniRedux — 自建状态管理库

从零实现 Redux 核心（~120 行）。

- **createStore**：`getState` / `dispatch`（互斥锁）/ `subscribe` / 取消订阅
- **combineReducers**：多 reducer 合并 + 引用相等性优化
- **applyMiddleware**：洋葱模型中间件链（logger + thunk）
- Demo 包含 Counter（同步/异步）与 Todo 共享 store

→ [源码](mini-redux/) | [在线预览](https://yavans.github.io/projects/mini-redux/index.html)

---

## 🚀 Virtual Scroller — 高性能虚拟滚动

仅渲染可视区域 DOM，支持 10 万+行流畅滚动。

- **DOM 回收**：创建可见行 + 8 行缓冲区，滚动时复用而非重建
- **RAF 节流**：`requestAnimationFrame` 合并高频 scroll 事件
- 实时 FPS / DOM 节点数 / 渲染耗时监控

→ [源码](virtual-scroller/) | [在线预览](https://yavans.github.io/projects/virtual-scroller/index.html)

---

## 📋 Drag & Drop Kanban — 拖拽看板

仿 Trello 看板，HTML5 Drag & Drop API，localStorage 持久化。

- 同列拖拽重排 + 跨列移动卡片 · 拖拽视觉反馈
- 卡片 CRUD（标题/描述/Tag） · 动态新增列表

→ [源码](drag-drop-kanban/) | [在线预览](https://yavans.github.io/projects/drag-drop-kanban/index.html)

---

## 🎯 MiniVue — Proxy 响应式系统

从零实现 Vue 3 风格 Proxy 响应式系统（~180 行）。

- **reactive** — Proxy 深层递归响应式代理
- **effect** — 自动依赖收集 + 变化时重新执行
- **computed** — 惰性求值 + 缓存
- **ref / watch** — 原始值包装 + 侦听器

→ [源码](mini-vue/) | [在线预览](https://yavans.github.io/projects/mini-vue/index.html)

---

## 🧭 MiniRouter — SPA 前端路由

从零实现 SPA 路由器（~160 行），Hash / History 双模式。

- **动态路由匹配** — `/user/:id` 参数提取
- **导航守卫** — beforeEach 拦截 + 重定向
- **声明式导航** — data-link 属性拦截
- **Query 解析** — URL 查询参数自动提取

→ [源码](mini-router/) | [在线预览](https://yavans.github.io/projects/mini-router/index.html)

---

## 🔄 MiniObservable — 响应式编程

从零实现 RxJS 风格 Observable 与操作符（~170 行）。

- **Observable + Observer** — 推送式数据流
- **Pipe 模式** — 链式操作符组合
- **操作符** — map / filter / take / debounceTime / merge
- **Subject** — 多播 + fromEvent / interval

→ [源码](mini-observable/) | [在线预览](https://yavans.github.io/projects/mini-observable/index.html)

---

## 🎮 Tank Battle — 双人坦克对战

Canvas 实时双人对战游戏，同键盘操作。

- P1: WASD + F | P2: 方向键 + /
- 子弹墙壁反弹、粒子爆炸、复活无敌、实时 HUD

→ [在线预览](https://yavans.github.io/projects/tank-battle.html)

---

## ☕ Aurum Coffee — 高端品牌页

Apple 风格极简品牌展示页，10 个板块，响应式布局。

→ [在线预览](https://yavans.github.io/projects/aurum-coffee.html)

---

## ✅ Todo App

轻量待办事项，localStorage 持久化。增删改查 + 双击编辑 + 三态筛选。

→ [在线预览](https://yavans.github.io/projects/todo.html)
