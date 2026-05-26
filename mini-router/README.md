# MiniRouter — SPA 路由

从零实现 SPA 路由器（~160 行），支持 Hash 与 History 两种模式。

- **动态路由** — `/user/:id` 参数匹配
- **Hash / History 双模式** — 自动适配静态部署与服务器环境
- **beforeEach 守卫** — 导航拦截，支持异步
- **data-link 拦截** — 声明式链接，阻止页面刷新
- **Query 解析** — URL 查询参数自动提取

→ [源码](router.js) | [在线预览](https://yavans.github.io/projects/mini-router/index.html)
