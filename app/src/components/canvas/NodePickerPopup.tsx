import { useState } from "react";
import type { NodeType } from "@/types/workflow";

interface NodePickerItem {
  type: NodeType;
  icon: string;
  label: string;
  category: string;
}

const allItems: NodePickerItem[] = [
  { type: "trigger", icon: "bolt", label: "Webhook Trigger", category: "Triggers" },
  { type: "schedule", icon: "schedule", label: "Schedule", category: "Triggers" },
  { type: "action", icon: "table_view", label: "Action", category: "Logic" },
  { type: "condition", icon: "call_split", label: "Condition", category: "Logic" },
  { type: "ifelse", icon: "call_split", label: "If / Else", category: "Logic" },
  { type: "switch", icon: "alt_route", label: "Switch", category: "Logic" },
  { type: "loop", icon: "loop", label: "Loop", category: "Logic" },
  { type: "filter", icon: "filter_alt", label: "Filter", category: "Data" },
  { type: "transform", icon: "transform", label: "Transform", category: "Data" },
  { type: "merge", icon: "merge", label: "Merge", category: "Data" },
  { type: "delay", icon: "schedule", label: "Delay", category: "Flow" },
  { type: "http_request", icon: "http", label: "HTTP Request", category: "Integration" },
  { type: "error_handler", icon: "error_outline", label: "Error Handler", category: "Flow" },
];

interface NodePickerPopupProps {
  position: { x: number; y: number };
  onSelect: (type: NodeType) => void;
  onClose: () => void;
}

export default function NodePickerPopup({ position, onSelect, onClose }: NodePickerPopupProps) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      )
    : allItems;

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Popup */}
      <div
        className="absolute z-50 w-56 rounded-xl border border-border-dark bg-surface-dark shadow-2xl animate-scale-in overflow-hidden"
        style={{ left: position.x, top: position.y }}
      >
        {/* Search */}
        <div className="border-b border-border-dark p-2">
          <div className="relative">
            <span className="material-icons absolute left-2 top-1/2 -translate-y-1/2 text-muted text-sm">
              search
            </span>
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nodes..."
              className="w-full rounded-lg bg-bg-dark py-1.5 pl-7 pr-3 text-xs text-heading placeholder:text-muted outline-none focus:ring-1 focus:ring-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* Node list */}
        <div className="max-h-64 overflow-y-auto custom-scrollbar p-1.5">
          {categories.map((cat) => (
            <div key={cat}>
              <p className="px-2 pt-2 pb-1 text-[9px] font-bold uppercase tracking-widest text-muted">
                {cat}
              </p>
              {filtered
                .filter((i) => i.category === cat)
                .map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onSelect(item.type)}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-body hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <span className="material-icons text-sm">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-4 text-center text-xs text-muted">No nodes found</p>
          )}
        </div>
      </div>
    </>
  );
}
