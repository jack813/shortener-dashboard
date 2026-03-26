"use client";

import { useState, useEffect, useCallback } from "react";
import { get, getSessionToken } from "./fetcher";

export interface QuotaLimits {
  monthlyLinks: number;
  customLinks: number;
  permanentLinks: number;
}

export interface QuotaUsage {
  monthly: number;
  custom: number;
  permanent: number;
}

export interface QuotaResponse {
  plan: string;
  limits: QuotaLimits;
  usage: QuotaUsage;
}

export function useQuota() {
  const [quota, setQuota] = useState<QuotaResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuota = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const response = await get<QuotaResponse>("/api/quota", token || undefined);
      setQuota(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load quota");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuota();
  }, [loadQuota]);

  return {
    quota,
    loading,
    error,
    loadQuota,
    isPro: quota?.plan === "pro",
  };
}