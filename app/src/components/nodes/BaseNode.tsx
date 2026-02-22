import { useState, useRef, useEffect } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { WorkflowNodeData, WorkflowNode } from "@/types/workflow";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

// ─── Node Options Menu (⋮) ───
function NodeMenu({ nodeId }: { nodeId: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const copyNode = useWorkflowStore((s) => s.copyNode);
  const deselectNode = useUIStore((s) => s.deselectNode);

  useEffect(() => {
    if (!open) return;
    const handle = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handle, true);
    return () => document.removeEventListener("pointerdown", handle, true);
  }, [open]);

  const handleAction = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="absolute -top-3 -right-3 z-10">
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-dark border border-border-dark opacity-0 transition-all duration-200 group-hover:opacity-100 hover:bg-primary/20 hover:border-primary/40 text-body hover:text-heading"
        title="Node options"
      >
        <span className="material-icons text-sm">more_vert</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-border-dark bg-surface-dark shadow-xl animate-scale-in overflow-hidden">
          <button
            onClick={handleAction(() => duplicateNode(nodeId))}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-body hover:bg-hover-bg-strong hover:text-heading transition-colors"
          >
            <span className="material-icons text-sm">content_copy</span>
            Duplicate
          </button>
          <button
            onClick={handleAction(() => copyNode(nodeId))}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-body hover:bg-hover-bg-strong hover:text-heading transition-colors"
          >
            <span className="material-icons text-sm">file_copy</span>
            Copy
          </button>
          <div className="h-px bg-border-dark" />
          <button
            onClick={handleAction(() => { deleteNode(nodeId); deselectNode(); })}
            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-error hover:bg-error/10 transition-colors"
          >
            <span className="material-icons text-sm">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

interface BaseNodeProps {
  nodeId: string;
  data: WorkflowNodeData;
  selected?: boolean;
  children?: React.ReactNode;
}

export default function BaseNode({ nodeId, data, selected, children }: BaseNodeProps) {
  const isInactive = data.status === "inactive";
  const isConfiguring = data.status === "configuring";
  const isTesting = data.status === "testing";

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-50 group",
        selected || isConfiguring || isTesting
          ? "border-2 border-primary ring-4 ring-primary/20"
          : "border-border-dark",
        isInactive && "opacity-60 grayscale",
        isTesting && "pulse-ring"
      )}
    >
      {/* Options menu */}
      <NodeMenu nodeId={nodeId} />

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
            <p className="text-sm font-semibold text-heading truncate">
              {data.label}
            </p>
          </div>
        </div>

        {data.subLabel && (
          <p className="mt-1 ml-11 text-[10px] uppercase text-muted">
            {data.subLabel}
          </p>
        )}

        {data.service && (
          <p className="mt-1 ml-11 text-[10px] text-muted">
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
export function TriggerNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle
        type="source"
        position={Position.Right}
        className="bg-bg-dark! border-primary!"
      />
    </BaseNode>
  );
}

// ─── Action Node ───
export function ActionNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
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
export function ConditionNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-55 group",
        selected || data.status === "configuring"
          ? "border-2 border-primary ring-4 ring-primary/20"
          : "border-border-dark"
      )}
    >
      <NodeMenu nodeId={id} />

      {/* Header */}
      <div className="flex items-center gap-2 rounded-t-[11px] border-b border-primary/20 bg-primary/10 px-3 py-2.5">
        <span className="material-icons text-sm text-primary">call_split</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
          CONDITION
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="text-sm font-medium italic text-body">IF</p>
        <p className="mt-1 text-sm font-semibold text-heading">
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
            <span className="h-2 w-2 rounded-full bg-muted" />
            <span className="rounded-full bg-muted/10 px-2 py-0.5 text-[10px] font-bold text-muted">
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
export function FilterNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
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

// ─── If/Else Node ───
export function IfElseNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-55 group",
        selected
          ? "border-2 border-purple-500 ring-4 ring-purple-500/20"
          : "border-border-dark"
      )}
    >
      <NodeMenu nodeId={id} />

      <div className="flex items-center gap-2 rounded-t-[11px] border-b border-purple-500/20 bg-purple-500/10 px-3 py-2.5">
        <span className="material-icons text-sm text-purple-500">call_split</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500">
          IF / ELSE
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm font-medium italic text-body">IF</p>
        <p className="mt-1 text-sm font-semibold text-heading">
          {data.conditionText || data.label}
        </p>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              THEN
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="rounded-full bg-red-400/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
              ELSE
            </span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-purple-500!" />
      <Handle type="source" position={Position.Right} id="then" style={{ top: "40%" }} className="bg-bg-dark! border-success!" />
      <Handle type="source" position={Position.Right} id="else" style={{ top: "70%" }} className="bg-bg-dark! border-red-400!" />
    </div>
  );
}

// ─── Switch Node ───
export function SwitchNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <div
      className={cn(
        "relative rounded-xl border bg-surface-dark node-shadow transition-all min-w-55 group",
        selected
          ? "border-2 border-indigo-500 ring-4 ring-indigo-500/20"
          : "border-border-dark"
      )}
    >
      <NodeMenu nodeId={id} />

      <div className="flex items-center gap-2 rounded-t-[11px] border-b border-indigo-500/20 bg-indigo-500/10 px-3 py-2.5">
        <span className="material-icons text-sm text-indigo-500">alt_route</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
          SWITCH
        </span>
      </div>

      <div className="p-4">
        <p className="text-sm font-medium italic text-body">SWITCH ON</p>
        <p className="mt-1 text-sm font-semibold text-heading">{data.label}</p>

        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            <span className="rounded-full bg-indigo-400/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
              CASE 1
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-300" />
            <span className="rounded-full bg-indigo-300/10 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
              CASE 2
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-500" />
            <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              DEFAULT
            </span>
          </div>
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-indigo-500!" />
      <Handle type="source" position={Position.Right} id="case1" style={{ top: "35%" }} className="bg-bg-dark! border-indigo-400!" />
      <Handle type="source" position={Position.Right} id="case2" style={{ top: "55%" }} className="bg-bg-dark! border-indigo-300!" />
      <Handle type="source" position={Position.Right} id="default" style={{ top: "75%" }} className="bg-bg-dark! border-slate-500!" />
    </div>
  );
}

// ─── Loop Node ───
export function LoopNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-violet-500!" />
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-violet-500!" />
      <Handle type="source" position={Position.Bottom} id="loop-back" className="bg-bg-dark! border-violet-500/50!" />
    </BaseNode>
  );
}

// ─── Delay Node ───
export function DelayNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-amber-500!" />
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-amber-500!" />
    </BaseNode>
  );
}

// ─── Merge Node ───
export function MergeNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} id="input-1" style={{ top: "35%" }} className="bg-bg-dark! border-sky-500!" />
      <Handle type="target" position={Position.Left} id="input-2" style={{ top: "65%" }} className="bg-bg-dark! border-sky-500!" />
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-sky-500!" />
    </BaseNode>
  );
}

// ─── Transform Node ───
export function TransformNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-teal-500!" />
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-teal-500!" />
    </BaseNode>
  );
}

// ─── HTTP Request Node ───
export function HttpRequestNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-cyan-500!" />
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-cyan-500!" />
    </BaseNode>
  );
}

// ─── Error Handler Node ───
export function ErrorHandlerNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="target" position={Position.Left} className="bg-bg-dark! border-red-500!" />
      <Handle type="source" position={Position.Right} id="success" style={{ top: "35%" }} className="bg-bg-dark! border-success!" />
      <Handle type="source" position={Position.Right} id="error" style={{ top: "65%" }} className="bg-bg-dark! border-red-500!" />
    </BaseNode>
  );
}

// ─── Schedule Node (Trigger variant) ───
export function ScheduleNode({ id, data, selected }: NodeProps<WorkflowNode>) {
  return (
    <BaseNode nodeId={id} data={data} selected={selected}>
      <Handle type="source" position={Position.Right} className="bg-bg-dark! border-amber-500!" />
    </BaseNode>
  );
}
