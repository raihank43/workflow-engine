import { useReactFlow } from "@xyflow/react";
import { useState } from "react";

export default function CanvasControls() {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    zoomIn();
    setZoom(Math.round(getZoom() * 100));
  };

  const handleZoomOut = () => {
    zoomOut();
    setZoom(Math.round(getZoom() * 100));
  };

  const handleFitView = () => {
    fitView({ padding: 0.2 });
    setTimeout(() => setZoom(Math.round(getZoom() * 100)), 100);
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 rounded-lg border border-border-dark bg-surface-dark/90 p-1 backdrop-blur-md shadow-lg">
      <button
        onClick={handleZoomOut}
        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        title="Zoom out"
      >
        <span className="material-icons text-sm">remove</span>
      </button>

      <span className="min-w-10 text-center text-[11px] font-medium text-slate-400">
        {zoom}%
      </span>

      <button
        onClick={handleZoomIn}
        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        title="Zoom in"
      >
        <span className="material-icons text-sm">add</span>
      </button>

      <div className="h-5 w-px bg-border-dark" />

      <button
        onClick={handleFitView}
        className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
        title="Fit view"
      >
        <span className="material-icons text-sm">fit_screen</span>
      </button>
    </div>
  );
}
