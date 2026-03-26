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
import { ApiKey } from "@/lib/api/use-api-keys";

interface RevokeApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: ApiKey | null;
  onSubmit: (id: string) => Promise<boolean>;
}

export function RevokeApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
  onSubmit,
}: RevokeApiKeyDialogProps) {
  const t = useTranslations("API");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    if (confirmText !== "revoke") {
      setError(t("toast.enterRevoke"));
      return;
    }

    setLoading(true);
    try {
      const success = await onSubmit(apiKey.id);
      if (success) {
        setConfirmText("");
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setConfirmText("");
      setError(null);
    }
    onOpenChange(open);
  };

  if (!apiKey) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-500">
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            {t("modal.revokeTitle")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-800 dark:text-red-200">
              {t("warning.revokeWarning")}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="revokeConfirm">{t("warning.revokeConfirmLabel")}</Label>
            <Input
              id="revokeConfirm"
              value={confirmText}
              onChange={(e) => {
                setConfirmText(e.target.value);
                setError(null);
              }}
              placeholder="revoke"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("button.cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? t("table.loading") : t("button.confirmRevoke")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}