"use client";

import { useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { Link } from "@/lib/api/use-links";
import { ExternalLink, Copy, Check, BarChart3, QrCode, Pencil, Trash2, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface LinksTableProps {
  links: Link[];
  loading: boolean;
  trafficData?: Map<string, number>; // code -> traffic
  onViewStats: (code: string) => void;
  onShowQr: (code: string) => void;
  onEdit: (link: Link) => void;
  onDelete: (code: string) => void;
}

export function LinksTable({ links, loading, trafficData, onViewStats, onShowQr, onEdit, onDelete }: LinksTableProps) {
  const t = useTranslations("Links");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState<string | null>(null);
  const pageSize = 10;

  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      const matchSearch =
        !search ||
        link.code.toLowerCase().includes(search.toLowerCase()) ||
        link.url.toLowerCase().includes(search.toLowerCase());

      const linkType = getLinkType(link);
      const matchType = typeFilter === "all" || typeFilter === linkType;

      return matchSearch && matchType;
    });
  }, [links, search, typeFilter]);

  const paginatedLinks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLinks.slice(start, start + pageSize);
  }, [filteredLinks, currentPage]);

  const totalPages = Math.ceil(filteredLinks.length / pageSize);

  const copyToClipboard = async (code: string) => {
    const shortUrl = `https://0x1.in/${code}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 space-y-4">
          <div className="animate-pulse flex gap-4">
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
            <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-32" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 py-4 border-b border-slate-200 dark:border-slate-800">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
        <Input
          placeholder={t("search")}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1"
        />
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            if (v) {
              setTypeFilter(v);
              setCurrentPage(1);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t("filter.allTypes")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter.allTypes")}</SelectItem>
            <SelectItem value="custom">{t("filter.custom")}</SelectItem>
            <SelectItem value="permanent">{t("filter.permanent")}</SelectItem>
            <SelectItem value="standard">{t("filter.standard")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 text-left">
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("table.code")}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("table.url")}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("table.type")}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <Flame className="size-3 text-orange-500" />
                  {t("table.traffic")}
                </div>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {t("table.createdAt")}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                {t("table.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedLinks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500 dark:text-slate-400">
                  {t("table.empty")}
                </td>
              </tr>
            ) : (
              paginatedLinks.map((link) => (
                <tr
                  key={link.code}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                        {link.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(link.code)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        {copied === link.code ? (
                          <Check className="size-3.5 text-green-500" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 max-w-xs">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate">
                        {link.url}
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 flex-shrink-0"
                      >
                        <ExternalLink className="size-3.5" />
                      </a>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <LinkTypeBadge type={getLinkType(link)} t={t} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-orange-500 dark:text-orange-400">
                      {trafficData?.get(link.code) ?? link.clicks ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(link.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewStats(link.code)}
                        title={t("stats.title")}
                      >
                        <BarChart3 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onShowQr(link.code)}
                        title={t("qr.title")}
                      >
                        <QrCode className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(link)}
                        title={t("button.edit", { defaultValue: "Edit" })}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(link.code)}
                        title={t("button.delete", { defaultValue: "Delete" })}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            {t("pagination.previous")}
          </Button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
                className="w-8"
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            {t("pagination.next")}
          </Button>
        </div>
      )}
    </div>
  );
}

function getLinkType(link: Link): "custom" | "permanent" | "standard" {
  if (link.is_permanent === 1) return "permanent";
  if (link.is_custom === 1) return "custom";
  return "standard";
}

function LinkTypeBadge({ type, t }: { type: string; t: (key: string) => string }) {
  const variants: Record<string, "default" | "secondary" | "outline"> = {
    custom: "default",
    permanent: "secondary",
    standard: "outline",
  };

  return (
    <Badge variant={variants[type] || "outline"}>
      {t(`type.${type}`)}
    </Badge>
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