// src/pages/AddListingPage/components/BasicDetailsStep.tsx
import { useEffect, useState } from "react";
import type {
  ChangeEvent,
  Dispatch,
  FC,
  ReactElement,
  SetStateAction,
} from "react";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";
import { Info, Plus, X } from "lucide-react";
import { type PhotoItem } from "@/components/ui/FileUpload/file-upload";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { Image } from "@/components/ui/Image/image";

interface PhotoItemWithProgress extends PhotoItem {
  uploadProgress?: number;
}

interface ListingFormData {
  title: string;
  category: string;
  condition: string;
  price: number;
  isNegotiable?: boolean;
  brand: string;
  storage: string;
  model: string;
  batteryHealth?: string;
  description: string | undefined;
  location: string;
  isPickupAvailable?: boolean;
}

interface BasicDetailsStepProps {
  register: UseFormRegister<ListingFormData>;
  setValue: UseFormSetValue<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  photos: PhotoItemWithProgress[];
  setPhotos: Dispatch<SetStateAction<PhotoItemWithProgress[]>>;
  photoError: string | null;
  setPhotoError: (error: string | null) => void;
  onTipsClick: () => void;
  onNext: () => void;
  isNextDisabled: boolean;
}

const CATEGORIES = [
  { value: "phones", label: "Phones" },
  { value: "tablets", label: "Tablets" },
  { value: "laptops", label: "Laptops" },
  { value: "pc-parts", label: "PC Parts" },
  { value: "gaming", label: "Gaming" },
  { value: "audio", label: "Audio" },
  { value: "accessories", label: "Accessories" },
];

const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
];

export const BasicDetailsStep: FC<BasicDetailsStepProps> = ({
  register,
  setValue,
  photos,
  setPhotos,
  setPhotoError,
  onTipsClick,
  onNext,
  isNextDisabled,
}): ReactElement => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Phones");
  const [selectedCondition, setSelectedCondition] = useState("Like New");
  useEffect(() => {
    setValue("category", selectedCategory, { shouldValidate: true });
  }, [selectedCategory, setValue]);

  useEffect(() => {
    setValue("condition", selectedCondition, { shouldValidate: true });
  }, [selectedCondition, setValue]);
  const [draggingPhotoId, setDraggingPhotoId] = useState<string | null>(null);
  const [dragOverPhotoId, setDragOverPhotoId] = useState<string | null>(null);

  // Simulate file upload with progress
  const simulateUpload = (photo: PhotoItemWithProgress) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress <= 100) {
        setPhotos((prevPhotos) =>
          prevPhotos.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: progress } : p,
          ),
        );
      } else {
        clearInterval(interval);
        // Remove progress after upload completes
        setPhotos((prevPhotos) =>
          prevPhotos.map((p) =>
            p.id === photo.id ? { ...p, uploadProgress: undefined } : p,
          ),
        );
      }
    }, 100);
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = Math.max(0, 6 - photos.length);
    const nextFiles = Array.from(files).slice(0, remainingSlots);
    const newPhotos: PhotoItemWithProgress[] = nextFiles.map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      file,
      uploadProgress: 0,
    }));

    setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
    setPhotoError(null);

    // Start upload simulation for each new photo
    newPhotos.forEach((photo) => simulateUpload(photo));
    e.target.value = "";
  };

  const handleRemovePhoto = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    if (photo) {
      URL.revokeObjectURL(photo.url);
    }
    setPhotos((prevPhotos) => prevPhotos.filter((p) => p.id !== id));
  };

  const handleReorder = (dragId: string, hoverId: string) => {
    if (dragId === hoverId) return;
    setPhotos((prevPhotos) => {
      const dragIndex = prevPhotos.findIndex((p) => p.id === dragId);
      const hoverIndex = prevPhotos.findIndex((p) => p.id === hoverId);
      if (dragIndex < 0 || hoverIndex < 0) return prevPhotos;
      const next = [...prevPhotos];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(hoverIndex, 0, moved);
      return next;
    });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Photos */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <div className="flex flex-1 items-center gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#101010]">
              Photos
            </Text>
            <div className="flex flex-col items-center justify-center text-center leading-[0]">
              <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
                *
              </Text>
            </div>
          </div>
          <div
            className="flex shrink-0 cursor-pointer items-center justify-center gap-2"
            onClick={onTipsClick}
          >
            <Info className="size-4 text-[#828282]" />
            <Text className="text-right font-['Poppins'] text-base leading-normal text-[#828282]">
              Tips
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full gap-6 rounded-[10px] border border-dashed border-[#e4e4e4] bg-white p-3">
            {/* Add photo button */}
            {photos.length < 6 && (
              <label className="flex h-[196px] w-[170px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-solid border-[#e4e4e4] bg-white">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
                <Plus className="size-10 text-[#828282]" />
              </label>
            )}

            {/* Photo previews */}
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className={`relative h-[196px] w-[170px] shrink-0 rounded-[10px] transition-all duration-150 ${
                  draggingPhotoId === photo.id
                    ? "scale-[0.98] opacity-80 shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                    : "hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]"
                } ${dragOverPhotoId === photo.id ? "ring-2 ring-[#2563eb] ring-offset-2 ring-offset-white" : ""} cursor-grab active:cursor-grabbing`}
                draggable
                onDragStart={(event) => {
                  setDraggingPhotoId(photo.id);
                  event.dataTransfer.effectAllowed = "move";
                  event.dataTransfer.setData("text/plain", photo.id);
                }}
                onDragEnter={() => setDragOverPhotoId(photo.id)}
                onDragLeave={() =>
                  setDragOverPhotoId((prev) =>
                    prev === photo.id ? null : prev,
                  )
                }
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const dragId = event.dataTransfer.getData("text/plain");
                  if (dragId) {
                    handleReorder(dragId, photo.id);
                  }
                  setDraggingPhotoId(null);
                  setDragOverPhotoId(null);
                }}
                onDragEnd={() => {
                  setDraggingPhotoId(null);
                  setDragOverPhotoId(null);
                }}
              >
                <Image
                  src={photo.url}
                  alt={`Photo ${index + 1}`}
                  className="size-full rounded-[10px] object-cover"
                />
                {/* Dark overlay for uploading state */}
                {photo.uploadProgress !== undefined &&
                  photo.uploadProgress < 100 && (
                    <div className="absolute inset-0 rounded-[10px] bg-[rgba(0,0,0,0.75)]">
                      {/* Progress ring */}
                      <div className="absolute left-1/2 top-1/2 size-11 -translate-x-1/2 -translate-y-1/2">
                        <div className="absolute inset-[4.55%_6.57%] aspect-square">
                          <svg
                            className="size-full"
                            viewBox="0 0 32 32"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              fill="none"
                              stroke="rgba(255,255,255,0.3)"
                              strokeWidth="2"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r="14"
                              fill="none"
                              stroke="white"
                              strokeWidth="2"
                              strokeDasharray="87.96"
                              strokeDashoffset={
                                87.96 - (87.96 * photo.uploadProgress) / 100
                              }
                              strokeLinecap="round"
                              transform="rotate(-90 16 16)"
                            />
                          </svg>
                        </div>
                        <Text className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-['Poppins'] text-xs leading-normal text-white">
                          {photo.uploadProgress}%
                        </Text>
                      </div>
                    </div>
                  )}
                {/* Delete button */}
                <Button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute left-2 top-2 z-10"
                >
                  <div className="flex size-6 items-center justify-center rounded-[6px] bg-white">
                    <X className="size-4 text-[#525252]" />
                  </div>
                </Button>
                {/* Main badge */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 flex items-center justify-center rounded-[8px] bg-[#2563eb] px-3 py-1">
                    <Text className="font-['Poppins'] text-sm leading-normal text-white">
                      Main
                    </Text>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Text className="w-full whitespace-pre-wrap font-['Poppins'] text-sm leading-normal text-[#828282]">
            Add up to 6 photos.{"\n"}The first photo will be the main photo.
            Drag and drop photos to different positions to change their order
          </Text>
        </div>
      </div>

      {/* Title */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#212121]">
            Title
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
            <input
              type="text"
              placeholder="iPhone 11 Pro Max"
              defaultValue="iPhone 11 Pro Max"
              className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
              {...register("title")}
            />
          </div>
          <Text className="w-full whitespace-pre-wrap font-['Poppins'] text-sm leading-normal text-[#828282]">
            Describe what you're selling in a few words
          </Text>
        </div>
      </div>

      {/* Category */}
      <div className="relative flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#212121]">
            Category
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <Button
            type="button"
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
          >
            <Text
              className={`flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal ${
                selectedCategory ? "text-[#3d3d3d]" : "text-[#c7c7c7]"
              }`}
            >
              {selectedCategory || "Select category"}
            </Text>
            <svg
              className="size-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 15L5 9"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          {/* Category Dropdown - appears below the input */}
          {categoryOpen && (
            <div className="relative z-10 flex h-[320px] w-full gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
              <div className="flex flex-1 flex-col gap-4">
                {/* Search */}
                <div className="flex w-full items-center gap-3 rounded-xl border border-solid border-[#e4e4e4] bg-white p-4">
                  <svg
                    className="size-6 shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                      stroke="#828282"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 21L16.65 16.65"
                      stroke="#828282"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search about country"
                    className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                  />
                </div>

                {/* Options */}
                <div className="flex flex-col gap-3 overflow-y-auto">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category.value}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category.label);
                        setCategoryOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                        category.value === "phones"
                          ? "border-[#2563eb] bg-white"
                          : "border-[#e4e4e4] bg-white"
                      }`}
                    >
                      <Text
                        className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                          category.value === "phones"
                            ? "text-[#3d3d3d]"
                            : "text-[#828282]"
                        }`}
                      >
                        {category.label}
                      </Text>
                      <div className="relative size-6 overflow-clip">
                        {category.value === "phones" ? (
                          <svg
                            className="size-full"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              fill="#2563eb"
                              stroke="#2563eb"
                              strokeWidth="2"
                            />
                            <circle cx="12" cy="12" r="4" fill="white" />
                          </svg>
                        ) : (
                          <svg
                            className="size-full"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="9"
                              stroke="#828282"
                              strokeWidth="2"
                              fill="none"
                            />
                          </svg>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Scrollbar */}
              <div className="absolute right-[6px] top-[88px] h-[221px] w-2.5 rounded-[10px] bg-[rgba(107,114,128,0.1)]">
                <div className="h-[34.938px] w-full rounded-[10px] bg-[#c7c7c7]" />
              </div>
            </div>
          )}

          <Text className="font-['Poppins'] text-sm leading-normal text-[#828282]">
            Fields on next step will be customized based on category
          </Text>
        </div>
      </div>

      {/* Condition */}
      <div className="relative flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#212121]">
            Condition
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <Button
            type="button"
            onClick={() => setConditionOpen(!conditionOpen)}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
          >
            <Text
              className={`flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal ${
                selectedCondition ? "text-[#3d3d3d]" : "text-[#c7c7c7]"
              }`}
            >
              {selectedCondition || "Select your item condition"}
            </Text>
            <svg
              className="size-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 9L12 15L5 9"
                stroke="#828282"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>

          {/* Condition Dropdown - appears below the input (no search) */}
          {conditionOpen && (
            <div className="relative z-10 flex w-full gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
              <div className="flex flex-1 flex-col gap-3">
                {/* Options */}
                {CONDITIONS.map((condition) => (
                  <Button
                    key={condition.value}
                    type="button"
                    onClick={() => {
                      setSelectedCondition(condition.label);
                      setConditionOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                      selectedCondition === condition.label
                        ? "border-[#2563eb] bg-white"
                        : "border-[#e4e4e4] bg-white"
                    }`}
                  >
                    <Text
                      className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                        selectedCondition === condition.label
                          ? "text-[#3d3d3d]"
                          : "text-[#828282]"
                      }`}
                    >
                      {condition.label}
                    </Text>
                    <div className="relative size-6 overflow-clip">
                      {selectedCondition === condition.label ? (
                        <svg
                          className="size-full"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            fill="#2563eb"
                            stroke="#2563eb"
                            strokeWidth="2"
                          />
                          <circle cx="12" cy="12" r="4" fill="white" />
                        </svg>
                      ) : (
                        <svg
                          className="size-full"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="#828282"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      )}
                    </div>
                  </Button>
                ))}
              </div>

              {/* Scrollbar */}
              {CONDITIONS.length > 5 && (
                <div className="absolute right-[6px] top-[16px] h-[calc(100%-32px)] w-2.5 rounded-[10px] bg-[rgba(107,114,128,0.1)]">
                  <div className="h-[34.938px] w-full rounded-[10px] bg-[#c7c7c7]" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Price */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#212121]">
            Price
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
            <input
              type="text"
              placeholder="1500"
              defaultValue="1500"
              className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
              {...register("price", { valueAsNumber: true })}
            />
            <Text className="text-right font-['Poppins'] text-base leading-normal text-[#c7c7c7]">
              ILS
            </Text>
          </div>
          <Text className="font-['Poppins'] text-sm leading-normal text-[#828282]">
            Set a competitive price
          </Text>
        </div>
      </div>

      {/* Price is negotiable checkbox */}
      <div className="flex w-full items-center gap-2">
        <div className="relative size-6">
          <input
            type="checkbox"
            id="isNegotiable"
            defaultChecked
            className="peer size-6 cursor-pointer appearance-none rounded-md border border-[#e4e4e4] checked:border-[#2563eb] checked:bg-[#2563eb]"
            {...register("isNegotiable")}
          />
          <svg
            className="pointer-events-none absolute inset-0 hidden size-full p-1 text-white peer-checked:block"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <label
          htmlFor="isNegotiable"
          className="cursor-pointer font-['Poppins'] text-lg leading-normal text-[#212121]"
        >
          Price is negotiable
        </label>
      </div>

      {/* Next Button */}
      <Button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`flex h-14 w-[358px] items-center justify-center self-center rounded-xl px-[119px] py-4 ${
          isNextDisabled ? "cursor-not-allowed bg-[#e4e4e4]" : "bg-[#2563eb]"
        }`}
      >
        <div className="flex flex-col items-center justify-center text-center leading-[0]">
          <Text
            className={`font-['Poppins'] text-base font-medium leading-normal ${
              isNextDisabled ? "text-[#c7c7c7]" : "text-white"
            }`}
          >
            Next
          </Text>
        </div>
      </Button>
    </div>
  );
};
