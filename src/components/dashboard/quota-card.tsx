"use client";

import { useTranslations } from "next-intl";
import { QuotaResponse } from "@/lib/api/use-quota";

interface QuotaCardProps {
  quota: QuotaResponse | null;
}

export function QuotaCard({ quota }: QuotaCardProps) {
  const t = useTranslations("Dashboard");

  if (!quota) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded" />
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { plan, limits, usage } = quota;
  const planName = plan === "pro" ? t("proPlan") : t("freePlan");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span>📊</span> {t("quotaUsage")}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            plan === "pro"
              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
              : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
          }`}
        >
          {planName}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {t("monthlyLinks")}
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {usage.monthly}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            / {limits.monthlyLinks}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {t("customLinks")}
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {usage.custom}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            / {limits.customLinks}
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {t("permanentLinks")}
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">
            {usage.permanent}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            / {limits.permanentLinks}
          </div>
        </div>
      </div>
    </div>
  );
}