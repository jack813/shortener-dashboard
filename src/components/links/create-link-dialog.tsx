"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuota } from "@/lib/api/use-quota";
import { CreateLinkResponse } from "@/lib/api/use-links";

interface CreateLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    url: string;
    custom?: string;
    expire_days?: number;
    permanent?: boolean;
  }) => Promise<CreateLinkResponse | null>;
  result: CreateLinkResponse | null;
  onReset: () => void;
}

export function CreateLinkDialog({
  open,
  onOpenChange,
  onSubmit,
  result,
  onReset,
}: CreateLinkDialogProps) {
  const t = useTranslations("Links");
  const { quota } = useQuota();
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expireDays, setExpireDays] = useState("30");
  const [permanent, setPermanent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      await onSubmit({
        url,
        custom: customCode || undefined,
        expire_days: permanent ? undefined : parseInt(expireDays) || 30,
        permanent,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.short_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setUrl("");
    setCustomCode("");
    setExpireDays("30");
    setPermanent(false);
    onReset();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    onOpenChange(open);
  };

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
                <Button onClick={handleCopy} variant="outline" size="icon">
                  {copied ? (
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
                      className="text-green-500"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  ) : (
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
                  )}
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modal.createTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">
              {t("form.targetUrl")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="url"
              type="url"
              placeholder={t("form.urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customCode">{t("form.customCode")}</Label>
              <Input
                id="customCode"
                placeholder={t("form.codePlaceholder")}
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                pattern="[a-zA-Z0-9_-]+"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("form.codeHint")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expireDays">{t("form.expireDays")}</Label>
              <Input
                id="expireDays"
                type="number"
                min={1}
                max={365}
                value={expireDays}
                onChange={(e) => setExpireDays(e.target.value)}
                disabled={permanent}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="permanent"
              checked={permanent}
              onCheckedChange={(checked) => setPermanent(checked === true)}
            />
            <label
              htmlFor="permanent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("form.permanent")}
              {quota && (
                <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                  ({t("form.thisMonth")} {t("form.available")}: {quota.usage.permanent}/{quota.limits.permanentLinks})
                </span>
              )}
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("button.cancel")}
            </Button>
            <Button type="submit" disabled={!url || loading}>
              {loading ? t("loading") : t("button.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}