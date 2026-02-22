import { useNavigate } from "react-router-dom";
import type { WorkflowMeta } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface WorkflowCardProps {
  workflow: WorkflowMeta;
}

const statusConfig = {
  active: {
    label: "Active",
    badge: "bg-success/10 text-success border-success/20",
    border: "border-l-4 border-l-primary",
  },
  draft: {
    label: "Draft",
    badge: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    border: "",
  },
  paused: {
    label: "Paused",
    badge: "bg-warning/10 text-warning border-warning/20",
    border: "",
  },
};

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const navigate = useNavigate();
  const status = statusConfig[workflow.status];

  return (
    <div
      onClick={() => navigate(`/workflow/${workflow.id}`)}
      className={cn(
        "group cursor-pointer rounded-xl border border-border-dark bg-surface-dark p-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        status.border
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg",
              workflow.iconBgColor
            )}
          >
            <span className={cn("material-icons text-xl", workflow.iconColor)}>
              {workflow.icon}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-heading group-hover:text-primary transition-colors">
              {workflow.name}
            </h3>
            <p className="mt-0.5 text-xs text-muted">{workflow.lastActivity}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
            status.badge
          )}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-body line-clamp-2">
        {workflow.description}
      </p>

      {/* Integrations */}
      <div className="mt-4 flex items-center gap-2">
        {workflow.integrations.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-6 items-center rounded-full bg-hover-bg px-2 text-[10px] font-semibold text-body uppercase"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Progress bar (draft) */}
      {workflow.progress && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[10px] text-muted">
            <span>Configuring</span>
            <span>
              {workflow.progress.current}/{workflow.progress.total}
            </span>
          </div>
          <div className="mt-1 h-1 rounded-full bg-border-dark">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{
                width: `${(workflow.progress.current / workflow.progress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Error message (paused) */}
      {workflow.error && (
        <div className="mt-3 flex items-center gap-1.5 text-xs text-warning">
          <span className="material-icons text-sm">warning</span>
          {workflow.error}
        </div>
      )}
    </div>
  );
}
