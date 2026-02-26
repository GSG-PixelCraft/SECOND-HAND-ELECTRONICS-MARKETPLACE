// src/pages/AddListingPage/components/StepIndicator.tsx
import { Fragment } from "react";
import type { FC, ReactElement } from "react";
import { Text } from "@/components/ui/Text/text";

interface StepIndicatorProps {
  currentStep: number;
  steps: Array<{ id: number; label: string }>;
}

export const StepIndicator: FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}): ReactElement => {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            {index > 0 && (
              <div className="flex h-full shrink-0 items-center justify-center py-3">
                <div className="h-[2px] w-[157px] rounded-[10px] bg-[#e4e4e4]" />
              </div>
            )}
            <div className="flex shrink-0 items-center gap-2">
              <div
                className={`flex size-8 shrink-0 items-center justify-center rounded-[30px] border border-solid ${
                  step.id < currentStep
                    ? "border-[#2563eb] bg-[#2563eb]"
                    : "border-[#2563eb] bg-white"
                }`}
              >
                {step.id < currentStep ? (
                  <svg
                    className="size-4 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <Text className="font-['Poppins'] text-[14px] font-normal leading-normal text-[#2563eb]">
                    {step.id}
                  </Text>
                )}
              </div>
              <Text className="text-center font-['Poppins'] text-[20px] font-normal leading-normal text-[#3d3d3d]">
                {step.label}
              </Text>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
