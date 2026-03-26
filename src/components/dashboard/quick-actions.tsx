"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Link2, BarChart3, Key } from "lucide-react";

interface QuickAction {
  icon: React.ReactNode;
  titleKey: string;
  descKey: string;
  href?: string;
}

export function QuickActions() {
  const t = useTranslations("Dashboard");
  const router = useRouter();

  const actions: QuickAction[] = [
    {
      icon: <Link2 className="size-5" />,
      titleKey: "createShortLink",
      descKey: "quickGenerate",
      href: "/links",
    },
    {
      icon: <BarChart3 className="size-5" />,
      titleKey: "manageLinks",
      descKey: "viewAllLinks",
      href: "/links",
    },
    {
      icon: <Key className="size-5" />,
      titleKey: "manageApiKeys",
      descKey: "",
      href: "/api",
    },
  ];

  const handleClick = (action: QuickAction) => {
    if (action.href) {
      router.push(action.href);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        {t("quickActions")}
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleClick(action)}
            className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-600 transition-colors text-left"
          >
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {action.icon}
            </div>
            <div>
              <div className="font-medium text-slate-900 dark:text-white text-sm">
                {t(action.titleKey as any)}
              </div>
              {action.descKey && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t(action.descKey as any)}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}