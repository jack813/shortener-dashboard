# Dashboard Demo 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建一个包含登录页和管理后台的 demo 应用

**Architecture:** 纯前端方案，localStorage 存储登录状态，可折叠侧边栏布局

**Tech Stack:** Next.js 16, Shadcn/ui, lucide-react, next-intl, TailwindCSS v4

---

## 文件结构

```
src/
├── app/[locale]/
│   ├── login/page.tsx           # 登录页
│   └── (dashboard)/
│       ├── layout.tsx           # 侧边栏布局 + 路由守卫
│       ├── dashboard/page.tsx   # 仪表盘首页
│       ├── links/page.tsx       # 链接管理
│       └── api/page.tsx         # API 管理
├── components/
│   ├── auth/
│   │   └── auth-provider.tsx    # 认证 Context
│   └── layout/
│       ├── sidebar.tsx          # 可折叠侧边栏
│       └── header.tsx           # 顶部栏
└── locales/
    ├── en.json                  # 更新翻译
    └── zh.json                  # 更新翻译
```

---

### Task 1: 添加国际化翻译

**Files:**
- Modify: `src/locales/en.json`
- Modify: `src/locales/zh.json`

- [ ] **Step 1: 更新英文翻译**

```json
{
  "Home": {
    "title": "To get started, edit the page.tsx file.",
    "description": "Looking for a starting point or more instructions? Head over to",
    "templates": "Templates",
    "learning": "Learning",
    "center": "center.",
    "deploy": "Deploy Now",
    "documentation": "Documentation"
  },
  "Theme": {
    "toggle": "Toggle theme"
  },
  "Language": {
    "switch": "Switch language"
  },
  "Login": {
    "title": "Login",
    "username": "Username",
    "password": "Password",
    "submit": "Sign In",
    "usernamePlaceholder": "Enter username",
    "passwordPlaceholder": "Enter password"
  },
  "Sidebar": {
    "dashboard": "Dashboard",
    "links": "Links",
    "api": "API",
    "logout": "Logout",
    "collapse": "Collapse sidebar",
    "expand": "Expand sidebar"
  },
  "Dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome back"
  },
  "Links": {
    "title": "Links Management"
  },
  "API": {
    "title": "API Management"
  }
}
```

- [ ] **Step 2: 更新中文翻译**

```json
{
  "Home": {
    "title": "开始使用，请编辑 page.tsx 文件。",
    "description": "寻找起点或更多说明？请前往",
    "templates": "模板",
    "learning": "学习",
    "center": "中心。",
    "deploy": "立即部署",
    "documentation": "文档"
  },
  "Theme": {
    "toggle": "切换主题"
  },
  "Language": {
    "switch": "切换语言"
  },
  "Login": {
    "title": "登录",
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
    "logout": "退出登录",
    "collapse": "收起侧边栏",
    "expand": "展开侧边栏"
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

- [ ] **Step 3: Commit**

```bash
git add src/locales/en.json src/locales/zh.json
git commit -m "feat(i18n): add translations for login and dashboard"
```

---

### Task 2: 创建 AuthProvider 组件

**Files:**
- Create: `src/components/auth/auth-provider.tsx`

- [ ] **Step 1: 创建 AuthProvider**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  username: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "shortener-auth";
const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 读取 localStorage 中的登录状态
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          setUsername(data.username);
        }
      } catch {
        // ignore parse errors
      }
    }
    setIsLoading(false);
  }, []);

  const login = (user: string, _password: string) => {
    const data = { isLoggedIn: true, username: user };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
    setIsLoggedIn(true);
    setUsername(user);
    return true;
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { SIDEBAR_COLLAPSED_KEY };
```

- [ ] **Step 2: 更新根布局添加 AuthProvider**

修改 `src/app/layout.tsx`，在 ThemeProvider 内部添加 AuthProvider：

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shortener Dashboard",
  description: "Short link management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/auth/auth-provider.tsx src/app/layout.tsx
git commit -m "feat(auth): add AuthProvider with localStorage persistence"
```

---

### Task 3: 创建登录页

**Files:**
- Create: `src/app/[locale]/login/page.tsx`

- [ ] **Step 1: 创建登录页**

```tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/language-toggle";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const t = useTranslations("Login");
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      login(username.trim(), password);
      router.replace("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-700/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">
              Shortener Dashboard
            </h1>
            <p className="text-slate-400 text-sm">
              {t("title")}
            </p>
          </div>

          {/* 表单 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {t("username")}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t("usernamePlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                {t("password")}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="size-4" />
              {t("submit")}
            </Button>
          </form>

          {/* 语言切换 */}
          <div className="mt-6 flex justify-center">
            <LanguageToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/login/page.tsx
git commit -m "feat(login): add login page with glass card design"
```

---

### Task 4: 创建侧边栏组件

**Files:**
- Create: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: 创建可折叠侧边栏**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/navigation";
import { useAuth, SIDEBAR_COLLAPSED_KEY } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Link as LinkIcon,
  Key,
  LogOut,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  labelKey: keyof ReturnType<typeof useTranslations<"Sidebar">>;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: <LayoutDashboard className="size-5" /> },
  { href: "/links", labelKey: "links", icon: <LinkIcon className="size-5" /> },
  { href: "/api", labelKey: "api", icon: <Key className="size-5" /> },
];

export function Sidebar() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();
  const router = useRouter();
  const { logout, username } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  // 从 localStorage 读取折叠状态
  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  const toggleCollapsed = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(newValue));
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300",
        collapsed ? "w-[60px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-800">
        {!collapsed && (
          <span className="font-bold text-white text-lg truncate">
            Dashboard
          </span>
        )}
        {collapsed && (
          <span className="font-bold text-white text-lg mx-auto">
            D
          </span>
        )}
      </div>

      {/* 导航项 */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
                    collapsed && "justify-center"
                  )}
                  title={collapsed ? t(item.labelKey) : undefined}
                >
                  {item.icon}
                  {!collapsed && <span className="font-medium">{t(item.labelKey)}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部区域 */}
      <div className="border-t border-slate-800">
        {/* 折叠按钮 */}
        <div className="px-2 py-2">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={toggleCollapsed}
            className={cn(
              "w-full text-slate-400 hover:text-white hover:bg-slate-800",
              !collapsed && "justify-start gap-3"
            )}
            title={collapsed ? t("expand") : t("collapse")}
          >
            {collapsed ? (
              <PanelLeft className="size-5" />
            ) : (
              <>
                <PanelLeftClose className="size-5" />
                <span>{t("collapse")}</span>
              </>
            )}
          </Button>
        </div>

        {/* 用户区域 */}
        <div className="px-2 py-2 border-t border-slate-800">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            onClick={handleLogout}
            className={cn(
              "w-full text-slate-400 hover:text-white hover:bg-slate-800",
              !collapsed && "justify-start gap-3"
            )}
            title={collapsed ? t("logout") : undefined}
          >
            <LogOut className="size-5" />
            {!collapsed && (
              <>
                <span>{t("logout")}</span>
                {username && (
                  <span className="ml-auto text-xs text-slate-500 truncate max-w-[60px]">
                    {username}
                  </span>
                )}
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat(layout): add collapsible sidebar component"
```

---

### Task 5: 创建顶部栏组件

**Files:**
- Create: `src/components/layout/header.tsx`

- [ ] **Step 1: 创建顶部栏**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

const pageNames: Record<string, string> = {
  dashboard: "Dashboard",
  links: "Links",
  api: "API",
};

export function Header() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  // 从路径提取当前页面名称
  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[1] || "dashboard";
  const pageTitle = pageNames[currentPage] || currentPage;
  const translatedTitle = t(pageTitle.toLowerCase() as keyof ReturnType<typeof useTranslations<"Sidebar">>);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      {/* 面包屑 */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Home</span>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="font-medium text-slate-900 dark:text-white">
          {translatedTitle}
        </span>
      </div>

      {/* 右侧操作 */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/header.tsx
git commit -m "feat(layout): add header component with breadcrumb"
```

---

### Task 6: 创建管理后台布局

**Files:**
- Create: `src/app/[locale]/(dashboard)/layout.tsx`

- [ ] **Step 1: 创建 Dashboard 布局（含路由守卫）**

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "@/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoading, isLoggedIn, router]);

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // 未登录，不渲染内容
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/\(dashboard\)/layout.tsx
git commit -m "feat(dashboard): add dashboard layout with route guard"
```

---

### Task 7: 创建 Dashboard 页面

**Files:**
- Create: `src/app/[locale]/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: 创建仪表盘页面**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { Link2, MousePointer, BarChart3, Clock } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
        {value}
      </div>
      {trend && (
        <div className="text-xs text-green-600 dark:text-green-400">
          {trend}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const { username } = useAuth();

  return (
    <div className="space-y-6">
      {/* 欢迎卡片 */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {t("welcome")}, {username}!
        </h1>
        <p className="text-blue-100">
          Here&apos;s an overview of your short links performance.
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Links"
          value="128"
          icon={<Link2 className="size-5" />}
          trend="+12 this week"
        />
        <StatCard
          title="Total Clicks"
          value="4,521"
          icon={<MousePointer className="size-5" />}
          trend="+8.2% vs last week"
        />
        <StatCard
          title="Click Rate"
          value="3.2%"
          icon={<BarChart3 className="size-5" />}
        />
        <StatCard
          title="Avg. Response"
          value="45ms"
          icon={<Clock className="size-5" />}
        />
      </div>

      {/* 最近链接表格占位 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Recent Links
          </h2>
        </div>
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p>No recent links to display.</p>
          <p className="text-sm mt-1">Create your first short link to get started.</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/(dashboard)/dashboard/page.tsx"
git commit -m "feat(dashboard): add dashboard page with stats cards"
```

---

### Task 8: 创建 Links 页面

**Files:**
- Create: `src/app/[locale]/(dashboard)/links/page.tsx`

- [ ] **Step 1: 创建链接管理页面**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink, MoreHorizontal } from "lucide-react";

export default function LinksPage() {
  const t = useTranslations("Links");

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Link
        </Button>
      </div>

      {/* 表格占位 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                Short URL
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                Destination
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                Clicks
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                Created
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <td className="px-4 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={5}>
                No links created yet. Click &quot;Create Link&quot; to add your first short link.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/(dashboard)/links/page.tsx"
git commit -m "feat(links): add links management page"
```

---

### Task 9: 创建 API 页面

**Files:**
- Create: `src/app/[locale]/(dashboard)/api/page.tsx`

- [ ] **Step 1: 创建 API 管理页面**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function APIPage() {
  const t = useTranslations("API");
  const [showKey, setShowKey] = useState(false);

  // Demo API key
  const apiKey = "sk_test_placeholder";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t("title")}
      </h1>

      {/* API Key 卡片 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          API Key
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Use this key to authenticate API requests. Keep it secure and never share it publicly.
        </p>

        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-4 py-2.5">
            <code className="flex-1 text-sm font-mono text-slate-700 dark:text-slate-300 truncate">
              {showKey ? apiKey : "••••••••••••••••••••••••••••••••"}
            </code>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => setShowKey(!showKey)}
              title={showKey ? "Hide" : "Show"}
            >
              {showKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={copyToClipboard} title="Copy">
            <Copy className="size-4" />
          </Button>
          <Button variant="outline" size="icon" title="Regenerate">
            <RefreshCw className="size-4" />
          </Button>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Usage
        </h2>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-slate-100">
{`curl -X POST https://api.0x1.in/v1/links \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`}
          </pre>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/[locale]/(dashboard)/api/page.tsx"
git commit -m "feat(api): add API management page"
```

---

### Task 10: 更新首页重定向

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: 更新首页重定向到登录页**

将首页改为重定向到登录页：

```tsx
import { redirect } from "@/navigation";

export default function Home({ params }: { params: Promise<{ locale: string }> }) {
  redirect("/login");
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: redirect home page to login"
```

---

### Task 11: 本地测试

- [ ] **Step 1: 运行开发服务器**

```bash
bun dev
```

预期：访问 http://localhost:3000 自动重定向到登录页

- [ ] **Step 2: 测试登录流程**

1. 访问 `/en/login`
2. 输入任意用户名和密码
3. 点击登录，应跳转到 `/en/dashboard`
4. 测试侧边栏折叠功能
5. 测试退出登录
6. 刷新页面，验证登录状态持久化

- [ ] **Step 3: 构建测试**

```bash
bun run build
```

预期：构建成功，无错误

---

### Task 12: 部署到 Cloudflare Pages

- [ ] **Step 1: 构建生产版本**

```bash
bun run build
```

- [ ] **Step 2: 部署**

```bash
bunx wrangler pages deploy out --project-name=shortener-dashboard
```

预期：部署成功，显示 URL

- [ ] **Step 3: 配置自定义域名**

在 Cloudflare Pages Dashboard 设置自定义域名：
- 项目：shortener-dashboard
- 域名：dashboard.0x1.in

- [ ] **Step 4: 最终提交**

```bash
git add -A
git commit -m "feat: complete dashboard demo implementation

- Login page with glass card design
- Collapsible sidebar with dark theme
- Dashboard, Links, API pages
- localStorage-based authentication

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
```

---

## 部署后验证

1. 访问 https://dashboard.0x1.in
2. 验证重定向到登录页
3. 输入任意账号密码登录
4. 测试侧边栏折叠
5. 测试主题切换
6. 测试语言切换
7. 测试退出登录