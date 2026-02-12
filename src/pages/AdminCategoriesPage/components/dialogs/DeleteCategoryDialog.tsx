import { AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export interface DeleteCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteCategoryDialog({
  open,
  onClose,
  onConfirm,
}: DeleteCategoryDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FDB022]/10">
          <AlertTriangle className="h-8 w-8 text-[#FDB022]" />
        </div>
      </div>

      <h2 className="text-neutral-90 mt-5 text-[28px] font-semibold leading-tight">
        Are you sure you want to delete this Category?
      </h2>

      <Text
        variant="body"
        className="text-neutral-60 mt-4 text-lg leading-snug"
      >
        Deleting this category may affect all linked products or listings.
        Please confirm to proceed.
      </Text>

      <div className="mt-7 space-y-3">
        <Button
          className="h-12 w-full rounded-xl border-none bg-error text-base font-medium text-white hover:bg-error/90"
          onClick={onConfirm}
        >
          Yes, Delete
        </Button>
        <Button
          intent="outline"
          className="border-neutral-30 text-neutral-60 h-12 w-full rounded-xl border text-base font-medium hover:bg-neutral-10"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Dialog>
  );
}
