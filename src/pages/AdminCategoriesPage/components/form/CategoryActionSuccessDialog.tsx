import { BadgeCheck } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog/dialog";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";

export interface CategoryActionSuccessDialogProps {
  open: boolean;
  title: string;
  description: string;
  onDone: () => void;
}

export function CategoryActionSuccessDialog({
  open,
  title,
  description,
  onDone,
}: CategoryActionSuccessDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onDone();
      }}
      onCancel={(event) => event.preventDefault()}
      className="w-full max-w-md rounded-2xl border border-neutral-10 bg-white p-8 text-center backdrop:bg-black/50"
    >
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-8 w-8 text-success" />
        </div>
      </div>
      <h3 className="text-neutral-90 mt-5 text-lg font-semibold">{title}</h3>
      <Text variant="body" className="text-neutral-60 mt-3 text-sm">
        {description}
      </Text>
      <Button
        className="mt-7 h-12 w-full rounded-xl border-none bg-primary text-base font-medium text-white hover:bg-primary/90"
        onClick={onDone}
      >
        Done
      </Button>
    </Dialog>
  );
}
