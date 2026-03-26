"use client";

import { useTranslations } from "next-intl";
import { ApiKey } from "@/lib/api/use-api-keys";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Ban } from "lucide-react";

interface ApiKeysTableProps {
  keys: ApiKey[];
  loading: boolean;
  onRename: (key: ApiKey) => void;
  onRevoke: (key: ApiKey) => void;
}

export function ApiKeysTable({ keys, loading, onRename, onRevoke }: ApiKeysTableProps) {
  const t = useTranslations("API");

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (keys.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">{t("table.noKeys")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("table.name")}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("table.key")}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("table.status")}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("table.links")}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {t("table.created")}
            </th>
            <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
              {t("table.actions")}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {keys.map((key) => (
            <tr
              key={key.id}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">
                {key.name || "Unnamed"}
              </td>
              <td className="px-4 py-3">
                <code className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                  sk_...{key.id.slice(-6)}
                </code>
              </td>
              <td className="px-4 py-3">
                <Badge variant={key.is_revoked ? "destructive" : "default"}>
                  {key.is_revoked ? t("status.revoked") : t("status.active")}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                {key.link_count || 0}
              </td>
              <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                {formatDate(key.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRename(key)}
                    disabled={key.is_revoked === 1}
                    className="gap-1"
                  >
                    <Pencil className="size-3.5" />
                    {t("button.rename", { defaultValue: "Rename" })}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRevoke(key)}
                    disabled={key.is_revoked === 1}
                    className="gap-1 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Ban className="size-3.5" />
                    {t("button.revoke", { defaultValue: "Revoke" })}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}