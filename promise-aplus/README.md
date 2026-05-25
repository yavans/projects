# MyPromise — Promise/A+ 规范实现

完整实现 [Promise/A+ 规范](https://promisesaplus.com/) 的 JavaScript Promise，并扩展了 ES6+ 的全部静态方法。

## 实现的功能

| 模块 | 说明 |
|------|------|
| **核心状态机** | `pending` → `fulfilled` / `rejected`，状态不可逆 |
| **Then 链 (2.2)** | 返回新 Promise，支持值的传递与穿透 |
| **Resolution Procedure (2.3)** | 处理 thenable、循环引用检测、多次调用保护 |
| **异步执行 (2.2.4)** | `setTimeout(fn, 0)` 保证 onFulfilled/onRejected 异步调用 |
| **静态方法** | `resolve` / `reject` / `all` / `race` / `allSettled` / `any` |
| **实例方法** | `then` / `catch` / `finally` |

## 关键设计

```
new MyPromise(executor)
  → 同步执行 executor(resolve, reject)
  → then/catch 注册回调到队列
  → resolve/reject 触发 → 异步执行回调
  → 回调返回值经 resolvePromise 递归解包
```

- **Promise Resolution Procedure**：处理 `x.then` 为函数的情况（thenable），保证与第三方 Promise 库互操作
- **循环引用检测**：`promise2 === x` 时抛出 TypeError
- **多次调用保护**：`called` 标志确保 thenable 的 resolve/reject 只生效一次

## 测试

打开 `test.html` 运行完整测试套件（约 25 个测试用例，覆盖规范所有关键条款）。

## 运行

```bash
open test.html
```

在线预览：https://yavans.github.io/projects/promise-aplus/test.html
