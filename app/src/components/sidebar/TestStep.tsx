import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import { nodeConfigSpecs } from "@/constants/nodeConfigs";
import type { NodeType } from "@/types/workflow";
import DynamicField from "./DynamicField";

export default function TestStep() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const nodeType = node?.data.nodeType as NodeType | undefined;
  const spec = nodeType ? nodeConfigSpecs[nodeType]?.test : null;

  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testValues, setTestValues] = useState<Record<string, string>>({});

  useEffect(() => {
    setHasRun(false);
    setIsRunning(false);
    setTestValues({});
  }, [node?.id]);

  const handleRunTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 1500);
  };

  if (!node || !spec) return null;

  const mockResult = generateMockResult(nodeType!);

  return (
    <div className="space-y-5">
      {/* Test Data Section */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
          TEST DATA
        </p>
        <p className="mt-1 text-xs text-body leading-relaxed">
          {spec.subtitle || "Run a test to verify the node configuration works as expected."}
        </p>
      </div>

      {/* Test input fields from spec */}
      {spec.fields.length > 0 && (
        <div className="space-y-4">
          {spec.fields.map((field) => (
            <DynamicField
              key={field.key}
              field={field}
              value={testValues[field.key] || ""}
              onChange={(v) => setTestValues((prev) => ({ ...prev, [field.key]: v }))}
            />
          ))}
        </div>
      )}

      {/* Run button */}
      <button
        onClick={handleRunTest}
        disabled={isRunning}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="material-icons text-lg">
          {isRunning ? "hourglass_top" : "play_arrow"}
        </span>
        {isRunning ? "Running Test..." : "Run Test"}
      </button>

      {/* Test Results */}
      {hasRun && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">
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
              <code>{formatJson(mockResult)}</code>
            </pre>
            <button
              onClick={() =>
                navigator.clipboard.writeText(JSON.stringify(mockResult, null, 2))
              }
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded border border-border-dark bg-surface-dark text-muted opacity-0 group-hover:opacity-100 hover:text-heading transition-all"
            >
              <span className="material-icons text-sm">content_copy</span>
            </button>
          </div>

          {/* Connection Summary */}
          <div className="flex items-center gap-2 rounded-lg border border-success/20 bg-success/5 p-3">
            <span className="material-icons text-success">check_circle</span>
            <p className="text-xs text-body">
              {node.data.label} executed successfully.
            </p>
          </div>
        </div>
      )}

      {spec.infoBox && (
        <div className={`rounded-lg border p-3 ${
          spec.infoBox.type === "tip" ? "border-primary/20 bg-primary/5" :
          spec.infoBox.type === "warning" ? "border-warning/20 bg-warning/5" :
          "border-info/20 bg-info/5"
        }`}>
          <div className="flex items-start gap-2">
            <span className={`material-icons text-sm mt-0.5 ${
              spec.infoBox.type === "tip" ? "text-primary" :
              spec.infoBox.type === "warning" ? "text-warning" :
              "text-info"
            }`}>
              {spec.infoBox.type === "tip" ? "lightbulb" : spec.infoBox.type === "warning" ? "warning" : "info"}
            </span>
            <p className="text-xs text-body leading-relaxed">{spec.infoBox.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Generate mock test result based on node type ───
function generateMockResult(nodeType: NodeType): Record<string, unknown> {
  const results: Record<string, Record<string, unknown>> = {
    trigger: { status: "received", event: "webhook_event", timestamp: "2025-01-15T10:30:00Z", payload: { user_id: "usr_123", action: "signup" } },
    action: { status: "completed", action: "send_notification", result: { delivered: true, recipient: "user@example.com" } },
    condition: { evaluated: true, condition: "amount > 100", result: true, branch: "true_path" },
    filter: { input_records: 50, filtered_records: 12, criteria: "status == active" },
    ifelse: { condition: "user.role === 'admin'", result: true, branch: "if_branch" },
    switch: { input: "premium", matched_case: "case_2", output_branch: "premium_handler" },
    loop: { iterations: 5, completed: 5, results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
    delay: { delayed_ms: 5000, resumed_at: "2025-01-15T10:30:05Z", status: "completed" },
    merge: { sources: 3, merged_records: 15, strategy: "concat" },
    transform: { input_fields: 8, output_fields: 5, transformations_applied: 3 },
    http_request: { status_code: 200, method: "GET", url: "https://api.example.com/data", response: { items: 10 } },
    error_handler: { error_caught: "TimeoutError", retry_count: 2, resolved: true },
    schedule: { cron: "0 9 * * 1-5", next_run: "2025-01-16T09:00:00Z", timezone: "UTC" },
  };
  return results[nodeType] || { status: "ok", message: "Test completed" };
}

// ─── JSON Formatter with colored spans ───
function formatJson(obj: unknown): React.ReactNode {
  const json = JSON.stringify(obj, null, 2);
  const parts = json.split(/("(?:[^"\\]|\\.)*")/g);

  return parts.map((part, i) => {
    if (part.startsWith('"') && part.endsWith('"')) {
      const nextPart = parts[i + 1];
      if (nextPart && nextPart.trimStart().startsWith(":")) {
        return <span key={i} className="text-info">{part}</span>;
      }
      return <span key={i} className="text-success">{part}</span>;
    }
    const withNumbers = part.replace(/\b(\d+\.?\d*)\b/g, "<NUM>$1</NUM>");
    if (withNumbers.includes("<NUM>")) {
      const numParts = withNumbers.split(/(<NUM>.*?<\/NUM>)/g);
      return numParts.map((np, j) => {
        const match = np.match(/<NUM>(.*?)<\/NUM>/);
        if (match) return <span key={`${i}-${j}`} className="text-warning">{match[1]}</span>;
        return <span key={`${i}-${j}`} className="text-primary">{np}</span>;
      });
    }
    return <span key={i} className="text-primary">{part}</span>;
  });
}
