import { useEffect, useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";

type UploadStatus = "idle" | "uploading" | "success" | "error";

type UploadBoxProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  title?: string;
};

export default function UploadBox<T extends FieldValues>({
  name,
  control,
  title = "Upload file",
}: UploadBoxProps<T>) {
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
  } | null>(null);

  useEffect(() => {
    if (status !== "uploading") return;

    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("success");
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [status]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);
  const handleFile = (file: File) => {
    setPreview(URL.createObjectURL(file));
    setFileInfo({
      name: file.name,
      size: `${Math.round(file.size / 1024)} KB`,
    });
    setStatus("uploading");
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const reset = () => {
          setPreview(null);
          setProgress(0);
          setStatus("idle");
          setFileInfo(null);
          field.onChange(null);
        };

        return (
          <div className="w-full">
            <Text className="mb-2 text-start font-normal">{title}</Text>

            {preview ? (
              <div className="border-border flex flex-col gap-2 rounded-xl border border-dashed p-4">
                <div className="flex items-start space-x-3">
                  <Image
                    src={preview}
                    alt="preview"
                    className="h-14 w-14 rounded object-cover"
                  />
                  <div className="flex-1 space-y-1 text-start">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text className="text-sm font-medium">
                          {fileInfo?.name}
                        </Text>
                        <Text variant="muted" className="text-xs">
                          {fileInfo?.size}
                        </Text>
                      </div>
                      <button
                        type="button"
                        onClick={reset}
                        className="rounded bg-error px-2 py-1 text-xs text-white"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="mt-2 flex flex-1 items-center justify-between space-x-6">
                      <div className="h-2 flex-1 rounded bg-muted">
                        <div
                          className={`h-[6px] rounded transition-all ${
                            status === "success"
                              ? "bg-success"
                              : status === "error"
                                ? "bg-error"
                                : "bg-primary"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <Text className="flex justify-end text-xs">
                        {progress}%
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <label
                className="border-border flex cursor-pointer flex-col rounded-lg border border-dashed py-6 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) {
                    handleFile(file);
                    field.onChange(file);
                  }
                }}
              >
                <Text
                  variant="muted"
                  className="mx-auto flex h-9 w-9 items-center justify-center rounded border-2 text-lg font-normal"
                >
                  +
                </Text>
                <div className="pt-6">
                  <Text variant="muted" className="text-sm font-normal">
                    Click to upload or drag and drop
                  </Text>
                  <Text variant="muted" className="text-sm font-normal">
                    JPG, JPEG, PNG less than 5MB
                  </Text>
                </div>

                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFile(file);
                      field.onChange(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        );
      }}
    />
  );
}
