"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Operator, DimensionDefinition } from "@/lib/types/split-rules";

interface OperatorSelectProps {
  value: Operator | undefined;
  onChange: (value: Operator) => void;
  dimension: DimensionDefinition | undefined;
  disabled?: boolean;
}

const operatorLabels: Record<Operator, string> = {
  "=": "Equals",
  "!=": "Not Equals",
  in: "In",
  not_in: "Not In",
  contains: "Contains",
  not_contains: "Not Contains",
  prefix: "Prefix",
  regex: "Regex",
  "<": "Less Than",
  "<=": "Less Than or Equal",
  ">": "Greater Than",
  ">=": "Greater Than or Equal",
};

export function OperatorSelect({
  value,
  onChange,
  dimension,
  disabled = false,
}: OperatorSelectProps) {
  const t = useTranslations("Links.wizard");

  const availableOperators = dimension?.operators || [];

  return (
    <Select
      value={value || ""}
      onValueChange={(v) => onChange(v as Operator)}
      disabled={disabled || !dimension}
    >
      <SelectTrigger className="w-full min-w-[120px]">
        <SelectValue placeholder={t("operator")} />
      </SelectTrigger>
      <SelectContent>
        {availableOperators.map((op) => (
          <SelectItem key={op} value={op}>
            {operatorLabels[op]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}