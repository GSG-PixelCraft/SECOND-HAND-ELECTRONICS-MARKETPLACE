import { BadgeCheck } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export interface DeleteCategorySuccessDialogProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteCategorySuccessDialog({
  open,
  onClose,
}: DeleteCategorySuccessDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
      onCancel={(event) => event.preventDefault()}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-8 w-8 text-success" />
        </div>
      </div>

      <h3 className="text-neutral-90 mt-5 text-lg font-semibold">
        Category Deleted Successfully
      </h3>
      <Text variant="body" className="text-neutral-60 mt-3 text-sm">
        The category has been removed and linked products/listings were updated
        accordingly.
      </Text>

      <Button
        onClick={onClose}
        className="mt-7 h-12 w-full rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
      >
        Done
      </Button>
    </Dialog>
  );
}
