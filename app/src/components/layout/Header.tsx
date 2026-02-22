import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/stores/uiStore";

export default function Header() {
  const navigate = useNavigate();
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-dark bg-bg-dark-deep/80 px-6 backdrop-blur-md">
      {/* Search */}
      <div className="relative w-96">
        <span className="material-icons absolute left-3 top-1/2 -translate-y-1/2 text-muted text-lg">
          search
        </span>
        <input
          type="text"
          placeholder="Search workflows, connections..."
          className="w-full rounded-lg border border-border-dark bg-surface-dark py-2 pl-10 pr-4 text-sm text-body placeholder:text-muted outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-colors"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border-dark bg-surface-dark text-body hover:text-heading transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="material-icons text-lg">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Notification */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border-dark bg-surface-dark text-body hover:text-heading transition-colors">
          <span className="material-icons text-lg">notifications</span>
          <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-error border-2 border-bg-dark-deep" />
        </button>

        {/* Create Workflow */}
        <button
          onClick={() => navigate("/workflow/new")}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all"
        >
          <span className="material-icons text-lg">add</span>
          Create Workflow
        </button>
      </div>
    </header>
  );
}
