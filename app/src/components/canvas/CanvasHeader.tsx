import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";

export default function CanvasHeader() {
  const navigate = useNavigate();
  const workflow = useWorkflowStore((s) => s.workflow);
  const updateWorkflowName = useWorkflowStore((s) => s.updateWorkflowName);
  const saveWorkflow = useWorkflowStore((s) => s.saveWorkflow);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(workflow.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setDraft(workflow.name); }, [workflow.name]);
  useEffect(() => { if (editing) inputRef.current?.select(); }, [editing]);

  const commitName = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== workflow.name) updateWorkflowName(trimmed);
    else setDraft(workflow.name);
    setEditing(false);
  };

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-dark bg-surface-dark px-4">
      <div className="flex items-center gap-3">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-body hover:bg-hover-bg-strong hover:text-heading transition-colors"
        >
          <span className="material-icons text-lg">arrow_back</span>
        </button>

        <div className="h-6 w-px bg-border-dark" />

        {/* Workflow info */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
            <span className="material-icons text-sm text-primary">bolt</span>
          </div>
          <div>
            {editing ? (
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitName}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitName();
                  if (e.key === "Escape") { setDraft(workflow.name); setEditing(false); }
                }}
                className="w-48 rounded border border-primary/40 bg-bg-dark px-2 py-0.5 text-sm font-semibold text-heading outline-none focus:ring-1 focus:ring-primary/30"
              />
            ) : (
              <h1
                onClick={() => setEditing(true)}
                className="cursor-pointer text-sm font-semibold text-heading hover:text-primary transition-colors"
                title="Click to rename"
              >
                {workflow.name}
                <span className="material-icons ml-1 align-middle text-xs text-muted">edit</span>
              </h1>
            )}
            <p className="text-[10px] text-muted">
              Last saved {workflow.lastSaved.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-body hover:bg-hover-bg-strong hover:text-heading transition-colors"
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="material-icons text-lg">
            {theme === "dark" ? "light_mode" : "dark_mode"}
          </span>
        </button>
        <button
          onClick={saveWorkflow}
          className="flex items-center gap-1.5 rounded-lg border border-border-dark bg-surface-dark px-3 py-1.5 text-xs font-medium text-body hover:text-heading transition-colors"
          title="Save workflow"
        >
          <span className="material-icons text-sm">save</span>
          Save
        </button>
        <button className="rounded-lg border border-border-dark bg-surface-dark px-3 py-1.5 text-xs font-medium text-body hover:text-heading transition-colors">
          Draft
        </button>
        <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all">
          Publish
        </button>
      </div>
    </header>
  );
}
