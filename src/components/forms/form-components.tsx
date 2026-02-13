// src/components/forms/form-components.tsx
import type {
  FC,
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "@/components/ui/text";

export interface FormFieldProps {
  children: ReactNode;
  className?: string;
}

export const FormField: FC<FormFieldProps> = ({
  children,
  className,
}): ReactElement => {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>{children}</div>
  );
};

export interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: FC<FormLabelProps> = ({
  children,
  required,
  className,
  ...props
}): ReactElement => {
  return (
    <label
      className={twMerge("text-label text-neutral-foreground", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-error">*</span>}
    </label>
  );
};

export interface FormHelperTextProps extends HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormHelperText: FC<FormHelperTextProps> = ({
  children,
  className,
  ...props
}): ReactElement => {
  return (
    <Text
      variant="muted"
      className={twMerge("text-caption", className)}
      {...props}
    >
      {children}
    </Text>
  );
};

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormError: FC<FormErrorProps> = ({
  children,
  className,
  ...props
}): ReactElement => {
  if (!children) return <></>;

  return (
    <Text
      variant="error"
      className={twMerge("text-caption", className)}
      {...props}
    >
      {children}
    </Text>
  );
};

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormDescription: FC<FormDescriptionProps> = ({
  children,
  className,
  ...props
}): ReactElement => {
  return (
    <Text
      variant="muted"
      className={twMerge("text-caption", className)}
      {...props}
    >
      {children}
    </Text>
  );
};
