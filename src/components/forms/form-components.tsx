// src/components/forms/form-components.tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "@/components/ui/text";

export interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  className,
}): React.ReactElement => {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>{children}</div>
  );
};

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required,
  className,
  ...props
}): React.ReactElement => {
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

export interface FormHelperTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({
  children,
  className,
  ...props
}): React.ReactElement => {
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

export interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormError: React.FC<FormErrorProps> = ({
  children,
  className,
  ...props
}): React.ReactElement => {
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

export interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id?: string;
}

export const FormDescription: React.FC<FormDescriptionProps> = ({
  children,
  className,
  ...props
}): React.ReactElement => {
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
