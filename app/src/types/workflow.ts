import type { Node, Edge } from "@xyflow/react";

// ─── Node Data Types ───
export type NodeStatus =
  | "default"
  | "selected"
  | "configuring"
  | "testing"
  | "active"
  | "draft"
  | "paused"
  | "inactive";

export type NodeType =
  | "trigger"
  | "action"
  | "condition"
  | "filter"
  // Advanced logic
  | "ifelse"
  | "switch"
  | "loop"
  // Timing & flow
  | "delay"
  | "merge"
  // Data transformation
  | "transform"
  // Integration
  | "http_request"
  // Error handling
  | "error_handler"
  // Scheduling
  | "schedule";

export type ConfigStep = 1 | 2 | 3;

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string;
  subLabel?: string;
  nodeType: NodeType;
  icon: string;
  iconBgColor: string;
  iconColor: string;
  typeLabel: string;
  typeLabelColor: string;
  service?: string;
  status: NodeStatus;
  statusBanner?: string;
  // Condition-specific
  conditionText?: string;
  // Config data
  configStep?: ConfigStep;
  config?: Record<string, unknown>;
}

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge<{ animated?: boolean; dashed?: boolean }>;

// ─── Workflow Types ───
export type WorkflowStatus = "active" | "draft" | "paused";

export interface WorkflowMeta {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  icon: string;
  iconColor: string;
  iconBgColor: string;
  integrations: string[];
  progress?: { current: number; total: number };
  lastActivity: string;
  error?: string;
  lastSaved: Date;
}

// ─── Dashboard Types ───
export interface StatCardData {
  label: string;
  value: string;
  valueColor?: string;
  indicator?: "pulse" | "none";
  indicatorLabel?: string;
}
