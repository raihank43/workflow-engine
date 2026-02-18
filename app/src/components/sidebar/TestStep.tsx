import { useState } from "react";
import { mockTestResultSuccess } from "@/data/mockTestResults";

export default function TestStep() {
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };

  return (
    <div className="space-y-5">
      {/* Test Data Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          TEST DATA
        </p>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed">
          Run a test to verify the node configuration works as expected with
          sample data.
        </p>
        <button
          onClick={handleRunTest}
          disabled={isRunning}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="material-icons text-lg">
            {isRunning ? "hourglass_top" : "play_arrow"}
          </span>
          {isRunning ? "Running Test..." : "Run Test"}
        </button>
      </div>

      {/* Test Results */}
      {hasRun && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              TEST RESULTS
            </p>
            <span className="flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-0.5 text-[10px] font-bold text-success">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              SUCCESS
            </span>
          </div>

          {/* JSON Viewer */}
          <div className="group relative rounded-xl border border-primary/10 bg-bg-dark-deep p-4">
            <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed custom-scrollbar">
              <code>
                {formatJson(mockTestResultSuccess)}
              </code>
            </pre>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(mockTestResultSuccess, null, 2)
                )
              }
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded border border-border-dark bg-surface-dark text-slate-500 opacity-0 group-hover:opacity-100 hover:text-white transition-all"
            >
              <span className="material-icons text-sm">content_copy</span>
            </button>
          </div>

          {/* Connection Summary */}
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3">
            <span className="material-icons text-success">check_circle</span>
            <p className="text-xs text-slate-300">
              Connection to Slack verified successfully.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter with colored spans ───
function formatJson(obj: unknown): React.ReactNode {
  const json = JSON.stringify(obj, null, 2);
  // Simple syntax highlighting
  const parts = json.split(/("(?:[^"\\]|\\.)*")/g);

  return parts.map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      // Check if it's a key (followed by :)
      const nextPart = parts[i + 1];
      if (nextPart && nextPart.trimStart().startsWith(":")) {
        return (
          <span key={i} className="text-info">
            {part}
          </span>
        );
      }
      return (
        <span key={i} className="text-success">
          {part}
        </span>
      );
    }
    // Highlight numbers
    const withNumbers = part.replace(
      /\b(\d+\.?\d*)\b/g,
      '<NUM>$1</NUM>'
    );
    if (withNumbers.includes('<NUM>')) {
      const numParts = withNumbers.split(/(<NUM>.*?<\/NUM>)/g);
      return numParts.map((np, j) => {
        const match = np.match(/<NUM>(.*?)<\/NUM>/);
        if (match) {
          return (
            <span key={`${i}-${j}`} className="text-warning">
              {match[1]}
            </span>
          );
        }
        return (
          <span key={`${i}-${j}`} className="text-primary">
            {np}
          </span>
        );
      });
    }
    return (
      <span key={i} className="text-primary">
        {part}
      </span>
    );
  });
}
