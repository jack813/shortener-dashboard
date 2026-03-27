// src/lib/types/split-rules.ts

export type Dimension =
  | 'country'
  | 'city'
  | 'device'
  | 'browser'
  | 'os'
  | 'bot'
  | 'referer'
  | 'time_range'
  | 'cron'
  | 'percentage';

export type Operator =
  | '='
  | '!='
  | 'in'
  | 'not_in'
  | 'contains'
  | 'not_contains'
  | 'prefix'
  | 'regex'
  | '<'
  | '<='
  | '>'
  | '>=';

export interface Condition {
  dimension: Dimension;
  operator: Operator;
  value: string | string[] | number;
}

export interface SplitRule {
  id: string;
  name: string;
  priority: number;
  targetUrl: string;
  isActive: boolean;
  conditions: Condition[];
}

export interface CreateLinkWithRulesRequest {
  url: string;
  custom?: string;
  expire_days?: number;
  permanent?: boolean;
  split_rules?: SplitRule[];
}

export interface DimensionDefinition {
  dimension: Dimension;
  labelEn: string;
  labelZh: string;
  operators: Operator[];
  valueType: 'select' | 'multiselect' | 'text' | 'number' | 'datetime' | 'cron';
  dictionary?: string;
}

export interface RuleStats {
  ruleId: string;
  ruleName: string;
  count: number;
  percentage: number;
}