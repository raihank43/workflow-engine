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

// ─── Demo Workflow 3: Customer Onboarding ───

export const customerOnboardingNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 260 },
    data: {
      label: "New Signup",
      subLabel: "Auth0 Webhook",
      nodeType: "trigger",
      icon: "person_add",
      iconBgColor: "bg-primary/20",
      iconColor: "text-primary",
      typeLabel: "TRIGGER",
      typeLabelColor: "text-primary",
      status: "active",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 400, y: 160 },
    data: {
      label: "Create CRM Contact",
      subLabel: "Salesforce",
      nodeType: "action",
      icon: "contact_page",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-blue-500",
      service: "Salesforce • Active",
      status: "active",
    },
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 400, y: 380 },
    data: {
      label: "Send Welcome Email",
      subLabel: "SendGrid",
      nodeType: "action",
      icon: "email",
      iconBgColor: "bg-orange-500/20",
      iconColor: "text-orange-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-orange-500",
      service: "SendGrid • Active",
      status: "active",
    },
  },
  {
    id: "delay-1",
    type: "delay",
    position: { x: 700, y: 380 },
    data: {
      label: "Wait 2 Days",
      subLabel: "48h delay",
      nodeType: "delay",
      icon: "schedule",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
      typeLabel: "DELAY",
      typeLabelColor: "text-amber-500",
      status: "active",
    },
  },
  {
    id: "action-3",
    type: "action",
    position: { x: 1000, y: 380 },
    data: {
      label: "Send Follow-up",
      subLabel: "SendGrid",
      nodeType: "action",
      icon: "forward_to_inbox",
      iconBgColor: "bg-orange-500/20",
      iconColor: "text-orange-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-orange-500",
      service: "SendGrid • Active",
      status: "default",
    },
  },
];

export const customerOnboardingEdges: WorkflowEdge[] = [
  { id: "e-t1-a1", source: "trigger-1", target: "action-1", type: "custom" },
  { id: "e-t1-a2", source: "trigger-1", target: "action-2", type: "custom" },
  { id: "e-a2-d1", source: "action-2", target: "delay-1", type: "custom" },
  { id: "e-d1-a3", source: "delay-1", target: "action-3", type: "custom" },
];

// ─── Demo Workflow 4: Social Auto-Post ───

export const socialAutoPostNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "schedule",
    position: { x: 100, y: 260 },
    data: {
      label: "Daily Schedule",
      subLabel: "Every day at 9 AM",
      nodeType: "schedule",
      icon: "schedule",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
      typeLabel: "SCHEDULE",
      typeLabelColor: "text-amber-500",
      status: "active",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 400, y: 260 },
    data: {
      label: "Fetch Content Queue",
      subLabel: "Google Sheets",
      nodeType: "action",
      icon: "table_view",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "Google Sheets • Active",
      status: "default",
    },
  },
  {
    id: "loop-1",
    type: "loop",
    position: { x: 700, y: 260 },
    data: {
      label: "For Each Post",
      subLabel: "Iterate items",
      nodeType: "loop",
      icon: "loop",
      iconBgColor: "bg-violet-500/20",
      iconColor: "text-violet-500",
      typeLabel: "LOOP",
      typeLabelColor: "text-violet-500",
      status: "default",
    },
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 1000, y: 260 },
    data: {
      label: "Post to Social",
      subLabel: "Multi-platform",
      nodeType: "action",
      icon: "share",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-blue-500",
      status: "draft",
    },
  },
];

export const socialAutoPostEdges: WorkflowEdge[] = [
  { id: "e-t1-a1", source: "trigger-1", target: "action-1", type: "custom" },
  { id: "e-a1-l1", source: "action-1", target: "loop-1", type: "custom" },
  { id: "e-l1-a2", source: "loop-1", target: "action-2", type: "custom" },
];

// ─── Demo Workflow 5: Invoice Auto-Sync ───

export const invoiceAutoSyncNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 260 },
    data: {
      label: "New Invoice",
      subLabel: "Stripe Webhook",
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
    id: "format-1",
    type: "transform",
    position: { x: 400, y: 260 },
    data: {
      label: "Format Invoice Data",
      subLabel: "Map fields",
      nodeType: "transform",
      icon: "transform",
      iconBgColor: "bg-teal-500/20",
      iconColor: "text-teal-500",
      typeLabel: "TRANSFORM",
      typeLabelColor: "text-teal-500",
      status: "default",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 700, y: 160 },
    data: {
      label: "Update QuickBooks",
      subLabel: "Accounting",
      nodeType: "action",
      icon: "receipt_long",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "QuickBooks • Paused",
      status: "paused",
    },
  },
  {
    id: "error-1",
    type: "error_handler",
    position: { x: 700, y: 380 },
    data: {
      label: "Handle Sync Error",
      subLabel: "Retry 3x, then alert",
      nodeType: "error_handler",
      icon: "error_outline",
      iconBgColor: "bg-red-500/20",
      iconColor: "text-red-500",
      typeLabel: "ERROR HANDLER",
      typeLabelColor: "text-red-500",
      status: "default",
    },
  },
];

export const invoiceAutoSyncEdges: WorkflowEdge[] = [
  { id: "e-t1-f1", source: "trigger-1", target: "format-1", type: "custom" },
  { id: "e-f1-a1", source: "format-1", target: "action-1", type: "custom" },
  {
    id: "e-f1-err1",
    source: "format-1",
    target: "error-1",
    type: "custom",
    data: { dashed: true },
  },
];

// ─── Demo Workflow 6: Inventory Alerts ───

export const inventoryAlertsNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "schedule",
    position: { x: 100, y: 260 },
    data: {
      label: "Hourly Check",
      subLabel: "Every 60 min",
      nodeType: "schedule",
      icon: "schedule",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
      typeLabel: "SCHEDULE",
      typeLabelColor: "text-amber-500",
      status: "active",
    },
  },
  {
    id: "action-1",
    type: "action",
    position: { x: 400, y: 260 },
    data: {
      label: "Query Stock Levels",
      subLabel: "PostgreSQL",
      nodeType: "action",
      icon: "database",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "PostgreSQL • Active",
      status: "active",
    },
  },
  {
    id: "condition-1",
    type: "condition",
    position: { x: 700, y: 240 },
    data: {
      label: "Stock Below Threshold?",
      nodeType: "condition",
      icon: "call_split",
      iconBgColor: "bg-primary/10",
      iconColor: "text-primary",
      typeLabel: "CONDITION",
      typeLabelColor: "text-primary",
      conditionText: "quantity < min_stock",
      status: "default",
    },
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 1050, y: 140 },
    data: {
      label: "Send Slack Alert",
      subLabel: "#inventory-alerts",
      nodeType: "action",
      icon: "chat",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      service: "Slack • Active",
      status: "active",
    },
  },
  {
    id: "action-3",
    type: "action",
    position: { x: 1050, y: 380 },
    data: {
      label: "Log Check",
      subLabel: "Google Sheets",
      nodeType: "action",
      icon: "table_view",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      typeLabel: "ACTION",
      typeLabelColor: "text-green-500",
      status: "default",
    },
  },
];

export const inventoryAlertsEdges: WorkflowEdge[] = [
  { id: "e-t1-a1", source: "trigger-1", target: "action-1", type: "custom" },
  { id: "e-a1-c1", source: "action-1", target: "condition-1", type: "custom" },
  {
    id: "e-c1-a2",
    source: "condition-1",
    target: "action-2",
    sourceHandle: "true",
    type: "custom",
  },
  {
    id: "e-c1-a3",
    source: "condition-1",
    target: "action-3",
    sourceHandle: "false",
    type: "custom",
    data: { dashed: true },
  },
];

// ─── Demo Workflow 7: PDF Report Gen ───

export const pdfReportGenNodes: WorkflowNode[] = [
  {
    id: "trigger-1",
    type: "schedule",
    position: { x: 100, y: 260 },
    data: {
      label: "Weekly Schedule",
      subLabel: "Every Monday 8 AM",
      nodeType: "schedule",
      icon: "schedule",
      iconBgColor: "bg-amber-500/20",
      iconColor: "text-amber-500",
      typeLabel: "SCHEDULE",
      typeLabelColor: "text-amber-500",
      status: "active",
    },
  },
  {
    id: "action-1",
    type: "http_request",
    position: { x: 400, y: 260 },
    data: {
      label: "Fetch Report Data",
      subLabel: "GET /api/reports",
      nodeType: "http_request",
      icon: "http",
      iconBgColor: "bg-cyan-500/20",
      iconColor: "text-cyan-500",
      typeLabel: "HTTP REQUEST",
      typeLabelColor: "text-cyan-500",
      status: "default",
    },
  },
  {
    id: "format-1",
    type: "transform",
    position: { x: 700, y: 260 },
    data: {
      label: "Generate PDF",
      subLabel: "Template: Weekly Report",
      nodeType: "transform",
      icon: "picture_as_pdf",
      iconBgColor: "bg-teal-500/20",
      iconColor: "text-teal-500",
      typeLabel: "TRANSFORM",
      typeLabelColor: "text-teal-500",
      status: "draft",
    },
  },
  {
    id: "action-2",
    type: "action",
    position: { x: 1000, y: 260 },
    data: {
      label: "Email Report",
      subLabel: "Distribution List",
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

export const pdfReportGenEdges: WorkflowEdge[] = [
  { id: "e-t1-a1", source: "trigger-1", target: "action-1", type: "custom" },
  { id: "e-a1-f1", source: "action-1", target: "format-1", type: "custom" },
  { id: "e-f1-a2", source: "format-1", target: "action-2", type: "custom" },
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
  "wf-customer-onboarding": {
    nodes: customerOnboardingNodes,
    edges: customerOnboardingEdges,
  },
  "wf-social-auto-post": {
    nodes: socialAutoPostNodes,
    edges: socialAutoPostEdges,
  },
  "wf-invoice-auto-sync": {
    nodes: invoiceAutoSyncNodes,
    edges: invoiceAutoSyncEdges,
  },
  "wf-inventory-alerts": {
    nodes: inventoryAlertsNodes,
    edges: inventoryAlertsEdges,
  },
  "wf-pdf-report-gen": {
    nodes: pdfReportGenNodes,
    edges: pdfReportGenEdges,
  },
} as const;
