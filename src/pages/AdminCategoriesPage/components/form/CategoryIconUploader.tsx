import { useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { Plus, X } from "lucide-react";

export interface CategoryIconUploaderProps {
  iconUrl?: string;
  onSelect: (file: File, previewUrl: string) => void;
  onRemove: () => void;
}

const MAX_ICON_SIZE = 5 * 1024 * 1024;

export function CategoryIconUploader({
  iconUrl,
  onSelect,
  onRemove,
}: CategoryIconUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    const lowerName = file.name.toLowerCase();
    const isValidType =
      lowerName.endsWith(".png") || lowerName.endsWith(".svg");

    if (!isValidType) {
      setError("Please upload a PNG or SVG file.");
      return;
    }

    if (file.size > MAX_ICON_SIZE) {
      setError("Icon size must be less than 5MB.");
      return;
    }

    setError(null);
    onSelect(file, URL.createObjectURL(file));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    processFile(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    processFile(file);
  };

  if (iconUrl) {
    return (
      <div className="space-y-2">
        <div className="relative h-[200px] overflow-hidden rounded-xl bg-[#242424]">
          <button
            type="button"
            onClick={onRemove}
            className="text-neutral-80 absolute left-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-white"
            aria-label="Remove icon"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <img
            src={iconUrl}
            alt="Category icon"
            className="h-full w-full object-cover"
          />
        </div>
        {error ? <p className="text-xs text-error">{error}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept=".png,.svg"
        className="hidden"
        onChange={handleInputChange}
      />
      <div
        className="flex h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-neutral-20 bg-white px-6 text-center"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="border-neutral-30 text-neutral-60 flex h-10 w-10 items-center justify-center rounded-xl border">
          <Plus className="h-6 w-6" />
        </div>
        <div>
          <p className="text-neutral-60 text-base font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-neutral-40 mt-1 text-sm">
            SVG or PNG less than 5MB.
          </p>
        </div>
      </div>
      {error ? <p className="text-xs text-error">{error}</p> : null}
    </div>
  );
}
