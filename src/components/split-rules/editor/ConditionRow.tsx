"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { DimensionSelect } from "./DimensionSelect";
import { OperatorSelect } from "./OperatorSelect";
import { ValueInput } from "./ValueInput";
import type {
  Condition,
  Dimension,
  Operator,
  DimensionDefinition,
} from "@/lib/types/split-rules";
import type { DictionaryItem } from "@/lib/api/use-dictionaries";

interface ConditionRowProps {
  condition: Condition;
  onChange: (condition: Condition) => void;
  onRemove: () => void;
  dimensions: DimensionDefinition[];
  getDictionaryItems: (dimension: Dimension) => DictionaryItem[];
  onLoadCities?: (countryCode: string) => Promise<boolean>;
  disabled?: boolean;
}

export function ConditionRow({
  condition,
  onChange,
  onRemove,
  dimensions,
  getDictionaryItems,
  onLoadCities,
  disabled = false,
}: ConditionRowProps) {
  const t = useTranslations("Links.wizard");

  const selectedDimension = dimensions.find(
    (d) => d.dimension === condition.dimension
  );

  const handleDimensionChange = (dimension: Dimension) => {
    const newDimension = dimensions.find((d) => d.dimension === dimension);
    // Reset operator and value when dimension changes
    const defaultOperator = newDimension?.operators[0] || "=";
    let defaultValue: string | string[] | number = "";

    // Set appropriate default value based on dimension type
    if (dimension === "percentage") {
      defaultValue = 50;
    } else if (newDimension?.valueType === "select") {
      const items = getDictionaryItems(dimension);
      defaultValue = items[0]?.value || "";
    }

    onChange({
      dimension,
      operator: defaultOperator,
      value: defaultValue,
    });
  };

  const handleOperatorChange = (operator: Operator) => {
    // Reset value if operator type changes between single and multi-value
    let newValue = condition.value;
    const isMultiOperator = operator === "in" || operator === "not_in";
    const wasMultiOperator =
      condition.operator === "in" || condition.operator === "not_in";

    if (isMultiOperator && !wasMultiOperator) {
      // Convert single value to array
      newValue =
        typeof condition.value === "string" ? [condition.value] : condition.value;
    } else if (!isMultiOperator && wasMultiOperator) {
      // Convert array to single value
      newValue = Array.isArray(condition.value)
        ? condition.value[0] || ""
        : condition.value;
    }

    onChange({
      ...condition,
      operator,
      value: newValue,
    });
  };

  const handleValueChange = (value: string | string[] | number) => {
    onChange({
      ...condition,
      value,
    });
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
      <DimensionSelect
        value={condition.dimension}
        onChange={handleDimensionChange}
        dimensions={dimensions}
        disabled={disabled}
      />
      <OperatorSelect
        value={condition.operator}
        onChange={handleOperatorChange}
        dimension={selectedDimension}
        disabled={disabled}
      />
      <ValueInput
        value={condition.value}
        onChange={handleValueChange}
        dimension={selectedDimension}
        operator={condition.operator}
        dictionaryItems={getDictionaryItems(condition.dimension)}
        onLoadCities={onLoadCities}
        disabled={disabled}
      />
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onRemove}
        disabled={disabled}
        title={t("removeCondition")}
        className="shrink-0"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );
}