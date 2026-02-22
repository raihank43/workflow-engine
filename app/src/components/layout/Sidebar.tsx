import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: "bolt", label: "Workflows", path: "/" },
  { icon: "cable", label: "Connections", path: "/connections" },
  { icon: "history", label: "History", path: "/history" },
  { icon: "settings", label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="flex w-64 flex-col border-r border-border-dark bg-bg-dark-deep">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <span className="material-icons text-white text-lg">bolt</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-heading">
          FlowStream
        </span>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "sidebar-item-active"
                  : "text-body hover:bg-hover-bg hover:text-heading"
              )}
            >
              <span className="material-icons text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-border-dark p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
            <span className="text-sm font-semibold text-primary">RK</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-heading">Raihan K.</span>
            <span className="text-xs text-muted">Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
