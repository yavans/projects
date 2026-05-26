# 姚伟旗

**Java 开发实习生** | 15356955648 | yavans@163.com | [github.com/yavans](https://github.com/yavans)

---

## 技术栈

- **Java**：Java SE（集合、IO、多线程）、Spring Boot 3、Spring Security、Spring Data JPA
- **数据库**：MySQL（CRUD、联表查询）、H2、Redis（了解）
- **前端**：JavaScript（ES6+）、Vue3、React、HTML5、CSS3
- **工具 & 其他**：Maven、Git、JWT（jjwt）、BCrypt、RESTful API 设计
- **CS 基础**：数据结构、算法、操作系统、计算机网络、编译原理、数据库原理

---

## 核心项目

### Java Blog — Spring Boot RESTful API 博客系统

基于 Spring Boot 3 的全栈博客后端，采用分层架构：Controller → Service → Repository。

- 使用 **Spring Security + JWT（jjwt）** 实现无状态认证，BCrypt（10 轮加盐）密码加密，Token 7 天有效期
- 基于 **Spring Data JPA + H2** 实现 ORM 持久化，编写 `@Query` 实现标签 + 关键词模糊搜索 + 分页排序
- 设计 **RESTful API**（10 个端点）：用户注册/登录、文章 CRUD（权限校验，仅作者可修改）、评论系统
- 使用 **Spring Validation** 校验请求参数，`@RestControllerAdvice` 全局统一异常处理与响应格式
- 配置 **Swagger（springdoc）** 自动生成 API 文档，H2 Console 调试数据库

### MiniReact — 自研 Virtual DOM & Hooks 框架 | ~350 行

从零实现 React 核心机制：Virtual DOM diff、Fiber 架构（`requestIdleCallback` 可中断渲染）、useState / useEffect Hooks。

### MyPromise — Promise/A+ 规范完整实现 | ~230 行

严格遵循 Promise/A+ 规范，通过官方测试套件。实现三态状态机、异步回调队列、Promise Resolution Procedure（thenable 递归解包、循环引用检测）。

### FullStack Blog — Express + JWT 全栈博客（Node.js 版）

同一博客业务逻辑的 Node.js 实现。Express 5 + JWT + Vanilla JS SPA 前后端分离架构。

- 对比两版实现，深入理解 Java（强类型、OOP、JPA）与 Node.js（弱类型、函数式、JSON 文件存储）的设计差异

### Algorithm Visualizer — 算法可视化

Canvas 动画展示 5 种排序算法（Quick / Merge / Heap / Bubble / Insertion）+ 4 种路径搜索（A\* / Dijkstra / BFS / DFS），实时显示比较/交换次数。

---

## 教育背景

**江苏第二师范学院** | 计算机科学与技术 本科 | 2023.09 — 2026.06

主修课程：数据结构 · 操作系统 · 计算机网络 · 数据库原理 · 编译原理 · 计算机组成原理

---

## 荣誉奖项

- 2023 — **蓝桥杯编程竞赛** 三等奖
- 2023-2024 — 校级**三好学生**

---

## 自我评价

具备前后端双栈视角，通过同一业务（博客系统）的 Java（Spring Boot）与 Node.js（Express）双版本实现，深入理解不同技术栈的设计哲学。Java 基础扎实（数据结构、多线程、集合源码），注重代码的规范性（分层架构、统一异常处理、参数校验）。
