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
import { CreateApiKeyResponse } from "@/lib/api/use-api-keys";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (name: string) => Promise<CreateApiKeyResponse | null>;
  result: CreateApiKeyResponse | null;
  onReset: () => void;
}

export function CreateApiKeyDialog({
  open,
  onOpenChange,
  onSubmit,
  result,
  onReset,
}: CreateApiKeyDialogProps) {
  const t = useTranslations("API");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(name || `API Key ${new Date().toLocaleDateString()}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.apiKey) {
      await navigator.clipboard.writeText(result.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setName("");
      onReset();
    }
    onOpenChange(open);
  };

  // Show result dialog after creation
  if (result) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-500">
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
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" x2="12" y1="9" y2="13" />
                <line x1="12" x2="12.01" y1="17" y2="17" />
              </svg>
              {t("modal.copyTitle")}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>{t("warning.importantHint")}</strong>
                {t("warning.keyWarning")}
              </p>
            </div>
            <div>
              <Label>{t("button.yourKey", { defaultValue: "Your API Key" })}</Label>
              <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm break-all">
                {result.apiKey}
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handleCopy} className="w-full sm:w-auto">
              {copied ? t("toast.copied") : t("button.copyToClipboard")}
            </Button>
            <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
              {t("button.gotIt")}
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
            <Label htmlFor="keyName">{t("form.nameLabel")}</Label>
            <Input
              id="keyName"
              placeholder="My API Key"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? t("table.loading") : t("button.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}