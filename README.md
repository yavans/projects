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
