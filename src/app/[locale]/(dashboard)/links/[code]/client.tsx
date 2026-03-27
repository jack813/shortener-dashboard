"use client";

import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { get, getSessionToken } from "@/lib/api/fetcher";
import type { RuleStats } from "@/lib/types/split-rules";

interface DetailStatsData {
  total: number;
  code: string;
  url: string;
  geography?: {
    countries?: Array<{ country: string; count: number }>;
    cities?: Array<{ city: string; count: number }>;
  };
  devices?: {
    mobile: number;
    desktop: number;
    tablet: number;
    bot?: number;
  };
  recent_logs?: Array<{
    country: string;
    timestamp: string;
    user_agent: string;
    city?: string;
    device?: string;
    browser?: string;
    os?: string;
    referer?: string;
  }>;
  rules?: RuleStats[];
  no_rule_matched?: number;
  no_rule_percentage?: number;
}

type TabValue = "overview" | "rules" | "geo" | "device" | "logs";

const validTabs: TabValue[] = ["overview", "rules", "geo", "device", "logs"];

export function StatsDetailClient() {
  const t = useTranslations("Links");
  const params = useParams();
  const searchParams = useSearchParams();
  const code = params.code as string;

  // Get tab from query params, default to "overview"
  const tabParam = searchParams.get("tab") as string;
  const activeTab: TabValue = validTabs.includes(tabParam as TabValue)
    ? (tabParam as TabValue)
    : "overview";

  const [stats, setStats] = useState<DetailStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const data = await get<DetailStatsData>(
        `/api/stats/${code}/detail`,
        token || undefined
      );
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("stats.detail.error"));
    } finally {
      setLoading(false);
    }
  }, [code, t]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Build short URL
  const shortUrl = stats?.code
    ? `https://0x1.in/${stats.code}`
    : `https://0x1.in/${code}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/links">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="size-4 mr-2" />
              {t("stats.detail.backToLinks")}
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t("stats.detail.title")}
            </h1>
            <div className="flex items-center gap-2 mt-1 text-slate-600 dark:text-slate-400">
              <span>{t("stats.detail.shortLink")}:</span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {shortUrl}
                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="py-12 text-center text-slate-500 dark:text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          {t("stats.detail.loading")}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="py-8 text-center text-red-500">
          {error}
          <Button variant="outline" size="sm" className="ml-4" onClick={loadStats}>
            Retry
          </Button>
        </div>
      )}

      {/* Stats Content */}
      {!loading && !error && stats && (
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">
              {t("stats.detail.tabs.overview")}
            </TabsTrigger>
            <TabsTrigger value="rules">
              {t("stats.detail.tabs.rules")}
            </TabsTrigger>
            <TabsTrigger value="geo">{t("stats.detail.tabs.geo")}</TabsTrigger>
            <TabsTrigger value="device">
              {t("stats.detail.tabs.device")}
            </TabsTrigger>
            <TabsTrigger value="logs">{t("stats.detail.tabs.logs")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <OverviewTab stats={stats} t={t} />
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <RulesTab stats={stats} t={t} />
          </TabsContent>

          <TabsContent value="geo" className="mt-6">
            <GeoTab stats={stats} t={t} />
          </TabsContent>

          <TabsContent value="device" className="mt-6">
            <DeviceTab stats={stats} t={t} />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <LogsTab stats={stats} t={t} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

// Tab components

function OverviewTab({
  stats,
  t,
}: {
  stats: DetailStatsData;
  t: (key: string) => string;
}) {
  return (
    <div className="space-y-6">
      {/* Total Visits */}
      <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
          {stats.total || 0}
        </div>
        <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {t("stats.totalVisits")}
        </div>
      </div>

      {/* Target URL */}
      {stats.url && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Target URL
          </div>
          <a
            href={stats.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all"
          >
            {stats.url}
          </a>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStatCard
          label="Countries"
          value={stats.geography?.countries?.length || 0}
        />
        <QuickStatCard
          label="Cities"
          value={stats.geography?.cities?.length || 0}
        />
        <QuickStatCard label="Rules" value={stats.rules?.length || 0} />
        <QuickStatCard
          label="Recent Logs"
          value={stats.recent_logs?.length || 0}
        />
      </div>
    </div>
  );
}

function QuickStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function RulesTab({
  stats,
  t,
}: {
  stats: DetailStatsData;
  t: (key: string) => string;
}) {
  if (!stats.rules || stats.rules.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        {t("stats.noData")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {stats.rules.map((rule) => (
        <div
          key={rule.ruleId}
          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
        >
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-900 dark:text-white">
                {rule.ruleName}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {rule.count} visits
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {rule.percentage.toFixed(1)}%
              </div>
              <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${rule.percentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {stats.no_rule_matched !== undefined && stats.no_rule_matched > 0 && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-600 dark:text-slate-400">
                {t("stats.defaultRedirect")}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {stats.no_rule_matched} visits
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-slate-500">
                {(stats.no_rule_percentage || 0).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GeoTab({
  stats,
  t,
}: {
  stats: DetailStatsData;
  t: (key: string) => string;
}) {
  const hasData =
    (stats.geography?.countries && stats.geography.countries.length > 0) ||
    (stats.geography?.cities && stats.geography.cities.length > 0);

  if (!hasData) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        {t("stats.noData")}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Countries */}
      {stats.geography?.countries && stats.geography.countries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {t("stats.topCountries")}
          </h3>
          <div className="space-y-2">
            {stats.geography.countries.slice(0, 10).map((c, i) => (
              <div
                key={c.country}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <span>{getCountryFlag(c.country)}</span>
                  <span className="text-sm">{c.country}</span>
                </div>
                <span className="font-semibold text-sm">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cities */}
      {stats.geography?.cities && stats.geography.cities.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            {t("stats.topCities")}
          </h3>
          <div className="space-y-2">
            {stats.geography.cities.slice(0, 10).map((c, i) => (
              <div
                key={c.city}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-4">{i + 1}</span>
                  <span className="text-sm">{c.city}</span>
                </div>
                <span className="font-semibold text-sm">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DeviceTab({
  stats,
  t,
}: {
  stats: DetailStatsData;
  t: (key: string) => string;
}) {
  if (!stats.devices) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        {t("stats.noData")}
      </div>
    );
  }

  const total =
    stats.devices.mobile +
    stats.devices.desktop +
    stats.devices.tablet +
    (stats.devices.bot || 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DeviceCard label="Mobile" count={stats.devices.mobile} total={total} />
        <DeviceCard
          label="Desktop"
          count={stats.devices.desktop}
          total={total}
        />
        <DeviceCard label="Tablet" count={stats.devices.tablet} total={total} />
        <DeviceCard label="Bot" count={stats.devices.bot || 0} total={total} />
      </div>

      {/* Visual breakdown */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
        <div className="h-4 rounded-full overflow-hidden flex">
          {stats.devices.mobile > 0 && (
            <div
              className="bg-blue-500"
              style={{
                width: `${(stats.devices.mobile / total) * 100}%`,
              }}
              title={`Mobile: ${stats.devices.mobile}`}
            />
          )}
          {stats.devices.desktop > 0 && (
            <div
              className="bg-green-500"
              style={{
                width: `${(stats.devices.desktop / total) * 100}%`,
              }}
              title={`Desktop: ${stats.devices.desktop}`}
            />
          )}
          {stats.devices.tablet > 0 && (
            <div
              className="bg-purple-500"
              style={{
                width: `${(stats.devices.tablet / total) * 100}%`,
              }}
              title={`Tablet: ${stats.devices.tablet}`}
            />
          )}
          {stats.devices.bot && stats.devices.bot > 0 && (
            <div
              className="bg-orange-500"
              style={{
                width: `${(stats.devices.bot / total) * 100}%`,
              }}
              title={`Bot: ${stats.devices.bot}`}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Mobile
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Desktop
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" /> Tablet
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" /> Bot
          </span>
        </div>
      </div>
    </div>
  );
}

function DeviceCard({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-center">
      <div className="text-3xl font-bold text-slate-900 dark:text-white">
        {count}
      </div>
      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
        {label}
      </div>
      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
        {percentage.toFixed(1)}%
      </div>
    </div>
  );
}

function LogsTab({
  stats,
  t,
}: {
  stats: DetailStatsData;
  t: (key: string) => string;
}) {
  if (!stats.recent_logs || stats.recent_logs.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 dark:text-slate-400">
        {t("stats.noData")}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Showing {stats.recent_logs.length} recent visits
      </div>
      {stats.recent_logs.map((log, i) => (
        <div
          key={i}
          className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm"
        >
          <div className="flex justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400">
                {log.country || "Unknown"}
              </span>
              {log.city && (
                <span className="text-slate-500 dark:text-slate-500">
                  / {log.city}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
          <div className="flex gap-4 text-xs text-slate-500 dark:text-slate-400">
            {log.device && <span>Device: {log.device}</span>}
            {log.browser && <span>Browser: {log.browser}</span>}
            {log.os && <span>OS: {log.os}</span>}
          </div>
          <div className="text-xs text-slate-400 mt-2 truncate">
            {log.user_agent}
          </div>
        </div>
      ))}
    </div>
  );
}

// Helper functions

function getCountryFlag(countryCode: string): string {
  const code = (countryCode || "").toUpperCase();
  if (code.length !== 2) return countryCode;
  return String.fromCodePoint(
    ...[...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65))
  );
}

function formatTimestamp(timestamp: string): string {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}