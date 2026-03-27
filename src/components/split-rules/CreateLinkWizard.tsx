"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./wizard/WizardProgress";
import { StepBasicInfo } from "./wizard/StepBasicInfo";
import { StepRules } from "./wizard/StepRules";
import { StepPreview } from "./wizard/StepPreview";
import { useDictionaries } from "@/lib/api/use-dictionaries";
import { useQuota } from "@/lib/api/use-quota";
import type { SplitRule, Dimension } from "@/lib/types/split-rules";
import type { DictionaryItem } from "@/lib/api/use-dictionaries";
import type { CreateLinkResponse } from "@/lib/api/use-links";

interface CreateLinkWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    url: string;
    custom?: string;
    expire_days?: number;
    permanent?: boolean;
    split_rules?: SplitRule[];
  }) => Promise<CreateLinkResponse | null>;
  result: CreateLinkResponse | null;
  onReset: () => void;
}

export function CreateLinkWizard({
  open,
  onOpenChange,
  onSubmit,
  result,
  onReset,
}: CreateLinkWizardProps) {
  const t = useTranslations("Links");
  const { data: dictionaries, loading: dictionariesLoading, loadCities } = useDictionaries();
  const { quota } = useQuota();

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [enableSplitRules, setEnableSplitRules] = useState(false);

  // Form state
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expireDays, setExpireDays] = useState(30);
  const [permanent, setPermanent] = useState(false);
  const [rules, setRules] = useState<SplitRule[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine total steps based on enableSplitRules
  const totalSteps = enableSplitRules ? 3 : 2;

  // Get dictionary items for a dimension
  const getDictionaryItems = useCallback(
    (dimension: Dimension): DictionaryItem[] => {
      if (!dictionaries) return [];

      switch (dimension) {
        case "country":
          return dictionaries.countries || [];
        case "device":
          return dictionaries.devices || [];
        case "browser":
          return dictionaries.browsers || [];
        case "os":
          return dictionaries.operatingSystems || [];
        case "bot":
          return dictionaries.bots || [];
        default:
          return [];
      }
    },
    [dictionaries]
  );

  // Navigation handlers
  const handleNext = () => {
    if (currentStep === 1) {
      if (enableSplitRules) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep === 3) {
      if (enableSplitRules) {
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  // Submit handler
  const handleSubmit = async () => {
    if (!url) return;

    setLoading(true);
    try {
      await onSubmit({
        url,
        custom: customCode || undefined,
        expire_days: permanent ? undefined : expireDays,
        permanent,
        split_rules: enableSplitRules && rules.length > 0 ? rules : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = useCallback(() => {
    setCurrentStep(1);
    setEnableSplitRules(false);
    setUrl("");
    setCustomCode("");
    setExpireDays(30);
    setPermanent(false);
    setRules([]);
    setLoading(false);
    onReset();
  }, [onReset]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    onOpenChange(open);
  };

  // Show result view
  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("toast.success")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {t("result.yourLink")}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono">
                  {result.short_url}
                </code>
                <Button
                  onClick={async () => {
                    await navigator.clipboard.writeText(result.short_url);
                  }}
                  variant="outline"
                  size="icon"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                {t("result.qrCode")}
              </p>
              <div className="flex justify-center">
                <img
                  src={`/api/qr/${result.code}?size=256&format=png`}
                  alt="QR Code"
                  className="rounded-lg border border-slate-200 dark:border-slate-700"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              {t("result.createAnother")}
            </Button>
            <Button
              onClick={() => {
                const link = document.createElement("a");
                link.href = `/api/qr/${result.code}?size=512&format=png`;
                link.download = `qr-${result.code}.png`;
                link.click();
              }}
              className="w-full sm:w-auto"
            >
              {t("result.downloadQr")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("modal.createTitle")}</DialogTitle>
        </DialogHeader>

        <WizardProgress currentStep={currentStep} totalSteps={totalSteps} />

        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <StepBasicInfo
              url={url}
              onUrlChange={setUrl}
              customCode={customCode}
              onCustomCodeChange={setCustomCode}
              expireDays={expireDays}
              onExpireDaysChange={setExpireDays}
              permanent={permanent}
              onPermanentChange={setPermanent}
              enableSplitRules={enableSplitRules}
              onEnableSplitRulesChange={(enable) => {
                setEnableSplitRules(enable);
                if (!enable) {
                  setRules([]);
                }
              }}
              permanentQuota={
                quota
                  ? {
                      used: quota.usage.permanent,
                      total: quota.limits.permanentLinks,
                    }
                  : undefined
              }
            />
          )}

          {currentStep === 2 && enableSplitRules && (
            <StepRules
              rules={rules}
              onRulesChange={setRules}
              dimensions={dictionaries?.dimensions || []}
              getDictionaryItems={getDictionaryItems}
              onLoadCities={loadCities}
              disabled={loading}
            />
          )}

          {currentStep === 3 && (
            <StepPreview
              shortUrl={customCode ? `0x1.in/${customCode}` : undefined}
              defaultTargetUrl={url}
              rules={rules}
            />
          )}
        </div>

        <DialogFooter>
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} disabled={loading}>
              {t("wizard.back")}
            </Button>
          )}
          {currentStep < totalSteps ? (
            <Button onClick={handleNext} disabled={!url || loading || dictionariesLoading}>
              {t("wizard.next")}
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!url || loading}>
              {loading ? t("loading") : t("wizard.create")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}