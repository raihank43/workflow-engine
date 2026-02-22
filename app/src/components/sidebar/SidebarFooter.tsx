import { useUIStore } from "@/stores/uiStore";

export default function SidebarFooter() {
  const currentStep = useUIStore((s) => s.currentStep);
  const nextStep = useUIStore((s) => s.nextStep);
  const prevStep = useUIStore((s) => s.prevStep);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 3;

  return (
    <div className="flex items-center justify-between border-t border-border-dark px-5 py-3">
      <button
        onClick={isFirstStep ? closeSidebar : prevStep}
        className="rounded-lg border border-border-dark px-4 py-2 text-xs font-medium text-body hover:bg-hover-bg hover:text-heading transition-colors"
      >
        {isFirstStep ? "Cancel" : "Back"}
      </button>

      <button
        onClick={isLastStep ? closeSidebar : nextStep}
        className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover active:scale-[0.98] transition-all"
      >
        {isLastStep ? "Finish & Save" : "Save & Continue"}
      </button>
    </div>
  );
}
