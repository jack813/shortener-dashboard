"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";

export function Header() {
  const t = useTranslations("Sidebar");
  const pathname = usePathname();

  // pathname from next-intl doesn't include locale prefix
  // e.g., "/en/links" -> "/links"
  const segments = pathname.split("/").filter(Boolean);
  const currentPage = segments[0] || "dashboard";
  const translatedTitle = t(currentPage as "dashboard" | "links" | "api");

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500 dark:text-slate-400">{t("home")}</span>
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