import { useWorkflowStore } from "@/stores/workflowStore";
import type { NodeType } from "@/types/workflow";

const toolbarItems: { type: NodeType; icon: string; label: string }[] = [
  { type: "trigger", icon: "bolt", label: "Webhook" },
  { type: "filter", icon: "filter_alt", label: "Filter" },
  { type: "action", icon: "table_view", label: "Sheets" },
  { type: "action", icon: "email", label: "Email" },
];

export default function CanvasToolbar() {
  const addNode = useWorkflowStore((s) => s.addNode);

  const handleAdd = (type: NodeType) => {
    // Add at center-ish of the canvas
    addNode(type, {
      x: 400 + Math.random() * 100,
      y: 200 + Math.random() * 100,
    });
  };

  return (
    <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border-dark bg-surface-dark/90 p-1.5 shadow-xl backdrop-blur-md">
      {toolbarItems.map((item, idx) => (
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

      <button className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/5 hover:text-white transition-colors">
        <span className="material-icons text-sm">more_horiz</span>
      </button>
    </div>
  );
}
