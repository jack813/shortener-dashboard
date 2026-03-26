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

interface RenameApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: ApiKey | null;
  onSubmit: (id: string, name: string) => Promise<boolean>;
}

export function RenameApiKeyDialog({
  open,
  onOpenChange,
  apiKey,
  onSubmit,
}: RenameApiKeyDialogProps) {
  const t = useTranslations("API");
  const [name, setName] = useState(apiKey?.name || "");
  const [loading, setLoading] = useState(false);

  // Update name when apiKey changes
  useState(() => {
    if (apiKey) {
      setName(apiKey.name || "");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;

    setLoading(true);
    try {
      const success = await onSubmit(apiKey.id, name);
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && apiKey) {
      setName(apiKey.name || "");
    }
    onOpenChange(open);
  };

  if (!apiKey) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modal.renameTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="renameName">{t("form.newNameLabel")}</Label>
            <Input
              id="renameName"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("button.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("table.loading") : t("button.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}