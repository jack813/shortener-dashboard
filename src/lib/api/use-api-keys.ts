"use client";

import { useState, useEffect, useCallback } from "react";
import { get, post, patch, del, getSessionToken } from "./fetcher";

export interface ApiKey {
  id: string;
  name: string;
  key_prefix?: string;
  is_revoked: number;
  link_count: number;
  created_at: string;
}

export interface ApiKeysResponse {
  keys: ApiKey[];
}

export interface CreateApiKeyRequest {
  name: string;
}

export interface CreateApiKeyResponse {
  id: string;
  name: string;
  apiKey: string;
}

export interface RenameApiKeyRequest {
  name: string;
}

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadKeys = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const response = await get<ApiKeysResponse>("/api/keys", token || undefined);
      setKeys(response.keys || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadKeys();
  }, [loadKeys]);

  const createKey = useCallback(async (name: string): Promise<CreateApiKeyResponse> => {
    const token = getSessionToken();
    const response = await post<CreateApiKeyResponse>(
      "/api/keys",
      { name },
      token || undefined
    );
    await loadKeys();
    return response;
  }, [loadKeys]);

  const renameKey = useCallback(async (id: string, name: string): Promise<void> => {
    const token = getSessionToken();
    await patch(`/api/keys/${id}`, { name }, token || undefined);
    await loadKeys();
  }, [loadKeys]);

  const revokeKey = useCallback(async (id: string): Promise<void> => {
    const token = getSessionToken();
    await del(`/api/keys/${id}`, token || undefined);
    await loadKeys();
  }, [loadKeys]);

  return {
    keys,
    loading,
    error,
    loadKeys,
    createKey,
    renameKey,
    revokeKey,
  };
}