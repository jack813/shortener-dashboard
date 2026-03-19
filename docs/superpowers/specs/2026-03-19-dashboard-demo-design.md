# 短链接管理仪表板 Demo 设计

日期：2026-03-19

## 概述

搭建一个包含登录功能和管理后台的 demo 应用，部署到 Cloudflare Pages (域名: dashboard.0x1.in)。

## 技术决策

| 项目 | 选择 |
|------|------|
| 登录页风格 | 全屏背景 + 毛玻璃卡片 |
| 管理后台布局 | 可折叠侧边栏 |
| 登录持久化 | localStorage |
| 主题色 | 深色系（深蓝/灰） |
| 图标库 | lucide-react |

## 路由结构

```
src/app/[locale]/
├── login/
│   └── page.tsx              # 登录页
└── (dashboard)/              # 路由组（需要登录）
    ├── layout.tsx            # 侧边栏布局
    ├── dashboard/
    │   └── page.tsx          # 仪表盘首页
    ├── links/
    │   └── page.tsx          # 链接管理
    └── api/
        └── page.tsx          # API 管理
```

## 组件结构

```
src/components/
├── ui/                       # Shadcn 组件（已有 button）
├── auth/
│   └── auth-provider.tsx     # 认证 Context Provider
├── layout/
│   ├── sidebar.tsx           # 可折叠侧边栏
│   ├── sidebar-item.tsx      # 侧边栏导航项
│   └── header.tsx            # 顶部栏
└── login/
    └── login-form.tsx        # 登录表单
```

## 页面设计

### 登录页 (`/[locale]/login`)

**布局**：
- 全屏深色渐变背景：`from-slate-900 via-slate-800 to-slate-900`
- 居中毛玻璃卡片：`backdrop-blur-xl bg-white/10 border border-white/20`
- 卡片内容：
  - Logo/标题
  - 账号输入框
  - 密码输入框
  - 登录按钮
  - 语言切换

**交互**：
- 提交任意账号密码 → 存储 `{ isLoggedIn: true, username }` 到 localStorage
- 登录成功 → 跳转到 `/[locale]/dashboard`

### 管理后台布局 (`(dashboard)/layout.tsx`)

**侧边栏**：
- 收起状态：60px 宽，仅显示图标
- 展开状态：220px 宽，显示图标 + 文字
- 使用 `useState` 管理展开/收起状态
- 存储折叠状态到 localStorage

**侧边栏内容**：
```
┌─────────────────┐
│ Logo            │
├─────────────────┤
│ Dashboard       │  → layout-dashboard
│ Links           │  → link
│ API             │  → key
├─────────────────┤
│ [折叠按钮]       │  → panel-left-close / panel-left
├─────────────────┤
│ 用户头像 + 退出  │  → log-out
└─────────────────┘
```

**顶部栏**：
- 左侧：面包屑导航
- 右侧：主题切换 + 语言切换

### Dashboard 页面 (`/[locale]/dashboard`)

Demo 内容：
- 欢迎卡片
- 4 个统计卡片（占位）
- 最近链接表格（占位）

### Links 页面 (`/[locale]/links`)

Demo 内容：
- 页面标题
- 新建按钮（占位）
- 数据表格（占位）

### API 页面 (`/[locale]/api`)

Demo 内容：
- 页面标题
- API Key 显示区域（占位）

## 认证流程

### AuthProvider

```typescript
interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}
```

- `login()`: 存储到 localStorage，返回 true
- `logout()`: 清除 localStorage
- 初始化时从 localStorage 读取状态

### 路由守卫

在 `(dashboard)/layout.tsx` 中检查登录状态：
- 未登录 → 重定向到 `/[locale]/login`
- 已登录 → 渲染布局

## 国际化

新增翻译键到 `locales/en.json` 和 `locales/zh.json`：

```json
{
  "Login": {
    "title": "登录 / Login",
    "username": "账号",
    "password": "密码",
    "submit": "登录",
    "usernamePlaceholder": "请输入账号",
    "passwordPlaceholder": "请输入密码"
  },
  "Sidebar": {
    "dashboard": "仪表盘",
    "links": "链接管理",
    "api": "API",
    "logout": "退出登录"
  },
  "Dashboard": {
    "title": "仪表盘",
    "welcome": "欢迎回来"
  },
  "Links": {
    "title": "链接管理"
  },
  "API": {
    "title": "API 管理"
  }
}
```

## 部署配置

### wrangler.toml

```toml
name = "shortener-dashboard"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "out"

[vars]
ENVIRONMENT = "production"
```

### 部署命令

```bash
bun run build
bunx wrangler pages deploy out --project-name=shortener-dashboard
```

### 自定义域名

在 Cloudflare Pages Dashboard 设置：
- 域名：`dashboard.0x1.in`

## 实现步骤

1. 创建 AuthProvider 组件
2. 创建登录页面和表单
3. 创建侧边栏组件（可折叠）
4. 创建管理后台布局
5. 创建三个子页面（Dashboard、Links、API）
6. 添加国际化翻译
7. 测试构建和部署