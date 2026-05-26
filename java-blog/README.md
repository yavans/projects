# Java Blog — Spring Boot REST API

Spring Boot 3 + JWT 认证的全栈博客后端，对应 Express 版本的 Java 重构。

## 技术栈

- **Spring Boot 3.2** — 核心框架
- **Spring Security** — 认证与授权
- **JWT（jjwt）** — 无状态 Token 认证，7 天有效期
- **Spring Data JPA + H2** — ORM + 内存数据库，零配置启动
- **BCrypt** — 密码加密（10 轮加盐）
- **Spring Validation** — 请求参数校验
- **Swagger（springdoc）** — API 文档自动生成

## 项目结构

```
src/main/java/com/blog/
├── BlogApplication.java          # 启动入口
├── config/
│   ├── SecurityConfig.java       # Spring Security 配置
│   ├── JwtAuthFilter.java        # JWT 认证过滤器
│   └── GlobalExceptionHandler.java  # 全局异常处理
├── entity/
│   ├── User.java                 # 用户实体
│   ├── Post.java                 # 文章实体
│   └── Comment.java              # 评论实体
├── dto/
│   ├── AuthDto.java              # 登录/注册 DTO
│   ├── PostDto.java              # 文章请求 DTO
│   ├── CommentDto.java           # 评论请求 DTO
│   └── ApiResponse.java          # 统一响应格式
├── repository/
│   ├── UserRepository.java
│   ├── PostRepository.java       # 含标签 + 关键词模糊搜索
│   └── CommentRepository.java
├── service/
│   ├── UserService.java          # 注册 + 登录 + BCrypt 校验
│   ├── PostService.java          # CRUD + 权限校验 + 分页
│   └── CommentService.java
├── controller/
│   ├── AuthController.java       # POST /api/auth/register, /login
│   ├── PostController.java       # CRUD /api/posts
│   └── CommentController.java    # /api/posts/{id}/comments
└── security/
    └── JwtUtil.java              # JWT 生成/验证工具类
```

## 快速启动

```bash
# 确保安装了 JDK 17+ 和 Maven
cd java-blog
mvn spring-boot:run

# 启动后访问：
# Swagger UI: http://localhost:8080/swagger-ui/index.html
# H2 Console:  http://localhost:8080/h2-console
```

## API 一览

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 否 |
| POST | /api/auth/login | 登录，返回 JWT | 否 |
| GET | /api/posts | 文章列表（分页 + 标签/关键词筛选） | 否 |
| GET | /api/posts/{id} | 文章详情（含评论） | 否 |
| POST | /api/posts | 发布文章 | 是 |
| PUT | /api/posts/{id} | 编辑文章（仅作者） | 是 |
| DELETE | /api/posts/{id} | 删除文章（仅作者） | 是 |
| GET | /api/posts/{id}/comments | 获取评论 | 否 |
| POST | /api/posts/{id}/comments | 发表评论 | 是 |
| DELETE | /api/posts/{id}/comments/{id} | 删除评论（仅作者） | 是 |

## 测试账号

启动后自动初始化：
- 用户名 `admin`，密码 `123456`
- 用户名 `demo`，密码 `123456`
