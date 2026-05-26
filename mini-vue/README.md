# MiniVue — Proxy 响应式系统

从零实现 Vue 3 风格的 Proxy 响应式系统（~180 行）。

- **reactive(obj)** — Proxy 代理，深层递归响应式
- **effect(fn)** — 副作用函数，自动收集依赖，变化时重新执行
- **computed(fn)** — 惰性求值 + 缓存，仅依赖变化时重新计算
- **ref(value)** — 原始值响应式包装
- **watch(source, cb)** — 侦听响应式数据变化

→ [源码](reactive.js) | [在线预览](https://yavans.github.io/projects/mini-vue/index.html)
