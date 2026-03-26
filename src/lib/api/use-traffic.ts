"use client";

import { useState, useEffect, useCallback } from "react";
import { get, getSessionToken } from "./fetcher";

export interface TrafficOverview {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
  resetAt: string;
}

export interface LinkTraffic {
  code: string;
  url: string;
  traffic: number;
}

export interface TrafficLinksResponse {
  used: number;
  limit: number;
  remaining: number;
  plan: string;
  resetAt: string;
  links: LinkTraffic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useTraffic() {
  const [traffic, setTraffic] = useState<TrafficOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTraffic = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const response = await get<TrafficOverview>("/api/traffic", token || undefined);
      setTraffic(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load traffic");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTraffic();
  }, [loadTraffic]);

  return {
    traffic,
    loading,
    error,
    loadTraffic,
    percentage: traffic ? Math.round((traffic.used / traffic.limit) * 100) : 0,
  };
}

export function useTrafficLinks(page: number = 1, limit: number = 50) {
  const [data, setData] = useState<TrafficLinksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const response = await get<TrafficLinksResponse>(
        `/api/traffic/links?page=${page}&limit=${limit}`,
        token || undefined
      );
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load traffic links");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  return {
    data,
    loading,
    error,
    loadLinks,
  };
}