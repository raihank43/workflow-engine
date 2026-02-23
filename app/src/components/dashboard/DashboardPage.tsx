import StatsOverview from "./StatsOverview";
import WorkflowGrid from "./WorkflowGrid";
import { mockWorkflows } from "@/data/mockWorkflows";
import type { StatCardData } from "@/types/workflow";

export default function DashboardPage() {
  const totalWorkflows = mockWorkflows.length;
  const activeWorkflows = mockWorkflows.filter((w) => w.status === "active").length;

  const stats: StatCardData[] = [
    { label: "Total Workflows", value: String(totalWorkflows) },
    {
      label: "Active Workflows",
      value: String(activeWorkflows),
      valueColor: "text-success",
      indicator: "pulse",
      indicatorLabel: "Live",
    },
    { label: "Draft", value: String(mockWorkflows.filter((w) => w.status === "draft").length) },
    { label: "Paused", value: String(mockWorkflows.filter((w) => w.status === "paused").length), valueColor: "text-warning" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Workflow Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Manage and monitor your automation workflows
        </p>
      </div>

      <StatsOverview stats={stats} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-heading">Your Workflows</h2>
          <span className="text-sm text-muted">
            {totalWorkflows} workflows
          </span>
        </div>
        <WorkflowGrid workflows={mockWorkflows} />
      </div>
    </div>
  );
}
