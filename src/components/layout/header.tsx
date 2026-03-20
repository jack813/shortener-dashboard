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

  // Extract current page name from path
  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[1] || "dashboard";
  const pageTitle = pageNames[currentPage] || currentPage;
  const translatedTitle = t(pageTitle.toLowerCase() as keyof ReturnType<typeof useTranslations<"Sidebar">>);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400">Home</span>
        <span className="text-slate-400 dark:text-slate-600">/</span>
        <span className="font-medium text-slate-900 dark:text-white">
          {translatedTitle}
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageToggle />
      </div>
    </header>
  );
}