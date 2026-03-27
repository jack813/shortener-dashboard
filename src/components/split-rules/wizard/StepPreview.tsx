"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import type { SplitRule } from "@/lib/types/split-rules";

interface StepPreviewProps {
  shortUrl?: string;
  defaultTargetUrl: string;
  rules: SplitRule[];
}

export function StepPreview({
  shortUrl,
  defaultTargetUrl,
  rules,
}: StepPreviewProps) {
  const t = useTranslations("Links");

  const activeRules = rules.filter((rule) => rule.isActive);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("wizard.step3Title")}</h3>

      {/* Short Link Preview */}
      {shortUrl && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("shortUrl")}</Label>
          <div className="flex items-center gap-2">
            <code className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono">
              {shortUrl}
            </code>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Default Target URL */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("destination")}</Label>
        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-sm break-all">{defaultTargetUrl}</p>
        </div>
      </div>

      {/* Rules Summary */}
      {activeRules.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            {t("wizard.rulesSummary", { count: activeRules.length })}
          </Label>
          <div className="space-y-2">
            {activeRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{rule.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {t("wizard.priority")}: {rule.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                  {rule.targetUrl}
                </p>
                {rule.conditions.length > 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {rule.conditions.length} {t("wizard.addCondition").toLowerCase()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Rules Message */}
      {activeRules.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>{t("wizard.noConditions")}</p>
        </div>
      )}
    </div>
  );
}

function Label({ className, children }: { className?: string; children: React.ReactNode }) {
  return <label className={className}>{children}</label>;
}