import StatsOverview from "./StatsOverview";
import WorkflowGrid from "./WorkflowGrid";
import { mockDashboardStats, mockWorkflows } from "@/data/mockWorkflows";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-heading">Workflow Overview</h1>
        <p className="mt-1 text-sm text-muted">
          Manage and monitor your automation workflows
        </p>
      </div>

      <StatsOverview stats={mockDashboardStats} />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-heading">Your Workflows</h2>
          <span className="text-sm text-muted">
            {mockWorkflows.length} workflows
          </span>
        </div>
        <WorkflowGrid workflows={mockWorkflows} />
      </div>
    </div>
  );
}
