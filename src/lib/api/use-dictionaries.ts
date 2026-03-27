"use client";

import { useState, useEffect, useCallback } from "react";
import { get, getSessionToken } from "./fetcher";
import type { DimensionDefinition } from "@/lib/types/split-rules";

export interface DictionaryItem {
  value: string;
  label: string;
  labelZh?: string;
}

export interface Dictionaries {
  countries: DictionaryItem[];
  devices: DictionaryItem[];
  browsers: DictionaryItem[];
  operatingSystems: DictionaryItem[];
  bots: DictionaryItem[];
  dimensions: DimensionDefinition[];
  operators: { value: string; label: string }[];
}

export function useDictionaries() {
  const [data, setData] = useState<Dictionaries | null>(null);
  const [cities, setCities] = useState<DictionaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDictionaries = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = getSessionToken();
      const result = await get<Dictionaries>("/api/dictionaries", token || undefined);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dictionaries");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDictionaries();
  }, [loadDictionaries]);

  const loadCities = useCallback(async (countryCode: string) => {
    try {
      const token = getSessionToken();
      const result = await get<{ cities: DictionaryItem[] }>(
        `/api/dictionaries?country=${countryCode}`,
        token || undefined
      );
      setCities(result.cities || []);
    } catch (err) {
      console.error("Failed to load cities:", err);
    }
  }, []);

  return { data, cities, loading, error, loadCities, loadDictionaries };
}