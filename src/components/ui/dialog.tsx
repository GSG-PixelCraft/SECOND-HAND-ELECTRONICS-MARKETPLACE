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

export interface DialogProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: DialogVariantProps["size"];
}

export const Dialog = React.forwardRef<HTMLDialogElement, DialogProps>(
  function Dialog(
    {
      open,
      onOpenChange,
      onClose,
      onCancel,
      size,
      children,
      className,
      ...props
    },
    ref,
  ) {
    const dialogRef = React.useRef<HTMLDialogElement | null>(null);

    React.useImperativeHandle(
      ref,
      () => dialogRef.current as HTMLDialogElement,
    );

    React.useEffect(() => {
      if (!dialogRef.current) return;

      const dialog = dialogRef.current;
      if (open && !dialog.open) {
        dialog.showModal();
      } else if (!open && dialog.open) {
        dialog.close();
      }
    }, [open]);

    const handleClose = React.useCallback(
      (event: React.SyntheticEvent<HTMLDialogElement>) => {
        onOpenChange?.(false);
        onClose?.(event);
      },
      [onOpenChange, onClose],
    );

    const handleCancel = React.useCallback(
      (event: React.SyntheticEvent<HTMLDialogElement>) => {
        onOpenChange?.(false);
        onCancel?.(event);
      },
      [onOpenChange, onCancel],
    );

    return (
      <>
        <dialog
          ref={dialogRef}
          className={`${dialogVariants({ size })} ${className ?? ""}`}
          onClose={handleClose}
          onCancel={handleCancel}
          {...props}
        >
          {children}
        </dialog>
      </>
    );
  },
);

Dialog.displayName = "Dialog";
