import type { StatCardData } from "@/types/workflow";
import { cn } from "@/lib/utils";

interface StatCardProps extends StatCardData {}

function StatCard({ label, value, valueColor, indicator, indicatorLabel }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border-dark bg-surface-dark p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className={cn("text-2xl font-bold", valueColor || "text-white")}>
          {value}
        </span>
        {indicator === "pulse" && (
          <span className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
            </span>
            {indicatorLabel && (
              <span className="text-xs font-medium text-success">
                {indicatorLabel}
              </span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

interface StatsOverviewProps {
  stats: StatCardData[];
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
