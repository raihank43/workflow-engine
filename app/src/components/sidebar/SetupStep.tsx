import { useState, useEffect } from "react";
import { useWorkflowStore } from "@/stores/workflowStore";
import { useUIStore } from "@/stores/uiStore";
import { nodeConfigSpecs } from "@/constants/nodeConfigs";
import type { NodeType } from "@/types/workflow";
import DynamicField from "./DynamicField";

export default function SetupStep() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  const node = nodes.find((n) => n.id === selectedNodeId);
  const [values, setValues] = useState<Record<string, string>>({});

  const nodeType = node?.data.nodeType as NodeType | undefined;
  const spec = nodeType ? nodeConfigSpecs[nodeType]?.setup : null;

  // Initialize values from node config
  useEffect(() => {
    if (node) {
      const config = (node.data.config as Record<string, string>) || {};
      setValues({
        name: node.data.label || "",
        ...config,
      });
    }
  }, [node?.id]);

  if (!node || !spec) return null;

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === "name" && selectedNodeId) {
      updateNodeData(selectedNodeId, { label: value });
    }
    if (selectedNodeId) {
      const currentConfig = (node.data.config as Record<string, unknown>) || {};
      updateNodeData(selectedNodeId, {
        config: { ...currentConfig, [key]: value },
      });
    }
  };

  return (
    <div className="space-y-5">
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
          spec.infoBox.type === "info" ? "border-info/20 bg-info/5" :
          spec.infoBox.type === "tip" ? "border-primary/20 bg-primary/5" :
          "border-warning/20 bg-warning/5"
        }`}>
          <div className="flex items-start gap-2">
            <span className={`material-icons text-sm mt-0.5 ${
              spec.infoBox.type === "info" ? "text-info" :
              spec.infoBox.type === "tip" ? "text-primary" :
              "text-warning"
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
