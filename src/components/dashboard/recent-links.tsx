"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Link } from "@/lib/api/use-links";

interface RecentLinksProps {
  links: Link[];
  loading: boolean;
}

export function RecentLinks({ links, loading }: RecentLinksProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(shortUrl);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const recentLinks = links.slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {t("recentLinks")}
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-20" />
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentLinks.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">
            {t("recentLinks")}
          </h2>
        </div>
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          <p>{t("noLinks")}</p>
          <p className="text-sm mt-1">{t("getStarted")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h2 className="font-semibold text-slate-900 dark:text-white">
          {t("recentLinks")}
        </h2>
        <button
          onClick={() => router.push("/links")}
          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t("viewAll")}
        </button>
      </div>
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {recentLinks.map((link) => {
          const shortUrl = `https://0x1.in/${link.code}`;
          return (
            <div
              key={link.code}
              className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-blue-600 dark:text-blue-400">
                    {link.code}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {link.clicks} {t("clicks")}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-1">
                  {link.url}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(shortUrl)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={t("copy")}
                >
                  {copied === shortUrl ? (
                    <Check className="size-4 text-green-500" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title={t("open")}
                >
                  <ExternalLink className="size-4" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}