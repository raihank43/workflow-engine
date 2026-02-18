import { useUIStore } from "@/stores/uiStore";
import { useWorkflowStore } from "@/stores/workflowStore";
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

  const stepTitles = {
    1: "Setup Node",
    2: "Configure Node",
    3: "Test Step",
  };

  const stepSubtitles = {
    1: "Configure basic node settings",
    2: "Map data between nodes",
    3: "Verify node configuration",
  };

  const stepIcons = {
    1: "settings",
    2: "tune",
    3: "play_circle",
  };

  return (
    <div className="flex w-96 flex-col border-l border-border-dark bg-bg-dark-deep animate-slide-in-right">
      {/* Header */}
      <div className="border-b border-border-dark px-5 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20">
              <span className="material-icons text-lg text-primary">
                {stepIcons[currentStep]}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                {stepTitles[currentStep]}
              </h2>
              <p className="text-[11px] text-slate-500">
                {stepSubtitles[currentStep]}
              </p>
            </div>
          </div>
          <button
            onClick={closeSidebar}
            className="flex h-7 w-7 items-center justify-center rounded text-slate-500 hover:bg-white/5 hover:text-white transition-colors"
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
