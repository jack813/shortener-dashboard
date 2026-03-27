"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type {
  Operator,
  DimensionDefinition,
} from "@/lib/types/split-rules";
import type { DictionaryItem } from "@/lib/api/use-dictionaries";

interface ValueInputProps {
  value: string | string[] | number;
  onChange: (value: string | string[] | number) => void;
  dimension: DimensionDefinition | undefined;
  operator: Operator | undefined;
  dictionaryItems: DictionaryItem[];
  onLoadCities?: (countryCode: string) => Promise<boolean>;
  disabled?: boolean;
}

export function ValueInput({
  value,
  onChange,
  dimension,
  operator,
  dictionaryItems,
  onLoadCities,
  disabled = false,
}: ValueInputProps) {
  const t = useTranslations("Links.wizard");
  const [inputValue, setInputValue] = useState<string>(
    typeof value === "string" ? value : ""
  );

  useEffect(() => {
    if (typeof value === "string") {
      setInputValue(value);
    }
  }, [value]);

  if (!dimension) {
    return (
      <Input
        placeholder={t("value")}
        disabled
        className="w-full min-w-[150px]"
      />
    );
  }

  const { valueType } = dimension;

  // Handle multi-select for "in" and "not_in" operators
  if (operator === "in" || operator === "not_in") {
    const selectedValues = Array.isArray(value) ? value : [];

    const handleSelect = (itemValue: string) => {
      if (selectedValues.includes(itemValue)) {
        onChange(selectedValues.filter((v) => v !== itemValue));
      } else {
        onChange([...selectedValues, itemValue]);
      }
    };

    const handleRemove = (itemValue: string) => {
      onChange(selectedValues.filter((v) => v !== itemValue));
    };

    const getLabel = (val: string): string => {
      const item = dictionaryItems.find((d) => d.value === val);
      return item?.label || val;
    };

    return (
      <div className="flex flex-col gap-1 min-w-[200px]">
        <Select disabled={disabled}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("value")} />
          </SelectTrigger>
          <SelectContent>
            {dictionaryItems.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                onClick={() => handleSelect(item.value)}
              >
                <div className="flex items-center gap-2">
                  {selectedValues.includes(item.value) && (
                    <span className="text-blue-500">&#10003;</span>
                  )}
                  {item.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedValues.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {selectedValues.map((val) => (
              <span
                key={val}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-full"
              >
                {getLabel(val)}
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemove(val)}
                  disabled={disabled}
                  className="h-4 w-4 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Handle select for dictionary-based dimensions
  if (valueType === "select" || valueType === "multiselect") {
    // Special handling for city - needs to load cities dynamically
    if (dimension.dimension === "city" && onLoadCities) {
      // Note: This would need parent component to track selected country
      // For now, show text input for city
      return (
        <Input
          placeholder={t("value")}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onChange(e.target.value);
          }}
          disabled={disabled}
          className="w-full min-w-[150px]"
        />
      );
    }

    return (
      <Select
        value={typeof value === "string" ? value : ""}
        onValueChange={(v) => {
          if (v) {
            onChange(v as string);
          }
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-full min-w-[150px]">
          <SelectValue placeholder={t("value")} />
        </SelectTrigger>
        <SelectContent>
          {dictionaryItems.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Handle number input for percentage
  if (valueType === "number" || dimension.dimension === "percentage") {
    return (
      <Input
        type="number"
        placeholder={t("value")}
        value={typeof value === "number" ? value : inputValue}
        onChange={(e) => {
          const numValue = parseInt(e.target.value, 10);
          if (dimension.dimension === "percentage") {
            // Clamp percentage between 1 and 100
            const clamped = Math.min(100, Math.max(1, numValue || 1));
            onChange(clamped);
          } else {
            onChange(numValue || 0);
          }
        }}
        min={dimension.dimension === "percentage" ? 1 : undefined}
        max={dimension.dimension === "percentage" ? 100 : undefined}
        disabled={disabled}
        className="w-full min-w-[100px]"
      />
    );
  }

  // Handle datetime input
  if (valueType === "datetime") {
    return (
      <Input
        type="datetime-local"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        disabled={disabled}
        className="w-full min-w-[200px]"
      />
    );
  }

  // Handle cron expression
  if (valueType === "cron") {
    return (
      <Input
        placeholder="0 * * * * (cron expression)"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          onChange(e.target.value);
        }}
        disabled={disabled}
        className="w-full min-w-[200px]"
      />
    );
  }

  // Default text input
  return (
    <Input
      placeholder={t("value")}
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        onChange(e.target.value);
      }}
      disabled={disabled}
      className="w-full min-w-[150px]"
    />
  );
}