import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === "function") {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

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
    // Prevents double onOpenChange(false) when cancel triggers close
    const ignoreNextCloseRef = React.useRef(false);

    React.useEffect(() => {
      if (open === undefined || !dialogRef.current) return;

      const dialog = dialogRef.current;
      if (open && !dialog.open) {
        // Lock body scroll when modal opens
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
        document.body.style.width = "100%";
        dialog.showModal();
      } else if (!open && dialog.open) {
        // Unlock body scroll when modal closes
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        dialog.close();
      }
      return () => {
        // Ensure body scroll is unlocked when component unmounts
        document.body.style.overflow = "auto";
        document.body.style.position = "static";
        if (dialog.open) {
          dialog.close();
        }
      };
    }, [open]);

    const handleClose = React.useCallback(
      (event: React.SyntheticEvent<HTMLDialogElement>) => {
        if (ignoreNextCloseRef.current) {
          ignoreNextCloseRef.current = false;
          onClose?.(event);
          return;
        }
        onOpenChange?.(false);
        onClose?.(event);
      },
      [onOpenChange, onClose],
    );

    const handleCancel = React.useCallback(
      (event: React.SyntheticEvent<HTMLDialogElement>) => {
        onCancel?.(event);
        if (event.defaultPrevented) return;
        ignoreNextCloseRef.current = true;
        onOpenChange?.(false);
      },
      [onOpenChange, onCancel],
    );

    const combinedRef = React.useMemo(() => mergeRefs(dialogRef, ref), [ref]);

    return (
      <dialog
        ref={combinedRef}
        className={clsx(dialogVariants({ size }), className)}
        onClose={handleClose}
        onCancel={handleCancel}
        {...props}
      >
        {children}
      </dialog>
    );
  },
);

Dialog.displayName = "Dialog";
