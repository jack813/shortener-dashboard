"use client";

import { useTranslations } from "next-intl";
import type { RuleStats } from "@/lib/types/split-rules";

// Array of colors for the stacked bar chart and legend
const COLORS = [
  "#3b82f6", // blue-500
  "#22c55e", // green-500
  "#a855f7", // purple-500
  "#f97316", // orange-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f59e0b", // amber-500
  "#f43f5e", // rose-500
];

interface RulesDistributionProps {
  rules: RuleStats[];
  noRuleMatched: number;
  noRulePercentage: number;
}

export function RulesDistribution({
  rules,
  noRuleMatched,
  noRulePercentage,
}: RulesDistributionProps) {
  const t = useTranslations("Links.stats");

  if (!rules || rules.length === 0) {
    return null;
  }

  // Calculate total for percentage verification
  const totalRulesCount = rules.reduce((sum, r) => sum + r.count, 0);
  const totalCount = totalRulesCount + noRuleMatched;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-semibold">{t("rulesDistribution")}</h4>

      {/* Stacked Bar Chart */}
      <div className="space-y-2">
        <div className="h-6 w-full rounded-lg overflow-hidden flex bg-slate-100 dark:bg-slate-800">
          {rules.map((rule, index) => {
            const colorIndex = index % COLORS.length;
            return (
              <div
                key={rule.ruleId}
                className="h-full transition-all hover:opacity-80"
                style={{
                  width: `${rule.percentage}%`,
                  backgroundColor: COLORS[colorIndex],
                }}
                title={`${rule.ruleName}: ${rule.count} (${rule.percentage.toFixed(1)}%)`}
              />
            );
          })}
          {/* No rule matched segment */}
          {noRuleMatched > 0 && (
            <div
              className="h-full bg-slate-300 dark:bg-slate-600"
              style={{ width: `${noRulePercentage}%` }}
              title={`No rule matched: ${noRuleMatched} (${noRulePercentage.toFixed(1)}%)`}
            />
          )}
        </div>

        {/* Total count */}
        <div className="text-xs text-slate-500 dark:text-slate-400 text-right">
          {t("totalVisits")}: {totalCount}
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {rules.map((rule, index) => {
          const colorIndex = index % COLORS.length;
          return (
            <div
              key={rule.ruleId}
              className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[colorIndex] }}
                />
                <span className="text-sm truncate max-w-[150px]" title={rule.ruleName}>
                  {rule.ruleName}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold">{rule.count}</span>
                <span className="text-slate-500 dark:text-slate-400 w-12 text-right">
                  {rule.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}

        {/* No rule matched */}
        {noRuleMatched > 0 && (
          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
              <span className="text-sm">{t("defaultRedirect")}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="font-semibold">{noRuleMatched}</span>
              <span className="text-slate-500 dark:text-slate-400 w-12 text-right">
                {noRulePercentage.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}