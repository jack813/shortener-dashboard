"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { useTraffic } from "@/lib/api/use-traffic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, ArrowRight } from "lucide-react";

export function TrafficCard() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const { traffic, loading, percentage } = useTraffic();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="h-5 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!traffic) {
    return null;
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  // Determine color based on usage
  const getProgressColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-orange-500";
    return "bg-blue-500";
  };

  return (
    <Card className="cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors" onClick={() => router.push("/links")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Flame className="size-4 text-orange-500" />
          {t("trafficTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Main number */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatNumber(traffic.used)}
            </span>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              / {formatNumber(traffic.limit)} {t("trafficUnit")}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              {t("trafficRemaining")}: {formatNumber(traffic.remaining)} ({100 - percentage}%)
            </span>
            <span>
              {t("trafficReset")}: {formatDate(traffic.resetAt)}
            </span>
          </div>

          {/* View details link */}
          <div className="flex items-center justify-end text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
            {t("viewDetails")}
            <ArrowRight className="ml-1 size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}