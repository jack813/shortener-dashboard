"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { useApiKeys, ApiKey, CreateApiKeyResponse } from "@/lib/api/use-api-keys";
import { ApiKeysTable } from "@/components/api-keys/api-keys-table";
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog";
import { RenameApiKeyDialog } from "@/components/api-keys/rename-api-key-dialog";
import { RevokeApiKeyDialog } from "@/components/api-keys/revoke-api-key-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function APIPage() {
  const t = useTranslations("API");
  const { keys, loading, createKey, renameKey, revokeKey } = useApiKeys();

  // Dialog states
  const [createOpen, setCreateOpen] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [revokeOpen, setRevokeOpen] = useState(false);

  // Selected items
  const [renameKeyData, setRenameKeyData] = useState<ApiKey | null>(null);
  const [revokeKeyData, setRevokeKeyData] = useState<ApiKey | null>(null);
  const [createResult, setCreateResult] = useState<CreateApiKeyResponse | null>(null);

  // Handlers
  const handleCreate = useCallback(
    async (name: string): Promise<CreateApiKeyResponse | null> => {
      try {
        const result = await createKey(name);
        setCreateResult(result);
        toast.success(t("toast.createSuccess"));
        return result;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.createFailed"));
        return null;
      }
    },
    [createKey, t]
  );

  const handleRename = useCallback(
    async (id: string, name: string): Promise<boolean> => {
      try {
        await renameKey(id, name);
        toast.success(t("toast.renameSuccess"));
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.renameFailed"));
        return false;
      }
    },
    [renameKey, t]
  );

  const handleRevoke = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await revokeKey(id);
        toast.success(t("toast.revokeSuccess"));
        return true;
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("toast.revokeFailed"));
        return false;
      }
    },
    [revokeKey, t]
  );

  const openRenameDialog = useCallback((key: ApiKey) => {
    setRenameKeyData(key);
    setRenameOpen(true);
  }, []);

  const openRevokeDialog = useCallback((key: ApiKey) => {
    setRevokeKeyData(key);
    setRevokeOpen(true);
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
          {t("createButton")}
        </Button>
      </div>

      {/* Table */}
      <ApiKeysTable
        keys={keys}
        loading={loading}
        onRename={openRenameDialog}
        onRevoke={openRevokeDialog}
      />

      {/* Dialogs */}
      <CreateApiKeyDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        result={createResult}
        onReset={() => setCreateResult(null)}
      />

      <RenameApiKeyDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        apiKey={renameKeyData}
        onSubmit={handleRename}
      />

      <RevokeApiKeyDialog
        open={revokeOpen}
        onOpenChange={setRevokeOpen}
        apiKey={revokeKeyData}
        onSubmit={handleRevoke}
      />
    </div>
  );
}