import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import type { NodeType } from "@/types/workflow";

interface ToolbarItem {
  type: NodeType;
  icon: string;
  label: string;
}

const primaryItems: ToolbarItem[] = [
  { type: "trigger", icon: "bolt", label: "Webhook" },
  { type: "schedule", icon: "schedule", label: "Schedule" },
  { type: "action", icon: "table_view", label: "Action" },
  { type: "condition", icon: "call_split", label: "Condition" },
  { type: "ifelse", icon: "call_split", label: "If/Else" },
];

const moreItems: ToolbarItem[] = [
  { type: "filter", icon: "filter_alt", label: "Filter" },
  { type: "switch", icon: "alt_route", label: "Switch" },
  { type: "loop", icon: "loop", label: "Loop" },
  { type: "delay", icon: "schedule", label: "Delay" },
  { type: "merge", icon: "merge", label: "Merge" },
  { type: "transform", icon: "transform", label: "Transform" },
  { type: "http_request", icon: "http", label: "HTTP Request" },
  { type: "error_handler", icon: "error_outline", label: "Error Handler" },
];

export default function CanvasToolbar() {
  const addNode = useWorkflowStore((s) => s.addNode);
  const [showMore, setShowMore] = useState(false);

  const handleAdd = (type: NodeType) => {
    addNode(type, {
      x: 400 + Math.random() * 100,
      y: 200 + Math.random() * 100,
    });
    setShowMore(false);
  };

  return (
    <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border-dark bg-surface-dark/90 p-1.5 shadow-xl backdrop-blur-md">
      {primaryItems.map((item, idx) => (
        <button
          key={`${item.label}-${idx}`}
          onClick={() => handleAdd(item.type)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
          title={`Add ${item.label}`}
        >
          <span className="material-icons text-sm">{item.icon}</span>
          {item.label}
        </button>
      ))}

      <div className="h-5 w-px bg-border-dark" />

      <div className="relative">
        <button
          onClick={() => setShowMore(!showMore)}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
        >
          <span className="material-icons text-sm">more_horiz</span>
        </button>

        {showMore && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMore(false)} />
            <div className="absolute right-0 top-full mt-2 z-20 w-52 rounded-xl border border-border-dark bg-surface-dark/95 p-1.5 shadow-2xl backdrop-blur-md">
              <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                More Nodes
              </p>
              {moreItems.map((item, idx) => (
                <button
                  key={`${item.label}-${idx}`}
                  onClick={() => handleAdd(item.type)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <span className="material-icons text-sm">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
