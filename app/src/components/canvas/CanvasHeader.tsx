import { useNavigate } from "react-router-dom";
import { useWorkflowStore } from "@/stores/workflowStore";

export default function CanvasHeader() {
  const navigate = useNavigate();
  const workflow = useWorkflowStore((s) => s.workflow);

  return (
    <header className="flex h-14 items-center justify-between border-b border-border-dark bg-bg-dark-deep/90 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
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
            <h1 className="text-sm font-semibold text-white">
              {workflow.name}
            </h1>
            <p className="text-[10px] text-slate-500">
              Last saved {workflow.lastSaved.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="rounded-lg border border-border-dark bg-surface-dark px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors">
          Draft
        </button>
        <button className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all">
          Publish
        </button>
      </div>
    </header>
  );
}
