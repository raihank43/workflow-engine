import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNodeData, WorkflowNode } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface BaseNodeProps {
  data: WorkflowNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

export default function BaseNode({ data, selected, children }: BaseNodeProps) {
  const isInactive = data.status === "inactive";
  const isConfiguring = data.status === "configuring";
  const isTesting = data.status === "testing";

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-50",
        selected || isConfiguring || isTesting
          ? "border-2 border-primary ring-4 ring-primary/20"
          : "border-border-dark",
        isInactive && "opacity-60 grayscale",
        isTesting && "pulse-ring"
      )}
    >
      {/* Status banner */}
      {data.statusBanner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg shadow-primary/30">
          {data.statusBanner}
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg",
              data.iconBgColor
            )}
          >
            <span className={cn("material-icons text-base", data.iconColor)}>
              {data.icon}
            </span>
          </div>
          <div className="min-w-0">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                data.typeLabelColor
              )}
            >
              {data.typeLabel}
            </span>
            <p className="text-sm font-semibold text-white truncate">
              {data.label}
            </p>
          </div>
        </div>

        {data.subLabel && (
          <p className="mt-1 ml-11 text-[10px] uppercase text-slate-500">
            {data.subLabel}
          </p>
        )}

        {data.service && (
          <p className="mt-1 ml-11 text-[10px] text-slate-500">
            {data.service}
          </p>
        )}

        {children}
      </div>

      {/* Handles — type-specific handles are added in individual node components */}
    </div>
  );
}

// ─── Trigger Node ───
export function TriggerNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode data={data} selected={selected}>
      <Handle
        type="source"
        position={Position.Right}
        className="bg-bg-dark! border-primary!"
      />
    </BaseNode>
  );
}

// ─── Action Node ───
export function ActionNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode data={data} selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        className="bg-bg-dark! border-primary!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-bg-dark! border-primary!"
      />
    </BaseNode>
  );
}

// ─── Condition Node ───
export function ConditionNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-55 overflow-hidden",
        selected || data.status === "configuring"
          ? "border-2 border-primary ring-4 ring-primary/20"
          : "border-border-dark"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-primary/20 bg-primary/10 px-3 py-2.5">
        <span className="material-icons text-sm text-primary">call_split</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          CONDITION
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm font-medium italic text-slate-400">IF</p>
        <p className="mt-1 text-sm font-semibold text-white">
          {data.conditionText || data.label}
        </p>

        {/* Branches */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              TRUE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              FALSE
            </span>
          </div>
        </div>
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="bg-bg-dark! border-primary!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        style={{ top: "40%" }}
        className="bg-bg-dark! border-success!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="false"
        style={{ top: "70%" }}
        className="bg-bg-dark! border-slate-500!"
      />
    </div>
  );
}

// ─── Filter Node ───
export function FilterNode({ data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode data={data} selected={selected}>
      <Handle
        type="target"
        position={Position.Left}
        className="bg-bg-dark! border-primary!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="bg-bg-dark! border-primary!"
      />
    </BaseNode>
  );
}
