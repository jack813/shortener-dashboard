"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Dimension, DimensionDefinition } from "@/lib/types/split-rules";

interface DimensionSelectProps {
  value: Dimension | undefined;
  onChange: (value: Dimension) => void;
  dimensions: DimensionDefinition[];
  disabled?: boolean;
}

export function DimensionSelect({
  value,
  onChange,
  dimensions,
  disabled = false,
}: DimensionSelectProps) {
  const t = useTranslations("Links.wizard");

  return (
    <Select
      value={value || ""}
      onValueChange={(v) => onChange(v as Dimension)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full min-w-[120px]">
        <SelectValue placeholder={t("dimension")} />
      </SelectTrigger>
      <SelectContent>
        {dimensions.map((dim) => (
          <SelectItem key={dim.dimension} value={dim.dimension}>
            {dim.labelEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}