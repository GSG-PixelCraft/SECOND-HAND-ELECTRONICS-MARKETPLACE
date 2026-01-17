import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const dialogVariants = cva(
  [
    "fixed",
    "top-1/2 left-1/2",
    "-translate-x-1/2 -translate-y-1/2",
    "bg-white",
    "rounded-lg",
    "shadow-lg",
    "border",
    "border-neutral-20",
    "p-5",
    "max-w-md",
    "w-full",
    "z-50",
  ],
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type DialogVariantProps = VariantProps<typeof dialogVariants>;

export interface DialogProps extends React.HTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onClose?: () => void;
  size?: DialogVariantProps["size"];
}

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog({ open, onClose, size, children, className, ...props }, ref) {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => dialogRef.current as HTMLDialogElement,
    );

    React.useEffect(() => {
      if (!dialogRef.current) return;

      if (open) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }, [open]);

    return (
      <>
        {open && (
          <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
        )}

        <dialog
          ref={dialogRef}
          className={`${dialogVariants({ size })} ${className ?? ""}`}
          onCancel={onClose}
          {...props}
        >
          {children}
        </dialog>
      </>
    );
  },
);

Dialog.displayName = "Dialog";
