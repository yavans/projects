# MiniRedux — 自建状态管理库

从零实现 Redux 核心机制的状态管理库，约 120 行。

## 实现的功能

| 模块 | 说明 |
|------|------|
| **createStore** | `getState` / `dispatch` / `subscribe`，dispatch 互斥锁防止嵌套调用 |
| **combineReducers** | 多 reducer 合并，引用相等性比较跳过无变化分支 |
| **applyMiddleware** | 洋葱模型中间件链，`compose` 从右向左执行 |
| **logger 中间件** | 彩色 console.group 输出 prev/action/next 三态对比 |
| **thunk 中间件** | 支持 `dispatch` 和 `getState` 注入的函数式 action |

## 设计要点

```
action → middleware₁ → middleware₂ → ... → reducer → new state → listeners
                                              ↑
                                   dispatch 时加互斥锁
                                   subscribe 时不可调用
```

- **不可变更新**：reducer 返回新对象，`combineReducers` 用 `!==` 做浅比较决定是否替换
- **中间件链**：每个 middleware 拿到 `{ getState, dispatch }`，通过闭包形成 `next` 链
- **异步支持**：thunk 检测 `typeof action === 'function'`，注入 dispatch 和 getState 后由调用方自行调度

## Demo

`index.html` 展示 Counter（同步 + 异步 +1）与 Todo（增删改查）两个模块共享 store，所有 action 经 logger 打印到页面底部日志面板。

→ [在线预览](https://yavans.github.io/projects/mini-redux/index.html)
