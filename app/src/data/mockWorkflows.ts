import type { WorkflowMeta, StatCardData } from "@/types/workflow";

export const mockDashboardStats: StatCardData[] = [
  {
    label: "Total Workflows",
    value: "24",
  },
  {
    label: "Active Tasks",
    value: "142",
  },
  {
    label: "Execution Rate",
    value: "99.8%",
    valueColor: "text-success",
  },
  {
    label: "System Health",
    value: "Optimal",
    valueColor: "text-success",
    indicator: "pulse",
    indicatorLabel: "Live",
  },
];

export const mockWorkflows: WorkflowMeta[] = [
  {
    id: "wf-customer-onboarding",
    name: "Customer Onboarding",
    description:
      "Automated new customer setup with CRM sync and welcome email sequence",
    status: "active",
    icon: "person_add",
    iconColor: "text-primary",
    iconBgColor: "bg-primary/20",
    integrations: ["API", "CRM", "ML"],
    lastActivity: "Last run 2m ago",
    lastSaved: new Date(),
  },
  {
    id: "wf-social-auto-post",
    name: "Social Auto-Post",
    description:
      "Schedule and publish content across social media platforms automatically",
    status: "draft",
    icon: "share",
    iconColor: "text-info",
    iconBgColor: "bg-info/20",
    integrations: ["API", "SCH"],
    progress: { current: 2, total: 3 },
    lastActivity: "Updated 4h ago",
    lastSaved: new Date(),
  },
  {
    id: "wf-invoice-auto-sync",
    name: "Invoice Auto-Sync",
    description:
      "Sync invoices between accounting systems with validation checks",
    status: "paused",
    icon: "receipt_long",
    iconColor: "text-warning",
    iconBgColor: "bg-warning/20",
    integrations: ["FIN", "DB"],
    error: "Auth required",
    lastActivity: "Updated 2d ago",
    lastSaved: new Date(),
  },
  {
    id: "wf-inventory-alerts",
    name: "Inventory Alerts",
    description:
      "Monitor stock levels and send notifications when inventory is low",
    status: "active",
    icon: "inventory_2",
    iconColor: "text-success",
    iconBgColor: "bg-success/20",
    integrations: ["SQL", "SLC"],
    lastActivity: "Last run 15m ago",
    lastSaved: new Date(),
  },
  {
    id: "wf-pdf-report-gen",
    name: "PDF Report Gen",
    description:
      "Generate and distribute weekly performance reports as PDF documents",
    status: "draft",
    icon: "picture_as_pdf",
    iconColor: "text-error",
    iconBgColor: "bg-error/20",
    integrations: ["RPT"],
    progress: { current: 1, total: 3 },
    lastActivity: "Updated 10h ago",
    lastSaved: new Date(),
  },
  {
    id: "wf-slack-pipeline",
    name: "Slack Notification Pipeline",
    description:
      "Filter form responses and send qualified leads to Slack channels",
    status: "draft",
    icon: "notifications_active",
    iconColor: "text-info",
    iconBgColor: "bg-info/20",
    integrations: ["SLC", "FRM"],
    progress: { current: 1, total: 3 },
    lastActivity: "Updated 1d ago",
    lastSaved: new Date(),
  },
];
