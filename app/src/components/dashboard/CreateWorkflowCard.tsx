import { useNavigate } from "react-router-dom";

export default function CreateWorkflowCard() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/workflow/new")}
      className="group flex min-h-50 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border-dark bg-transparent p-6 transition-all hover:border-primary/50 hover:bg-primary/5"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <span className="material-icons text-2xl">add</span>
      </div>
      <p className="mt-3 text-sm font-semibold text-body group-hover:text-heading transition-colors">
        New Automation
      </p>
      <p className="mt-1 text-xs text-muted">
        Start from scratch or use a template
      </p>
    </button>
  );
}
