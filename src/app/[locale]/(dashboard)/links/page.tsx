"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LinksPage() {
  const t = useTranslations("Links");

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <Button className="gap-2">
          <Plus className="size-4" />
          {t("createLink")}
        </Button>
      </div>

      {/* Table placeholder */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-800/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("shortUrl")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("destination")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("clicks")}
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("created")}
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-slate-500 dark:text-slate-400">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-200 dark:border-slate-800">
              <td className="px-4 py-8 text-center text-slate-500 dark:text-slate-400" colSpan={5}>
                {t("noLinks")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}