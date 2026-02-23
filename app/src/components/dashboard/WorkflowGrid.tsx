import type { WorkflowMeta } from "@/types/workflow";
import WorkflowCard from "./WorkflowCard";
import CreateWorkflowCard from "./CreateWorkflowCard";

interface WorkflowGridProps {
  workflows: WorkflowMeta[];
}

export default function WorkflowGrid({ workflows }: WorkflowGridProps) {
  return (
    <div className="workflow-grid">
      <CreateWorkflowCard />
      {workflows.map((wf) => (
        <WorkflowCard key={wf.id} workflow={wf} />
      ))}
    </div>
  );
}
