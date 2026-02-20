import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, UploadCloud } from "lucide-react";
import StatusModal from "./StatusModal";

// 1. Define types for state management
type PageStatus = "uploading" | "submitting" | "success" | "failed";
type UploadStatus = "pending" | "uploading" | "success" | "error";

interface FileSlot {
  id: "front" | "back" | "selfie";
  title: string;
  file: File | null;
  previewUrl?: string;
  status: UploadStatus;
  progress: number; // Add progress to the type
  error?: string;
}

// Props for the item component
interface FileUploadItemProps {
  slot: FileSlot;
  index: number;
  onFileSelect: (index: number, file: File) => void;
  onDelete: (index: number) => void;
}

// --- Components ---

// FileUploadItem: Handles a single file upload slot
const FileUploadItem: React.FC<FileUploadItemProps> = ({
  slot,
  index,
  onFileSelect,
  onDelete,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTriggerUpload = () => {
    inputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(index, e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 transition-all">
      <input
        type="file"
        ref={inputRef}
        onChange={onFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
      <div className="flex items-center">
        {slot.previewUrl && slot.file ? (
          <img
            src={slot.previewUrl}
            alt="Preview"
            className="h-12 w-12 rounded-md object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
            <UploadCloud className="text-gray-400" size={24} />
          </div>
        )}

        <div className="ml-4 flex-grow">
          {slot.file ? (
            <>
              <p className="text-sm font-medium text-gray-900">
                {slot.file.name}
              </p>
              <p className="text-sm text-gray-500">
                {formatFileSize(slot.file.size)}
              </p>
              {/* Progress bar logic */}
              <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    slot.status === "success"
                      ? "bg-green-500"
                      : slot.status === "error"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                  style={{ width: `${slot.progress}%` }}
                ></div>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">No file selected</p>
          )}
        </div>

        <div className="ml-4 flex items-center space-x-2">
          {/* Status Indicators */}
          {slot.status === "uploading" && (
            <p className="font-mono text-sm text-gray-500">{slot.progress}%</p>
          )}
          {slot.status === "success" && (
            <CheckCircle className="text-green-500" size={20} />
          )}
          {slot.status === "error" && (
            <XCircle className="text-red-500" size={20} />
          )}

          {slot.file ? (
            <button
              onClick={() => onDelete(index)}
              className="rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200"
            >
              <XCircle size={20} />
            </button>
          ) : (
            <button
              onClick={handleTriggerUpload}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200"
            >
              Choose File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const IdentityVerificationPage: React.FC = () => {
  const [pageStatus, setPageStatus] = useState<PageStatus>("uploading");
  const [docType, setDocType] = useState<string>("Identity card");
  const [fileSlots, setFileSlots] = useState<FileSlot[]>([
    {
      id: "front",
      title: "Front side",
      file: null,
      status: "pending",
      progress: 0,
    },
    {
      id: "back",
      title: "Back side",
      file: null,
      status: "pending",
      progress: 0,
    },
    {
      id: "selfie",
      title: "Selfie with ID",
      file: null,
      status: "pending",
      progress: 0,
    },
  ]);
  const [allFilesPresent, setAllFilesPresent] = useState<boolean>(false);

  // Effect to check if all files are selected
  useEffect(() => {
    const allSelected = fileSlots.every((slot) => slot.file !== null);
    setAllFilesPresent(allSelected);
  }, [fileSlots]);

  // Effect to manage the upload simulation
  useEffect(() => {
    const intervals = fileSlots
      .map((slot, index) => {
        if (slot.status === "uploading" && slot.progress < 100) {
          return setInterval(() => {
            setFileSlots((prevSlots) => {
              const newSlots = [...prevSlots];
              const currentSlot = newSlots[index];

              if (!currentSlot || currentSlot.status !== "uploading") {
                return newSlots; // Stop if status changed
              }

              const newProgress = currentSlot.progress + 20;
              if (newProgress >= 100) {
                newSlots[index] = {
                  ...currentSlot,
                  progress: 100,
                  status: "success",
                };
              } else {
                newSlots[index] = { ...currentSlot, progress: newProgress };
              }
              return newSlots;
            });
          }, 300);
        }
        return null;
      })
      .filter(Boolean) as NodeJS.Timeout[];

    // Cleanup function
    return () => {
      intervals.forEach(clearInterval);
    };
  }, [fileSlots]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      fileSlots.forEach((slot) => {
        if (slot.previewUrl) {
          URL.revokeObjectURL(slot.previewUrl);
        }
      });
    };
  }, [fileSlots]);

  const handleFileSelect = (index: number, selectedFile: File) => {
    setFileSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      const oldSlot = newSlots[index];

      if (oldSlot.previewUrl) {
        URL.revokeObjectURL(oldSlot.previewUrl);
      }

      const previewUrl = URL.createObjectURL(selectedFile);

      // Set status to 'uploading' to trigger the effect
      newSlots[index] = {
        ...oldSlot,
        file: selectedFile,
        previewUrl,
        status: "uploading",
        progress: 0,
      };

      return newSlots;
    });
  };

  const handleDeleteFile = (index: number) => {
    setFileSlots((prevSlots) => {
      const newSlots = [...prevSlots];
      const oldSlot = newSlots[index];
      if (oldSlot.previewUrl) {
        URL.revokeObjectURL(oldSlot.previewUrl);
      }
      newSlots[index] = {
        ...oldSlot,
        file: null,
        previewUrl: undefined,
        status: "pending",
        progress: 0,
      };
      return newSlots;
    });
  };

  const handleSubmit = () => {
    setPageStatus("submitting");
    // Simulate network request
    setTimeout(() => {
      // Randomly succeed or fail
      const isSuccess = Math.random() > 0.5;
      setPageStatus(isSuccess ? "success" : "failed");
    }, 3000);
  };

  const handleTryAgain = () => {
    setPageStatus("uploading");
    // Reset files to initial state
    setFileSlots((prev) =>
      prev.map((slot) => ({
        ...slot,
        file: null,
        previewUrl: undefined,
        status: "pending",
        progress: 0,
      })),
    );
  };

  // --- Render Methods ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Verify your identity
        </h1>

        <div className="mt-6">
          <p className="font-semibold text-gray-800">Select document type</p>
          <div className="mt-4 flex space-x-8">
            {["Identity card", "Passport", "Driver License"].map((type) => (
              <label key={type} className="flex cursor-pointer items-center">
                <input
                  type="radio"
                  name="docType"
                  value={type}
                  checked={docType === type}
                  onChange={(e) => setDocType(e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {fileSlots.map((slot, index) => (
          <div key={slot.id} className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800">
              {slot.title}
            </h2>
            <FileUploadItem
              slot={slot}
              index={index}
              onFileSelect={handleFileSelect}
              onDelete={handleDeleteFile}
            />
          </div>
        ))}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allFilesPresent}
            className={`w-full max-w-xs rounded-md px-12 py-3 text-sm font-semibold text-white transition-colors ${
              allFilesPresent
                ? "bg-blue-600 hover:bg-blue-700"
                : "cursor-not-allowed bg-gray-300"
            }`}
          >
            Submit
          </button>
        </div>
      </div>

      {pageStatus !== "uploading" && (
        <StatusModal status={pageStatus} onTryAgain={handleTryAgain} />
      )}
    </div>
  );
};

export default IdentityVerificationPage;
