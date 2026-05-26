INSERT INTO users (username, password, created_at) VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP);
INSERT INTO users (username, password, created_at) VALUES ('demo', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', CURRENT_TIMESTAMP);

INSERT INTO posts (title, content, tags, author_id, created_at, updated_at) VALUES
('Spring Boot 入门指南', '# Spring Boot 入门指南\n\nSpring Boot 让 Java 开发变得简单。\n\n## 特点\n- 自动配置\n- 嵌入式服务器\n- Starter 依赖', 'Java,Spring', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('JWT 认证原理', '# JWT 认证原理\n\nJSON Web Token 是一种无状态认证方案。\n\n## 结构\n1. Header\n2. Payload\n3. Signature', 'Java,Security', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('RESTful API 设计最佳实践', '# RESTful API 设计\n\n良好的 API 设计让前后端协作更高效。', 'API,Design', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO comments (content, post_id, user_id, created_at) VALUES
('写得很清楚，赞！', 1, 2, CURRENT_TIMESTAMP),
('请问支持 refresh token 吗？', 2, 2, CURRENT_TIMESTAMP);
