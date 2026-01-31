// src/components/ui/file-upload.tsx
import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface PhotoItem {
  id: string;
  url: string;
  file: File;
}

export interface FileUploadProps {
  photos: PhotoItem[];
  maxPhotos?: number;
  maxPhotoSize?: number;
  onPhotosChange: (photos: PhotoItem[]) => void;
  error?: string | null;
  onErrorChange: (error: string | null) => void;
  emptyTitle?: string;
  emptyHint?: string;
  addMoreLabel?: string;
  mainLabel?: string;
  helperText?: string;
  tipsLabel?: string;
  onTipsClick?: () => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  photos,
  maxPhotos = 8,
  maxPhotoSize = 5 * 1024 * 1024,
  onPhotosChange,
  error,
  onErrorChange,
  emptyTitle,
  emptyHint,
  addMoreLabel,
  mainLabel,
  helperText,
  tipsLabel,
  onTipsClick,
  accept = "image/*",
}): React.ReactElement => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    const oversized = files.find((file) => file.size > maxPhotoSize);
    if (oversized) {
      onErrorChange(
        `Please upload an image smaller than ${maxPhotoSize / (1024 * 1024)} MB.`,
      );
      event.target.value = "";
      return;
    }

    onErrorChange(null);
    const remainingSlots = maxPhotos - photos.length;
    const nextFiles = files.slice(0, remainingSlots);
    const nextPhotos = nextFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    onPhotosChange([...photos, ...nextPhotos]);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files ?? []);
    if (!files.length) return;

    const oversized = files.find((file) => file.size > maxPhotoSize);
    if (oversized) {
      onErrorChange(
        `Please upload an image smaller than ${maxPhotoSize / (1024 * 1024)} MB.`,
      );
      return;
    }

    onErrorChange(null);
    const remainingSlots = maxPhotos - photos.length;
    const nextFiles = files.slice(0, remainingSlots);
    const nextPhotos = nextFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      url: URL.createObjectURL(file),
    }));
    onPhotosChange([...photos, ...nextPhotos]);
  };

  const removePhoto = (photoId: string) => {
    const photoToRemove = photos.find((photo) => photo.id === photoId);
    if (photoToRemove) {
      URL.revokeObjectURL(photoToRemove.url);
    }
    onPhotosChange(photos.filter((photo) => photo.id !== photoId));
  };

  const handleOpenFilePicker = () => {
    fileInputRef.current?.click();
  };

  React.useEffect(() => {
    return () => {
      photos.forEach((photo) => URL.revokeObjectURL(photo.url));
    };
  }, [photos]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-label text-neutral-foreground">
          {tipsLabel ?? "Photos"}
        </label>
        {onTipsClick && (
          <button
            type="button"
            onClick={onTipsClick}
            className="text-caption font-medium text-primary hover:underline"
          >
            Tips
          </button>
        )}
      </div>

      <div
        className={twMerge(
          "mt-3 rounded-lg border border-dashed border-neutral-20 bg-white p-6",
          error && "border-error bg-error-10",
        )}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={handlePhotoChange}
        />

        {!photos.length ? (
          <button
            type="button"
            onClick={handleOpenFilePicker}
            className="flex w-full flex-col items-center gap-2 text-center"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-5 text-primary">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 4.16699V15.8337M4.16666 10.0003H15.8333"
                  stroke="currentColor"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-body font-medium text-neutral-foreground">
                {emptyTitle ?? "Click to upload or drag and drop"}
              </p>
              <p className="text-caption text-muted-foreground">
                {emptyHint ?? "JPG, JPEG, PNG less than 5MB"}
              </p>
            </div>
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-neutral-10"
              >
                <img
                  src={photo.url}
                  alt={`Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 rounded bg-primary px-2 py-0.5 text-caption font-medium text-white">
                    {mainLabel ?? "Main"}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-sm text-neutral-foreground opacity-0 shadow-sm transition-opacity hover:bg-white group-hover:opacity-100"
                  aria-label={`Remove photo ${index + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
            {photos.length < maxPhotos && (
              <button
                type="button"
                onClick={handleOpenFilePicker}
                className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-neutral-20 bg-muted-5 transition-colors hover:bg-muted-10"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 4.16699V15.8337M4.16666 10.0003H15.8333"
                        stroke="currentColor"
                        strokeWidth="1.67"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-caption font-medium text-neutral-foreground">
                    {addMoreLabel ?? "Add photo"}
                  </span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-2 text-caption text-error">{error}</p>
      ) : (
        helperText && (
          <p className="mt-2 text-caption text-muted-foreground">
            {helperText}
          </p>
        )
      )}
    </div>
  );
};
