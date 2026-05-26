# FullStack Blog

全栈博客平台 — Express + JWT 认证 + Vanilla JS SPA。

## 技术栈

| 层 | 技术 |
|---|------|
| 后端 | Node.js · Express 5 |
| 数据库 | JSON 文件存储 (零依赖) |
| 认证 | bcryptjs + JWT |
| 前端 | Vanilla JS SPA (Hash Router) |
| 渲染 | Markdown → HTML (marked) |

## 功能

- 用户注册 / 登录 (JWT 7天有效期)
- 文章 CRUD (Markdown 编辑)
- 评论系统
- 标签分类
- 分页
- Admin 后台管理
- 暗色主题响应式 UI

## 快速开始

```bash
npm install
npm start
```

浏览器打开 http://localhost:3000

**默认管理员账号**: `admin` / `admin123`

## API 端点

| Method | Path | Auth | 说明 |
|--------|------|------|------|
| POST | /api/auth/register | — | 注册 |
| POST | /api/auth/login | — | 登录 |
| GET | /api/posts | — | 文章列表 (?page=&tag=) |
| GET | /api/posts/:id | — | 文章详情 |
| POST | /api/posts | Bearer | 创建文章 |
| PUT | /api/posts/:id | Bearer | 更新文章 |
| DELETE | /api/posts/:id | Bearer | 删除文章 |
| GET | /api/posts/:id/comments | — | 评论列表 |
| POST | /api/posts/:id/comments | — | 添加评论 |

## 项目结构

```
fullstack-blog/
├── server.js           # Express 入口
├── db.js               # 数据层 (JSON 文件 + 查询方法)
├── middleware/auth.js   # JWT 验证中间件
├── routes/
│   ├── auth.js         # 注册 / 登录路由
│   └── posts.js        # 文章 + 评论路由
├── public/
│   ├── index.html      # SPA 壳
│   ├── app.js          # 前端 SPA (路由 / API / 渲染)
│   └── style.css       # 暗色主题样式
└── package.json
```
