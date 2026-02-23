import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import { nodeConfigSpecs } from "@/constants/nodeConfigs";
import type { NodeType } from "@/types/workflow";
import DynamicField from "./DynamicField";

export default function ConfigStep() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const [values, setValues] = useState<Record<string, string>>({});

  const nodeType = node?.data.nodeType as NodeType | undefined;
  const spec = nodeType ? nodeConfigSpecs[nodeType]?.config : null;

  useEffect(() => {
    if (node) {
      const config = (node.data.config as Record<string, string>) || {};
      setValues(config);
    }
  }, [node?.id]);

  if (!node || !spec) return null;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (selectedNodeId) {
      const currentConfig = (node.data.config as Record<string, unknown>) || {};
      updateNodeData(selectedNodeId, {
        config: { ...currentConfig, [key]: value },
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Source indicator */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted">
          Source Data Node
        </label>
        <div className="flex items-center gap-3 rounded-lg border border-border-dark bg-bg-dark p-3">
          <span className="material-icons text-primary text-sm">bolt</span>
          <span className="text-sm font-medium italic text-heading">
            Previous Node (Auto-linked)
          </span>
        </div>
      </div>

      {/* Dynamic fields */}
      {spec.fields.map((field) => (
        <DynamicField
          key={field.key}
          field={field}
          value={values[field.key] || ""}
          onChange={(v) => handleChange(field.key, v)}
        />
      ))}

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
            <div>
              {spec.infoBox.type === "tip" && (
                <p className="text-xs font-semibold text-primary">Pro Tip</p>
              )}
              <p className="mt-0.5 text-xs text-body leading-relaxed">{spec.infoBox.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
