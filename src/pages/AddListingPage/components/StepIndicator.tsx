// src/pages/AddListingPage/components/StepIndicator.tsx
import * as React from "react";
import { Stepper } from "@/components/ui/Stepper";

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ id: number; label: string }>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}): React.ReactElement => {
  return (
    <div className="mt-6 flex flex-col items-start gap-4">
      <Stepper allSteps={steps} currentStep={currentStep} />
    </div>
  );
};
