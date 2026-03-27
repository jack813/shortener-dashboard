"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StepBasicInfoProps {
  url: string;
  onUrlChange: (url: string) => void;
  customCode: string;
  onCustomCodeChange: (code: string) => void;
  expireDays: number;
  onExpireDaysChange: (days: number) => void;
  permanent: boolean;
  onPermanentChange: (permanent: boolean) => void;
  enableSplitRules: boolean;
  onEnableSplitRulesChange: (enable: boolean) => void;
  permanentQuota?: { used: number; total: number };
}

export function StepBasicInfo({
  url,
  onUrlChange,
  customCode,
  onCustomCodeChange,
  expireDays,
  onExpireDaysChange,
  permanent,
  onPermanentChange,
  enableSplitRules,
  onEnableSplitRulesChange,
  permanentQuota,
}: StepBasicInfoProps) {
  const t = useTranslations("Links");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">{t("wizard.step1Title")}</h3>

      <div className="space-y-2">
        <Label htmlFor="url">
          {t("form.targetUrl")} <span className="text-red-500">*</span>
        </Label>
        <Input
          id="url"
          type="url"
          placeholder={t("form.urlPlaceholder")}
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="customCode">{t("form.customCode")}</Label>
        <Input
          id="customCode"
          placeholder={t("form.codePlaceholder")}
          value={customCode}
          onChange={(e) => onCustomCodeChange(e.target.value)}
          pattern="[a-zA-Z0-9_-]+"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {t("form.codeHint")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expireDays">{t("form.expireDays")}</Label>
        <Select
          value={String(expireDays)}
          onValueChange={(value) => onExpireDaysChange(parseInt(value || "30"))}
          disabled={permanent}
        >
          <SelectTrigger id="expireDays" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 {t("form.expireDays").toLowerCase()}</SelectItem>
            <SelectItem value="30">30 {t("form.expireDays").toLowerCase()}</SelectItem>
            <SelectItem value="90">90 {t("form.expireDays").toLowerCase()}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="permanent"
          checked={permanent}
          onCheckedChange={(checked) => onPermanentChange(checked === true)}
        />
        <label
          htmlFor="permanent"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("form.permanent")}
          {permanentQuota && (
            <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
              ({t("form.thisMonth")} {t("form.available")}: {permanentQuota.used}/{permanentQuota.total})
            </span>
          )}
        </label>
      </div>

      <div className="flex items-center space-x-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <Checkbox
          id="enableSplitRules"
          checked={enableSplitRules}
          onCheckedChange={(checked) => onEnableSplitRulesChange(checked === true)}
        />
        <label
          htmlFor="enableSplitRules"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("wizard.enableSplitRules")}
        </label>
      </div>
    </div>
  );
}