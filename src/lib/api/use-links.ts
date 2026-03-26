"use client";

import { useState, useEffect, useCallback } from "react";
import { get, post, patch, del, getSessionToken } from "./fetcher";

export interface Link {
  code: string;
  url: string;
  is_custom: number;
  is_permanent: number;
  is_revoked: number;
  clicks: number;
  created_at: string;
  expire_days?: number;
  api_key_id?: string;
}

export interface LinksResponse {
  links: Link[];
}

export interface CreateLinkRequest {
  url: string;
  custom?: string;
  expire_days?: number;
  permanent?: boolean;
}

export interface CreateLinkResponse {
  code: string;
  short_url: string;
}

export interface UpdateLinkRequest {
  url?: string;
  expire_days?: number;
  permanent?: boolean;
}

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLinks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const response = await get<LinksResponse>("/api/links", token || undefined);
      setLinks(response.links || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  const createLink = useCallback(async (data: CreateLinkRequest): Promise<CreateLinkResponse> => {
    const token = getSessionToken();
    const response = await post<CreateLinkResponse>("/api/create", data, token || undefined);
    // Reload links after creation
    await loadLinks();
    return response;
  }, [loadLinks]);

  const updateLink = useCallback(async (code: string, data: UpdateLinkRequest): Promise<void> => {
    const token = getSessionToken();
    await patch(`/api/links/${code}`, data, token || undefined);
    await loadLinks();
  }, [loadLinks]);

  const deleteLink = useCallback(async (code: string): Promise<void> => {
    const token = getSessionToken();
    await del(`/api/links/${code}`, token || undefined);
    await loadLinks();
  }, [loadLinks]);

  return {
    links,
    loading,
    error,
    loadLinks,
    createLink,
    updateLink,
    deleteLink,
  };
}