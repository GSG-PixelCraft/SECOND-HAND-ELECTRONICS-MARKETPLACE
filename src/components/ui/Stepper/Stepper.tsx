import { Check } from "lucide-react";

type Step = {
  id: number;
  label: string;
};

type StepperProps = {
  allSteps?: Step[];
  currentStep: number;
};
export function Stepper({ allSteps, currentStep }: StepperProps) {
  const steps: Step[] =
    allSteps && allSteps.length > 0
      ? allSteps
      : [
          { id: 1, label: "Basic Details" },
          { id: 2, label: "More Details" },
        ];
  return (
    <div className="flex w-full items-center">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;

        return (
          <div key={step.id} className="flex w-full items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium ${
                isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : isActive
                    ? "border-primary text-primary"
                    : "border-[hsl(var(--border))] text-neutral"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : step.id}
            </div>

            <h5
              className={`text-foreground ml-2 whitespace-nowrap font-normal`}
            >
              {step.label}
            </h5>

            {index !== steps.length - 1 && (
              <div className={`mx-4 h-px flex-1 bg-[hsl(var(--border))]`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
