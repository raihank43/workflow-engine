interface CanvasLegendProps {
  nodeCount: number;
  activeCount: number;
}

export default function CanvasLegend({ nodeCount, activeCount }: CanvasLegendProps) {
  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-lg border border-border-dark bg-surface-dark/90 px-4 py-2 text-[11px] backdrop-blur-md shadow-lg">
      <span className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        <span className="font-medium text-success">Live</span>
      </span>

      <span className="text-border-dark">|</span>

      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-slate-500" />
        <span className="font-medium text-slate-400">Draft</span>
      </span>

      <span className="text-border-dark">|</span>

      <span className="font-medium text-slate-400">
        {activeCount} / {nodeCount} Nodes Active
      </span>
    </div>
  );
}
