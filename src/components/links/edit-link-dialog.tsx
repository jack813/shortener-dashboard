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
import { Link } from "@/lib/api/use-links";

interface EditLinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: Link | null;
  onSubmit: (code: string, data: { url?: string; expire_days?: number; permanent?: boolean }) => Promise<boolean>;
}

export function EditLinkDialog({ open, onOpenChange, link, onSubmit }: EditLinkDialogProps) {
  const t = useTranslations("Links");
  const [url, setUrl] = useState(link?.url || "");
  const [expireDays, setExpireDays] = useState(link?.expire_days?.toString() || "30");
  const [permanent, setPermanent] = useState(link?.is_permanent === 1);
  const [loading, setLoading] = useState(false);

  // Update state when link changes
  useState(() => {
    if (link) {
      setUrl(link.url);
      setExpireDays(link.expire_days?.toString() || "30");
      setPermanent(link.is_permanent === 1);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link || !url) return;

    setLoading(true);
    try {
      const success = await onSubmit(link.code, {
        url: url !== link.url ? url : undefined,
        expire_days: permanent ? undefined : parseInt(expireDays) || 30,
        permanent,
      });
      if (success) {
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Reset form
      if (link) {
        setUrl(link.url);
        setExpireDays(link.expire_days?.toString() || "30");
        setPermanent(link.is_permanent === 1);
      }
    }
    onOpenChange(open);
  };

  if (!link) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("modal.editTitle")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Code</Label>
            <code className="block p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono">
              {link.code}
            </code>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-url">
              {t("form.targetUrl")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-url"
              type="url"
              placeholder={t("form.urlPlaceholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-expireDays">{t("form.expireDays")}</Label>
            <Input
              id="edit-expireDays"
              type="number"
              min={1}
              max={365}
              value={expireDays}
              onChange={(e) => setExpireDays(e.target.value)}
              disabled={permanent}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-permanent"
              checked={permanent}
              onCheckedChange={(checked) => setPermanent(checked === true)}
            />
            <label
              htmlFor="edit-permanent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t("form.permanent")}
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("button.cancel")}
            </Button>
            <Button type="submit" disabled={!url || loading}>
              {loading ? t("loading") : t("button.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}