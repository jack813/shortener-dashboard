"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ConditionRow } from "./ConditionRow";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import type {
  SplitRule,
  Condition,
  DimensionDefinition,
  Dimension,
} from "@/lib/types/split-rules";
import type { DictionaryItem } from "@/lib/api/use-dictionaries";

// Array of colors for the left border
const RULE_COLORS = [
  "border-l-blue-500",
  "border-l-green-500",
  "border-l-purple-500",
  "border-l-orange-500",
  "border-l-pink-500",
  "border-l-cyan-500",
  "border-l-amber-500",
  "border-l-rose-500",
];

interface RuleCardProps {
  rule: SplitRule;
  onChange: (rule: SplitRule) => void;
  onRemove: () => void;
  dimensions: DimensionDefinition[];
  getDictionaryItems: (dimension: Dimension) => DictionaryItem[];
  onLoadCities?: (countryCode: string) => Promise<boolean>;
  disabled?: boolean;
  isDragging?: boolean;
}

export function RuleCard({
  rule,
  onChange,
  onRemove,
  dimensions,
  getDictionaryItems,
  onLoadCities,
  disabled = false,
  isDragging,
}: RuleCardProps) {
  const t = useTranslations("Links.wizard");
  const [isExpanded, setIsExpanded] = useState(true);

  const borderColor = RULE_COLORS[parseInt(rule.id.replace(/\D/g, "")) % RULE_COLORS.length];

  const handleNameChange = (name: string) => {
    onChange({ ...rule, name });
  };

  const handleActiveToggle = (isActive: boolean) => {
    onChange({ ...rule, isActive });
  };

  const handleTargetUrlChange = (targetUrl: string) => {
    onChange({ ...rule, targetUrl });
  };

  const handleConditionChange = (index: number, condition: Condition) => {
    const newConditions = [...rule.conditions];
    newConditions[index] = condition;
    onChange({ ...rule, conditions: newConditions });
  };

  const handleAddCondition = () => {
    const newCondition: Condition = {
      dimension: "country",
      operator: "=",
      value: "",
    };
    onChange({ ...rule, conditions: [...rule.conditions, newCondition] });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = rule.conditions.filter((_, i) => i !== index);
    onChange({ ...rule, conditions: newConditions });
  };

  return (
    <div
      className={`rounded-lg border border-l-4 bg-card shadow-sm transition-all ${
        !rule.isActive ? "opacity-60" : ""
      } ${borderColor} ${isDragging ? "shadow-lg" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b">
        {/* Drag Handle (placeholder) */}
        <div className="cursor-grab text-muted-foreground hover:text-foreground">
          <GripVertical className="h-4 w-4" />
        </div>

        {/* Rule Name Input */}
        <Input
          value={rule.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder={t("ruleName")}
          className="flex-1 h-8"
          disabled={disabled}
        />

        {/* Active Toggle */}
        <div className="flex items-center gap-2">
          <Checkbox
            checked={rule.isActive}
            onCheckedChange={(checked) =>
              handleActiveToggle(checked === true)
            }
            disabled={disabled}
          />
          <span className="text-sm text-muted-foreground">{t("active")}</span>
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          disabled={disabled}
          title={t("removeRule")}
          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Expand/Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-1"
        >
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Body (Collapsible) */}
      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Conditions List */}
          <div className="space-y-2">
            {rule.conditions.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No conditions configured. This rule will always match.
              </p>
            ) : (
              rule.conditions.map((condition, index) => (
                <ConditionRow
                  key={index}
                  condition={condition}
                  onChange={(c) => handleConditionChange(index, c)}
                  onRemove={() => handleRemoveCondition(index)}
                  dimensions={dimensions}
                  getDictionaryItems={getDictionaryItems}
                  onLoadCities={onLoadCities}
                  disabled={disabled || !rule.isActive}
                />
              ))
            )}
          </div>

          {/* Add Condition Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddCondition}
            disabled={disabled || !rule.isActive}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            {t("addCondition")}
          </Button>

          {/* Target URL Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium">{t("targetUrl")}</label>
            <Input
              value={rule.targetUrl}
              onChange={(e) => handleTargetUrlChange(e.target.value)}
              placeholder="https://example.com"
              disabled={disabled || !rule.isActive}
            />
          </div>
        </div>
      )}
    </div>
  );
}