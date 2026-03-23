"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { get } from "@/lib/api/fetcher";

interface StatsData {
  total: number;
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
  }>;
}

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  code: string | null;
}

export function StatsDialog({ open, onOpenChange, code }: StatsDialogProps) {
  const t = useTranslations("Links");
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && code) {
      loadStats();
    }
  }, [open, code]);

  const loadStats = async () => {
    if (!code) return;

    setLoading(true);
    setError(null);

    try {
      const data = await get<StatsData>(`/api/stats/${code}`);
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("stats.loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (!code) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="20" x2="12" y2="10"></line>
              <line x1="18" y1="20" x2="18" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="16"></line>
            </svg>
            {t("stats.title")}
          </DialogTitle>
        </DialogHeader>

        {loading && (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
            {t("loading")}
          </div>
        )}

        {error && (
          <div className="py-8 text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <div className="space-y-6">
            {/* Total Clicks */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total || 0}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {t("stats.totalClicks")}
              </div>
            </div>

            {/* Countries */}
            {stats.geography?.countries && stats.geography.countries.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">{t("stats.topCountries")}</h4>
                <div className="space-y-2">
                  {stats.geography.countries.slice(0, 5).map((c, i) => (
                    <div
                      key={c.country}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
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
                <h4 className="text-sm font-semibold mb-2">{t("stats.topCities")}</h4>
                <div className="space-y-2">
                  {stats.geography.cities.slice(0, 5).map((c, i) => (
                    <div
                      key={c.city}
                      className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
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

            {/* Devices */}
            {stats.devices && (
              <div>
                <h4 className="text-sm font-semibold mb-2">{t("stats.deviceBreakdown")}</h4>
                <div className="grid grid-cols-4 gap-2">
                  <DeviceStat label="Mobile" count={stats.devices.mobile} />
                  <DeviceStat label="Desktop" count={stats.devices.desktop} />
                  <DeviceStat label="Tablet" count={stats.devices.tablet} />
                  <DeviceStat label="Bot" count={stats.devices.bot || 0} />
                </div>
              </div>
            )}

            {/* Recent Logs */}
            {stats.recent_logs && stats.recent_logs.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">{t("stats.recentLogs")}</h4>
                <div className="space-y-2">
                  {stats.recent_logs.slice(0, 10).map((log, i) => (
                    <div key={i} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-slate-500">{log.country || "Unknown"}</span>
                        <span className="text-xs text-slate-400">{formatTimestamp(log.timestamp)}</span>
                      </div>
                      <div className="text-xs text-slate-400 truncate">{log.user_agent}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!stats.geography?.countries?.length &&
              !stats.geography?.cities?.length &&
              !stats.recent_logs?.length && (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400">
                  {t("stats.noData")}
                </div>
              )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeviceStat({ label, count }: { label: string; count: number }) {
  return (
    <div className="text-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
      <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{count}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function getCountryFlag(countryCode: string): string {
  const code = (countryCode || "").toUpperCase();
  if (code.length !== 2) return countryCode;
  return String.fromCodePoint(...[...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65)));
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