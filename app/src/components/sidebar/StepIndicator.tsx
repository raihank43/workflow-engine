import { cn } from "@/lib/utils";
import type { ConfigStep } from "@/types/workflow";

interface StepIndicatorProps {
  currentStep: ConfigStep;
  onStepClick?: (step: ConfigStep) => void;
}

const steps = [
  { step: 1 as ConfigStep, label: "Setup" },
  { step: 2 as ConfigStep, label: "Config" },
  { step: 3 as ConfigStep, label: "Test" },
];

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-3">
      {steps.map(({ step, label }, idx) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={step} className="flex items-center gap-3">
            <button
              onClick={() => onStepClick?.(step)}
              className={cn(
                "flex items-center gap-2 transition-colors",
                (isActive || isCompleted) ? "cursor-pointer" : "cursor-default"
              )}
            >
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold transition-all",
                  isActive &&
                    "bg-primary text-white shadow-lg shadow-primary/40",
                  isCompleted && "bg-primary text-white",
                  !isActive && !isCompleted && "bg-inactive-bg text-muted"
                )}
              >
                {isCompleted ? (
                  <span className="material-icons text-xs">check</span>
                ) : (
                  step
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive && "text-heading font-semibold",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted"
                )}
              >
                {label}
              </span>
            </button>

            {idx < steps.length - 1 && (
              <div
                className={cn(
                  "h-px w-8",
                  step < currentStep ? "bg-primary" : "bg-border-dark"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
