import type { ReactNode } from "react";
import { AdminBackButton } from "@/components/admin/ui/back-button/AdminBackButton";
import { Button } from "@/components/ui/button";

export interface CategoryFormLayoutProps {
  title: string;
  submitLabel: string;
  submitDisabled?: boolean;
  onBack: () => void;
  onSubmit: () => void;
  leftPanel: ReactNode;
  rightPanel: ReactNode;
}

export function CategoryFormLayout({
  title,
  submitLabel,
  submitDisabled = false,
  onBack,
  onSubmit,
  leftPanel,
  rightPanel,
}: CategoryFormLayoutProps) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-[1500px] space-y-6">
        <div className="flex items-center gap-3">
          <AdminBackButton
            onClick={onBack}
            className="h-9 w-9 border-none bg-transparent hover:bg-neutral-10"
          />
          <h1 className="text-[22px] font-semibold text-[#101010]">{title}</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[450px_1fr]">
          {leftPanel}
          {rightPanel}
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={submitDisabled}
            className="h-12 w-full max-w-[420px] rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90 disabled:opacity-60"
          >
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
