"use client";

import { useState } from "react";
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

type SidebarLabelKey = "dashboard" | "links" | "api" | "logout" | "collapse" | "expand";

interface NavItem {
  href: string;
  labelKey: SidebarLabelKey;
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
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return stored === "true";
  });

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

      {/* Navigation */}
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

      {/* Bottom area */}
      <div className="border-t border-slate-800">
        {/* Collapse button */}
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

        {/* User area */}
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