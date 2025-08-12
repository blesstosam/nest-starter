# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在操作此仓库代码时提供指导。

## 开发命令

**包管理器**: `pnpm`

**核心开发命令**:
```bash
pnpm install              # 安装依赖
pnpm run start:dev        # 启动开发服务器（支持热重载）
pnpm run start:debug      # 启用调试模式启动
pnpm run build            # 构建生产版本
pnpm run start:prod       # 启动生产服务器
```

**测试**:
```bash
pnpm run test             # 运行单元测试
pnpm run test:watch       # 在监视模式下运行测试
pnpm run test:cov         # 运行测试并生成覆盖率报告
pnpm run test:e2e         # 运行端到端测试（会重置测试数据库）
pnpm run test:debug       # 使用检查器调试测试
```

**代码质量**:
```bash
pnpm run lint             # 对 TypeScript 文件进行 Lint 检查并自动修复
```

**数据库操作**:
```bash
npx prisma generate       # 生成 Prisma 客户端类型
npx prisma migrate dev    # 创建并应用新迁移
npx prisma migrate deploy # 应用待处理的迁移
npx prisma db push        # 将模式更改推送到数据库
```

## 项目架构

**框架**: 使用 Fastify 适配器的 NestJS
- 使用装饰器和依赖注入
- 基于功能的模块化架构
- 使用 Passport 策略的 JWT 身份验证

**数据库**: 使用 Prisma ORM 的 MySQL
- 模式定义在 `prisma/schema.prisma`
- 模型: User, Resource, File, Tag
- 外键关系: Resource -> File

**文件存储**: MinIO 对象存储
- 配置在 `src/minio.ts`
- 支持多部分文件上传处理

**核心模块**:
- `auth/` - JWT 身份验证，本地/令牌策略
- `user/` - 用户管理
- `resource/` - 带可见性控制的资源管理
- `file/` - 使用 MinIO 集成的文件上传/下载
- `tag/` - 标签系统

**常用工具** (`src/common/`):
- 用于 API 响应和用户上下文的自定义装饰器
- 全局异常过滤器和拦截器
- Pino 日志配置
- 用于分页查询的基础 DTO

## 配置

**环境设置**:
1. 复制 `.env.example` 为 `.env`（如果存在）或创建包含以下内容的 `.env`：
   ```
   DATABASE_URL=mysql://user:password@localhost:3306/database
   JWT_SECRET=your-secret-key
   ```

**API 文档**:
- 运行时在 `/api/docs` 提供 Swagger UI
- 全局 API 前缀: `/api`

**关键技术细节**:
- 使用 Fastify 替代 Express 以获得更好性能
- 通过自定义拦截器处理 BigInt 序列化
- 文件上传限制为 50MB
- 使用 class-transformer/class-validator 进行全局验证
- 使用 lint-staged 的预提交钩子保证代码质量

## 代码规范

- 使用 Anthony Fu 的 ESLint 配置 (`@antfu/eslint-config`)
- 启用 TypeScript 严格模式
- 一致的导入风格（由于 ESLint 配置，装饰器未作为类型导入）
- Git 钩子在提交时强制执行 Linting
