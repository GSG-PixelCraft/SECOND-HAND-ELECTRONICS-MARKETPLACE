// src/pages/AddListingPage/components/StepIndicator.tsx
import * as React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ id: number; label: string }>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}): React.ReactElement => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div className="flex h-full shrink-0 items-center justify-center py-3">
                <div className="h-0.5 w-[157px] rounded-[10px] bg-[#e4e4e4]" />
              </div>
            )}
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-[30px] border border-solid px-[23px] py-[3px] ${
                  step.id === currentStep
                    ? "border-[#2563eb] bg-white"
                    : "border-[rgba(37,99,235,0.1)] bg-white"
                }`}
              >
                <p
                  className={`font-['Poppins'] text-sm leading-normal ${
                    step.id === currentStep
                      ? "text-[#2563eb]"
                      : "text-[#828282]"
                  }`}
                >
                  {step.id}
                </p>
              </div>
              <p
                className={`text-center font-['Poppins'] text-xl leading-normal ${
                  step.id === currentStep ? "text-[#3d3d3d]" : "text-[#828282]"
                }`}
              >
                {step.label}
              </p>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
