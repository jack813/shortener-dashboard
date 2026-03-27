"use client";

import { useState, useCallback, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useLinks, Link, CreateLinkResponse } from "@/lib/api/use-links";
import { useTrafficLinks } from "@/lib/api/use-traffic";
import { LinksTable } from "@/components/links/links-table";
import { CreateLinkWizard } from "@/components/split-rules/CreateLinkWizard";
import { EditLinkDialog } from "@/components/links/edit-link-dialog";
import { StatsDialog } from "@/components/links/stats-dialog";
import { QrDialog } from "@/components/links/qr-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LinksPage() {
  const t = useTranslations("Links");
  const { links, loading, createLink, updateLink, deleteLink } = useLinks();
  const { data: trafficResponse } = useTrafficLinks(1, 100);

  // Build traffic data map
  const trafficData = useMemo(() => {
    const map = new Map<string, number>();
    if (trafficResponse?.links) {
      for (const link of trafficResponse.links) {
        map.set(link.code, link.traffic);
      }
    }
    return map;
  }, [trafficResponse]);

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  // Selected items
  const [editLink, setEditLink] = useState<Link | null>(null);
  const [statsCode, setStatsCode] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [createResult, setCreateResult] = useState<CreateLinkResponse | null>(null);

  // Handlers
  const handleCreate = useCallback(
    async (data: {
      url: string;
      custom?: string;
      expire_days?: number;
      permanent?: boolean;
      split_rules?: Array<{
        id: string;
        name: string;
        priority: number;
        targetUrl: string;
        isActive: boolean;
        conditions: Array<{
          dimension: string;
          operator: string;
          value: string | string[] | number;
        }>;
      }>;
    }): Promise<CreateLinkResponse | null> => {
      try {
        const result = await createLink(data);
        setCreateResult(result);
        toast.success(t("toast.success"));
        return result;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.error"));
        return null;
      }
    },
    [createLink, t]
  );

  const handleEdit = useCallback(
    async (
      code: string,
      data: { url?: string; expire_days?: number; permanent?: boolean }
    ): Promise<boolean> => {
      try {
        await updateLink(code, data);
        toast.success(t("toast.updateSuccess"));
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.error"));
        return false;
      }
    },
    [updateLink, t]
  );

  const handleDelete = useCallback(
    async (code: string) => {
      if (!confirm(t("confirm.delete", { code }))) {
        return;
      }

      try {
        await deleteLink(code);
        toast.success(t("toast.deleteSuccess"));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.error"));
      }
    },
    [deleteLink, t]
  );

  const openEditDialog = useCallback((link: Link) => {
    setEditLink(link);
    setEditOpen(true);
  }, []);

  const openStatsDialog = useCallback((code: string) => {
    setStatsCode(code);
    setStatsOpen(true);
  }, []);

  const openQrDialog = useCallback((code: string) => {
    setQrCode(code);
    setQrOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="size-4 mr-2" />
          {t("createLink")}
        </Button>
      </div>

      {/* Table */}
      <LinksTable
        links={links}
        loading={loading}
        trafficData={trafficData}
        onViewStats={openStatsDialog}
        onShowQr={openQrDialog}
        onEdit={openEditDialog}
        onDelete={handleDelete}
      />

      {/* Dialogs */}
      <CreateLinkWizard
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        result={createResult}
        onReset={() => setCreateResult(null)}
      />

      <EditLinkDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        link={editLink}
        onSubmit={handleEdit}
      />

      <StatsDialog
        open={statsOpen}
        onOpenChange={setStatsOpen}
        code={statsCode}
      />

      <QrDialog open={qrOpen} onOpenChange={setQrOpen} code={qrCode} />
    </div>
  );
}