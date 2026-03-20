# 项目概览

短链接管理仪表板 (Shortener Dashboard) - 基于 Next.js + Shadcn/ui + Cloudflare Pages

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| UI 组件 | Shadcn/ui |
| 样式 | TailwindCSS v4 |
| 类型 | TypeScript |
| 部署 | Cloudflare Pages |
| 包管理器 | Bun |

## Commands

```bash
# 开发
bun dev                    # 启动开发服务器
bun run build              # 构建生产版本
bun run start              # 启动生产服务器
bun run lint               # ESLint 代码检查

# Cloudflare Pages
bunx wrangler pages dev    # 本地 Cloudflare Pages 预览
bunx wrangler pages deploy # 部署到 Cloudflare Pages
```

## 架构

```
shortener-dashboard/
├── src/
│   ├── app/                    # Next.js App Router 路由
│   │   ├── [locale]/           # 国际化路由文件夹
│   │   │   ├── layout.tsx      # Locale layout with NextIntlClientProvider
│   │   │   └── page.tsx        # Home page
│   │   ├── layout.tsx          # Root layout with ThemeProvider
│   │   └── globals.css         # 全局样式
│   ├── components/             # React 组件
│   │   ├── ui/                 # Shadcn/ui 组件
│   │   ├── theme-provider.tsx  # 主题 Provider
│   │   ├── theme-toggle.tsx    # 主题切换按钮
│   │   └── language-toggle.tsx # 语言切换按钮
│   ├── i18n.ts                 # i18n 配置
│   ├── middleware.ts           # i18n 路由中间件
│   ├── navigation.ts           # 导航工具函数
│   ├── locales/                # 翻译文件
│   │   ├── en.json             # 英文翻译
│   │   └── zh.json             # 中文翻译
│   └── lib/                    # 工具函数
├── public/                     # 静态资源
├── wrangler.toml               # Cloudflare Pages 配置
└── next.config.ts              # Next.js 配置 (with next-intl plugin)
```

### 核心配置

- **Next.js**: 静态生成 + Middleware 路由 (适配 Cloudflare Pages)
- **图片**: `unoptimized: true` - 禁用默认图片优化（静态导出要求）
- **构建输出**: `out/` 目录 - Cloudflare Pages 部署目录
- **i18n**: 使用 `[locale]` 路由文件夹模式

## 开发约定

### 导入别名

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

### 组件规范

- 所有组件放在 `src/components/` 目录
- Shadcn/ui 组件放在 `src/components/ui/` 目录
- 自定义组件直接放在 `src/components/` 目录

### 样式规范

- 使用 TailwindCSS v4 工具类
- 使用 `cn()` 工具函数合并类名（来自 `@/lib/utils`）
- 主题配置通过 Tailwind v4 CSS 变量系统

### 开发流程

1. **添加组件**: `bunx shadcn add <component>`
2. **开发预览**: `bun dev`
3. **本地预览**: `bunx wrangler pages dev`
4. **部署**: `bunx wrangler pages deploy`

## i18n 国际化

项目使用 `next-intl` 实现国际化，支持中文和英文，英语为默认语言。

### 路由规则

- `/` - 自动重定向到 `/en`
- `/en` - 英文界面
- `/zh` - 中文界面

### 文件结构

```
src/
├── i18n.ts              # i18n 配置文件
├── middleware.ts        # i18n 路由中间件
├── navigation.ts        # 导航工具函数
└── locales/
    ├── en.json          # 英文翻译
    └── zh.json          # 中文翻译
```

### 使用翻译

**服务端组件** (在 `[locale]` 路由中):
```typescript
import { getTranslations } from "next-intl/server";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return <h1>{t("title")}</h1>;
}
```

**客户端组件**:
```typescript
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("Home");
  return <h1>{t("title")}</h1>;
}
```

### 语言切换

使用 `LanguageToggle` 组件或编程式切换:
```typescript
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";

const locale = useLocale();
const pathname = usePathname();
const router = useRouter();
router.replace(pathname, { locale: locale === "en" ? "zh" : "en" });
```

## 主题切换

项目使用 `next-themes` 实现主题切换，支持 light 和 dark 两种主题。

### 特性

- 自动检测系统偏好 (`prefers-color-scheme`)
- 支持手动切换并持久化用户选择
- 无闪烁切换

### 文件结构

```
src/components/
├── theme-provider.tsx   # 主题 Provider 组件
└── theme-toggle.tsx     # 主题切换按钮
```

### 使用主题

**ThemeProvider** (已在根布局配置):
```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**ThemeToggle 组件**:
```typescript
import { ThemeToggle } from "@/components/theme-toggle";

// 在组件中使用
<ThemeToggle />
```

**使用当前主题**:
```typescript
"use client";
import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Toggle
    </button>
  );
}
```
