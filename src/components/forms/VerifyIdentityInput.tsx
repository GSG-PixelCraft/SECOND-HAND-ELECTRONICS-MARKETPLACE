import React, { useRef } from "react";
import { Upload, FileImage, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifyIdentityInputProps {
  label: string;
  helperText?: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  error?: string;
}

export const VerifyIdentityInput: React.FC<VerifyIdentityInputProps> = ({
  label,
  helperText,
  value,
  onChange,
  error,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label className="text-bodySmall text-neutral-80 font-medium">
        {label}
      </label>
      {helperText && (
        <p className="text-caption text-muted-foreground">{helperText}</p>
      )}

      <div
        className={cn(
          "relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 transition-colors",
          error
            ? "border-error bg-error/5"
            : "border-neutral-30 bg-neutral-5 hover:border-primary hover:bg-primary/5",
          value && "border-solid border-primary bg-primary/5",
        )}
        onClick={!value ? handleClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value ? (
          <div className="flex w-full items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" />
              <span className="text-bodySmall truncate font-medium">
                {value.name}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="rounded-full p-1 hover:bg-neutral-10"
            >
              <X className="text-neutral-60 h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="text-neutral-40 h-8 w-8" />
            <div className="text-bodySmall">
              <span className="font-medium text-primary">Click to upload</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </div>
            <p className="text-caption text-muted-foreground">
              PNG, JPG up to 10MB
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
};
