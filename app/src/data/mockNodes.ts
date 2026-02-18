import type { WorkflowNode, WorkflowEdge } from "@/types/workflow";

// ─── Demo Workflow 1: E-commerce Fulfillment ───

export const ecommerceFulfillmentNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 260 },
    data: {
      label: "Incoming Webhook",
      subLabel: "Order Created",
      nodeType: "trigger",
      icon: "bolt",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      typeLabel: "TRIGGER",
      typeLabelColor: "text-primary",
      status: "active",
    },
  },
  {
    id: "condition-1",
    type: "condition",
    position: { x: 380, y: 240 },
    data: {
      label: "Check Order Value",
      nodeType: "condition",
      icon: "call_split",
      iconBgColor: "bg-primary/10",
      iconColor: "text-primary",
      typeLabel: "CONDITION",
      typeLabelColor: "text-primary",
      conditionText: "Total Amount > $100",
      status: "default",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 760, y: 140 },
    data: {
      label: "Log High-Value Order",
      subLabel: "Google Sheets",
      nodeType: "action",
      icon: "table_view",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "Google Sheets • Active",
      status: "configuring",
      statusBanner: "CONFIGURING...",
    },
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 760, y: 380 },
    data: {
      label: "Notify Customer",
      subLabel: "SendGrid",
      nodeType: "action",
      icon: "email",
      iconBgColor: "bg-orange-500/20",
      iconColor: "text-orange-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-orange-500",
      service: "SendGrid • Active",
      status: "default",
    },
  },
];

export const ecommerceFulfillmentEdges: WorkflowEdge[] = [
  {
    id: "e-trigger1-condition1",
    source: "trigger-1",
    target: "condition-1",
    type: "custom",
  },
  {
    id: "e-condition1-action1",
    source: "condition-1",
    target: "action-1",
    sourceHandle: "true",
    type: "custom",
  },
  {
    id: "e-condition1-action2",
    source: "condition-1",
    target: "action-2",
    sourceHandle: "false",
    type: "custom",
    data: { dashed: true },
  },
];

// ─── Demo Workflow 2: Slack Notification Pipeline ───

export const slackPipelineNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 260 },
    data: {
      label: "New Form Entry",
      subLabel: "Typeform",
      nodeType: "trigger",
      icon: "bolt",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      typeLabel: "TRIGGER",
      typeLabelColor: "text-primary",
      status: "default",
    },
  },
  {
    id: "filter-1",
    type: "action",
    position: { x: 400, y: 260 },
    data: {
      label: "Filter Responses",
      subLabel: "Score > 80",
      nodeType: "filter",
      icon: "filter_alt",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
      typeLabel: "FILTER",
      typeLabelColor: "text-blue-500",
      status: "default",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 700, y: 260 },
    data: {
      label: "Send Slack Message",
      subLabel: "#sales-leads",
      nodeType: "action",
      icon: "chat",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "Slack • Active",
      status: "default",
    },
  },
];

export const slackPipelineEdges: WorkflowEdge[] = [
  {
    id: "e-trigger1-filter1",
    source: "trigger-1",
    target: "filter-1",
    type: "custom",
  },
  {
    id: "e-filter1-action1",
    source: "filter-1",
    target: "action-1",
    type: "custom",
  },
];

// ─── Workflow registry ───

export const demoWorkflows = {
  "wf-ecommerce-fulfillment": {
    nodes: ecommerceFulfillmentNodes,
    edges: ecommerceFulfillmentEdges,
  },
  "wf-slack-pipeline": {
    nodes: slackPipelineNodes,
    edges: slackPipelineEdges,
  },
} as const;
