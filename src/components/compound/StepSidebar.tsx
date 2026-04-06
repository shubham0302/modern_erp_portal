import { cn } from "@/utils/helpers";
import { ArrowLeft, ArrowRight, Check, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { useToggle } from "@/hooks/useToggle";
import Sheet from "./Sheet";
import { IconButton } from "../base/IconButton";

export interface Step {
  id: string;
  title: string;
  description: string;
  hasError?: boolean;
}

interface StepSidebarProps {
  steps: Step[];
  currentStep: string;
  onStepClick: (stepId: string) => void;
  title?: string;
  className?: string;
  children?: ReactNode;
  direction?: "vertical" | "horizontal";
}

const StepSidebar: React.FC<StepSidebarProps> = ({
  steps,
  currentStep,
  onStepClick,
  title,
  className,
  children,
  direction = "vertical",
}) => {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
  const sheet = useToggle();

  const currentStepData = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;
  const isHorizontal = direction == "horizontal";

  const handleNextStep = () => {
    // Edge case: No steps available
    if (!steps || steps.length === 0) return;

    // Edge case: Current step not found
    if (currentStepIndex === -1) return;

    // Edge case: Already on last step
    if (isLastStep) return;

    // Navigate to next step
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      onStepClick(nextStep.id);
    }
  };

  const handlePreviousStep = () => {
    // Edge case: No steps available
    if (!steps || steps.length === 0) return;

    // Edge case: Current step not found
    if (currentStepIndex === -1) return;

    // Edge case: Already on first step
    if (isFirstStep) return;

    // Navigate to previous step
    const previousStep = steps[currentStepIndex - 1];
    if (previousStep) {
      onStepClick(previousStep.id);
    }
  };

  const renderStepList = () => (
    <div className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentStepIndex;

        return (
          <button
            key={step.id}
            type="button"
            onClick={() => {
              onStepClick(step.id);
              sheet.close();
            }}
            className={cn(
              "hover:bg-nl-100 dark:hover:bg-nd-700 flex cursor-pointer items-start gap-3 rounded-xl p-3 text-left transition-colors",
              isActive && "bg-nl-100 dark:bg-nd-700",
            )}
          >
            <div
              className={cn(
                "fall size-8 shrink-0 rounded-full text-sm font-medium transition-colors",
                isCompleted && "bg-pl-500 dark:bg-pd-500 text-white shadow-sm",
                isActive &&
                  !isCompleted &&
                  !step.hasError &&
                  "bg-pl-500 dark:bg-pd-500 text-white shadow-sm",
                !isActive &&
                  !isCompleted &&
                  !step.hasError &&
                  "bg-nl-200 dark:bg-nd-600 text-nl-600 dark:text-nd-300",
                step.hasError && "bg-dl-400 dark:bg-dd-500 text-white",
              )}
            >
              {isCompleted ? (
                <Check size={16} className="text-white" />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            <div className="flex-1">
              <h6
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && !step.hasError && "text-nl-800 dark:text-nd-100",
                  !isActive && !step.hasError && "text-nl-600 dark:text-nd-200",
                  step.hasError && "text-dl-400 dark:text-dd-400",
                )}
              >
                {step.title}
              </h6>
              <p
                className={cn(
                  "text-nl-500 dark:text-nd-300 mt-0.5 text-xs",
                  step.hasError && "text-dl-400 dark:text-dd-400",
                )}
              >
                {step.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderHorizontalStepList = () => (
    <div className="flex w-full items-start">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < currentStepIndex;
        const isLastItem = index === steps.length - 1;

        return (
          <div
            key={step.id}
            className="relative flex flex-1 flex-col items-center gap-3"
          >
            <div className="relative flex w-full items-center justify-center">
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="group bg-nl-50 dark:bg-nd-800 relative z-10"
              >
                <div
                  className={cn(
                    "fall size-8 rounded-full text-base font-medium transition-all duration-300",
                    isCompleted &&
                      "bg-pl-500 dark:bg-pd-500 text-white shadow-sm",
                    isActive &&
                      !isCompleted &&
                      !step.hasError &&
                      "bg-pl-500 dark:bg-pd-500 text-white shadow-sm",
                    !isActive &&
                      !isCompleted &&
                      !step.hasError &&
                      "bg-nl-200 dark:bg-nd-600 text-nl-600 dark:text-nd-300 group-hover:bg-nl-300 dark:group-hover:bg-nd-500",
                    step.hasError && "bg-dl-400 dark:bg-dd-500 text-white",
                  )}
                >
                  {isCompleted ? (
                    <Check size={16} className="text-white" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
              </button>
              {!isLastItem && (
                <div
                  className={cn(
                    "absolute top-1/2 left-1/2 h-0.5 w-full -translate-y-1/2 transition-all duration-300",
                    isCompleted
                      ? "bg-pl-500 dark:bg-pd-500"
                      : "bg-nl-200 dark:bg-nd-600",
                    isActive && "opacity-50",
                  )}
                />
              )}
            </div>
            <button
              type="button"
              onClick={() => onStepClick(step.id)}
              className="text-center"
            >
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive && !step.hasError && "text-nl-800 dark:text-nd-100",
                  isCompleted &&
                    !step.hasError &&
                    "text-nl-600 dark:text-nd-200",
                  !isActive &&
                    !isCompleted &&
                    !step.hasError &&
                    "text-nl-600 dark:text-nd-200",
                  step.hasError && "text-dl-400 dark:text-dd-400",
                )}
              >
                {step.title}
              </p>
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop View - Vertical (Sidebar) */}
      {!isHorizontal && (
        <div
          className={cn(
            "bg-nl-50 dark:bg-nd-800 hidden w-80 flex-col gap-2 rounded-xl p-6 lg:flex",
            className,
          )}
        >
          {title && (
            <h5 className="text-nl-800 dark:text-nd-100 mb-4">{title}</h5>
          )}
          {renderStepList()}
          {children}
        </div>
      )}

      {/* Desktop View - Horizontal (Stepper) */}
      {isHorizontal && (
        <div
          className={cn(
            "bg-nl-50 dark:bg-nd-800 hidden w-full rounded-xl p-3 lg:block",
            className,
          )}
        >
          {renderHorizontalStepList()}
          {children && <div className="mt-6">{children}</div>}
        </div>
      )}

      {/* Mobile View - Hidden on desktop */}
      <div
        className={cn(
          "bg-nl-50 dark:bg-nd-800 flex items-center gap-1 rounded-xl py-4 pr-3 pl-1 lg:hidden",
          className,
        )}
      >
        <button
          onClick={sheet.open}
          type="button"
          className="hover:bg-nl-100 dark:hover:bg-nd-700 flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors"
        >
          <Menu size={20} className="text-nl-700 dark:text-nd-200" />
        </button>
        <div className="flex flex-1 flex-col gap-0.5">
          {title && (
            <h6 className="text-nl-800 dark:text-nd-100 text-sm font-medium">
              {title}
            </h6>
          )}
          <p className="text-nl-500 dark:text-nd-400 text-xs">
            Step {currentStepIndex + 1} of {steps.length}
            {currentStepData && `: ${currentStepData.title}`}
          </p>
        </div>
        <IconButton
          icon={ArrowLeft}
          onClick={handlePreviousStep}
          disabled={isFirstStep}
        />
        <IconButton
          icon={ArrowRight}
          onClick={handleNextStep}
          disabled={isLastStep}
        />
      </div>

      {/* Mobile Sheet */}
      <Sheet
        isOpen={sheet.isOpen}
        close={sheet.close}
        title={title || "Steps"}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {renderStepList()}
          {children}
        </div>
      </Sheet>
    </>
  );
};

export default StepSidebar;
