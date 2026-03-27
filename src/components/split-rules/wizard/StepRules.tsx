"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { RuleCard } from "../editor/RuleCard";
import { Plus } from "lucide-react";
import type { SplitRule, DimensionDefinition, Dimension } from "@/lib/types/split-rules";
import type { DictionaryItem } from "@/lib/api/use-dictionaries";

interface StepRulesProps {
  rules: SplitRule[];
  onRulesChange: (rules: SplitRule[]) => void;
  dimensions: DimensionDefinition[];
  getDictionaryItems: (dimension: Dimension) => DictionaryItem[];
  onLoadCities?: (countryCode: string) => Promise<boolean>;
  disabled?: boolean;
}

interface SortableRuleCardProps {
  rule: SplitRule;
  onChange: (rule: SplitRule) => void;
  onRemove: () => void;
  dimensions: DimensionDefinition[];
  getDictionaryItems: (dimension: Dimension) => DictionaryItem[];
  onLoadCities?: (countryCode: string) => Promise<boolean>;
  disabled?: boolean;
}

function SortableRuleCard({
  rule,
  onChange,
  onRemove,
  dimensions,
  getDictionaryItems,
  onLoadCities,
  disabled,
}: SortableRuleCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <RuleCard
        rule={rule}
        onChange={onChange}
        onRemove={onRemove}
        dimensions={dimensions}
        getDictionaryItems={getDictionaryItems}
        onLoadCities={onLoadCities}
        disabled={disabled}
        isDragging={isDragging}
      />
    </div>
  );
}

export function StepRules({
  rules,
  onRulesChange,
  dimensions,
  getDictionaryItems,
  onLoadCities,
  disabled = false,
}: StepRulesProps) {
  const t = useTranslations("Links.wizard");
  const ruleIdCounter = useRef(0);

  const generateRuleId = () => `rule-${Date.now()}-${++ruleIdCounter.current}`;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = rules.findIndex((rule) => rule.id === active.id);
      const newIndex = rules.findIndex((rule) => rule.id === over.id);

      const newRules = arrayMove(rules, oldIndex, newIndex).map((rule, index) => ({
        ...rule,
        priority: (index + 1) * 100,
      }));

      onRulesChange(newRules);
    }
  };

  const handleAddRule = () => {
    const newRule: SplitRule = {
      id: generateRuleId(),
      name: `${t("ruleName")} ${rules.length + 1}`,
      priority: (rules.length + 1) * 100,
      targetUrl: "",
      isActive: true,
      conditions: [],
    };

    onRulesChange([...rules, newRule]);
  };

  const handleRuleChange = (id: string, updatedRule: SplitRule) => {
    onRulesChange(rules.map((rule) => (rule.id === id ? updatedRule : rule)));
  };

  const handleRuleRemove = (id: string) => {
    const newRules = rules
      .filter((rule) => rule.id !== id)
      .map((rule, index) => ({
        ...rule,
        priority: (index + 1) * 100,
      }));

    onRulesChange(newRules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("step2Title")}</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddRule}
          disabled={disabled}
        >
          <Plus className="h-4 w-4 mr-1" />
          {t("addRule")}
        </Button>
      </div>

      {rules.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>{t("noConditions")}</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={rules.map((rule) => rule.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {rules.map((rule) => (
                <SortableRuleCard
                  key={rule.id}
                  rule={rule}
                  onChange={(updatedRule) => handleRuleChange(rule.id, updatedRule)}
                  onRemove={() => handleRuleRemove(rule.id)}
                  dimensions={dimensions}
                  getDictionaryItems={getDictionaryItems}
                  onLoadCities={onLoadCities}
                  disabled={disabled}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}