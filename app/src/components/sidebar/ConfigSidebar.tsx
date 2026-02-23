import { useUIStore } from "@/stores/uiStore";
import { useWorkflowStore } from "@/stores/workflowStore";
import { nodeConfigSpecs } from "@/constants/nodeConfigs";
import type { NodeType } from "@/types/workflow";
import StepIndicator from "./StepIndicator";
import SetupStep from "./SetupStep";
import ConfigStep from "./ConfigStep";
import TestStep from "./TestStep";
import SidebarFooter from "./SidebarFooter";

export default function ConfigSidebar() {
  const currentStep = useUIStore((s) => s.currentStep);
  const setStep = useUIStore((s) => s.setStep);
  const closeSidebar = useUIStore((s) => s.closeSidebar);
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);

  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) return null;

  const nodeType = node.data.nodeType as NodeType;
  const spec = nodeConfigSpecs[nodeType];

  const fallback = {
    setup: { title: "Setup Node", subtitle: "Configure basic settings", icon: "settings" },
    config: { title: "Configure Node", subtitle: "Map data between nodes", icon: "tune" },
    test: { title: "Test Step", subtitle: "Verify configuration", icon: "play_circle" },
  };

  const stepKey = currentStep === 1 ? "setup" : currentStep === 2 ? "config" : "test";
  const stepSpec = spec?.[stepKey] || fallback[stepKey];

  return (
    <div className="flex w-96 flex-col border-l border-border-dark bg-bg-dark-deep animate-slide-in-right">
      {/* Header */}
      <div className="border-b border-border-dark px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
              <span className="material-icons text-lg text-primary">
                {stepSpec.icon}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-heading">
                {stepSpec.title}
              </h2>
              <p className="text-[11px] text-muted">
                {stepSpec.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="flex h-7 w-7 items-center justify-center rounded text-muted hover:bg-hover-bg hover:text-heading transition-colors"
          >
            <span className="material-icons text-sm">close</span>
          </button>
        </div>

        <div className="mt-4">
          <StepIndicator currentStep={currentStep} onStepClick={setStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4">
        {currentStep === 1 && <SetupStep />}
        {currentStep === 2 && <ConfigStep />}
        {currentStep === 3 && <TestStep />}
      </div>

      {/* Footer */}
      <SidebarFooter />
    </div>
  );
}
