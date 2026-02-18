import { useState } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";

export default function SetupStep() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const [nodeName, setNodeName] = useState(node?.data.label ?? "");
  const [account, setAccount] = useState("default");
  const [spreadsheetId, setSpreadsheetId] = useState("");

  if (!node) return null;

  const handleNameChange = (value: string) => {
    setNodeName(value);
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, { label: value });
    }
  };

  return (
    <div className="space-y-5">
      {/* Node Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Node Name
        </label>
        <input
          type="text"
          value={nodeName}
          onChange={(e) => handleNameChange(e.target.value)}
          className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
          placeholder="Enter node name"
        />
      </div>

      {/* Account Select */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Account
        </label>
        <select
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          className="w-full rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-white outline-none focus:border-primary/50 appearance-none cursor-pointer"
        >
          <option value="default">Production Account</option>
          <option value="staging">Staging Account</option>
          <option value="dev">Development Account</option>
        </select>
      </div>

      {/* Spreadsheet ID */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Spreadsheet ID
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={spreadsheetId}
            onChange={(e) => setSpreadsheetId(e.target.value)}
            className="flex-1 rounded-lg border border-border-dark bg-bg-dark px-3 py-2 text-sm text-white outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
            placeholder="Enter spreadsheet ID or URL"
          />
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-dark bg-bg-dark text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
            <span className="material-icons text-sm">search</span>
          </button>
        </div>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-info/20 bg-info/5 p-3">
        <div className="flex items-start gap-2">
          <span className="material-icons text-sm text-info mt-0.5">info</span>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ensure the connected account has appropriate permissions to read/write
            to the target spreadsheet before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}
