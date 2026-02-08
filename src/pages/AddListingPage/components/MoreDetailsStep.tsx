// src/pages/AddListingPage/components/MoreDetailsStep.tsx
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

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

interface MoreDetailsStepProps {
  register: UseFormRegister<ListingFormData>;
  setValue: UseFormSetValue<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  watch: UseFormWatch<ListingFormData>;
  onBack: () => void;
  onReview: () => void;
  onLocationClick: () => void;
}

const BRANDS = [
  { value: "", labelKey: "addListing.fields.brand.placeholder" },
  { value: "apple", labelKey: "addListing.brands.apple" },
  { value: "samsung", labelKey: "addListing.brands.samsung" },
  { value: "xiaomi", labelKey: "addListing.brands.xiaomi" },
  { value: "huawei", labelKey: "addListing.brands.huawei" },
];

const STORAGE_OPTIONS = [
  { value: "", labelKey: "addListing.fields.storage.placeholder" },
  { value: "64", labelKey: "addListing.storage.64" },
  { value: "128", labelKey: "addListing.storage.128" },
  { value: "256", labelKey: "addListing.storage.256" },
  { value: "512", labelKey: "addListing.storage.512" },
];

export const MoreDetailsStep: React.FC<MoreDetailsStepProps> = ({
  register,
  setValue,
  errors,
  watch,
  onReview,
  onLocationClick,
}): React.ReactElement => {
  const { t } = useTranslation();
  const descriptionValue = watch("description") ?? "";
  const locationValue = watch("location") ?? "";
  const watchedBrand = watch("brand") ?? "";
  const watchedStorage = watch("storage") ?? "";
  const [confirmNotProhibited, setConfirmNotProhibited] = useState(true);
  const [brandOpen, setBrandOpen] = useState(false);
  const [storageOpen, setStorageOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");

  const selectedBrandLabel = selectedBrand
    ? t(BRANDS.find((brand) => brand.value === selectedBrand)?.labelKey ?? "")
    : t("addListing.fields.brand.placeholder");
  const selectedStorageLabel = selectedStorage
    ? t(
        STORAGE_OPTIONS.find((storage) => storage.value === selectedStorage)
          ?.labelKey ?? "",
      )
    : t("addListing.fields.storage.placeholder");

  React.useEffect(() => {
    if (watchedBrand && watchedBrand !== selectedBrand) {
      setSelectedBrand(watchedBrand);
    }
  }, [watchedBrand]);

  React.useEffect(() => {
    if (watchedStorage && watchedStorage !== selectedStorage) {
      setSelectedStorage(watchedStorage);
    }
  }, [watchedStorage]);

  React.useEffect(() => {
    setValue("brand", selectedBrand, { shouldValidate: true });
  }, [selectedBrand, setValue]);

  React.useEffect(() => {
    setValue("storage", selectedStorage, { shouldValidate: true });
  }, [selectedStorage, setValue]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Brand */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
            Brand
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
            onClick={() => setBrandOpen(!brandOpen)}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
          >
            <Text className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
              {selectedBrandLabel}
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
          {brandOpen && (
            <div className="relative z-10 flex w-full gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
              <div className="flex flex-1 flex-col gap-3">
                {BRANDS.filter((brand) => brand.value).map((brand) => (
                  <Button
                    key={brand.value}
                    type="button"
                    onClick={() => {
                      setSelectedBrand(brand.value);
                      setBrandOpen(false);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                      selectedBrand === brand.value
                        ? "border-[#2563eb] bg-white"
                        : "border-[#e4e4e4] bg-white"
                    }`}
                  >
                    <Text
                      className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                        selectedBrand === brand.value
                          ? "text-[#3d3d3d]"
                          : "text-[#828282]"
                      }`}
                    >
                      {t(brand.labelKey)}
                    </Text>
                    <div className="relative size-6 overflow-clip">
                      {selectedBrand === brand.value ? (
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
          )}
          <input type="hidden" value={selectedBrand} {...register("brand")} />
        </div>
        {errors.brand?.message && (
          <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
            {errors.brand.message}
          </Text>
        )}
      </div>

      {/* Model */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
            Model
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
          <input
            type="text"
            placeholder="iphone 11"
            className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            {...register("model")}
          />
        </div>
        {errors.model?.message && (
          <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
            {errors.model.message}
          </Text>
        )}
      </div>

      {/* Storage */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
            Storage
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
            onClick={() => setStorageOpen(!storageOpen)}
            className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
          >
            <Text className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
              {selectedStorageLabel}
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
          {storageOpen && (
            <div className="relative z-10 flex w-full gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
              <div className="flex flex-1 flex-col gap-3">
                {STORAGE_OPTIONS.filter((storage) => storage.value).map(
                  (storage) => {
                    const label = t(storage.labelKey);
                    return (
                      <Button
                        key={storage.value}
                        type="button"
                        onClick={() => {
                          setSelectedStorage(storage.value);
                          setStorageOpen(false);
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                          selectedStorage === storage.value
                            ? "border-[#2563eb] bg-white"
                            : "border-[#e4e4e4] bg-white"
                        }`}
                      >
                        <Text
                          className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                            selectedStorage === storage.value
                              ? "text-[#3d3d3d]"
                              : "text-[#828282]"
                          }`}
                        >
                          {label}
                        </Text>
                        <div className="relative size-6 overflow-clip">
                          {selectedStorage === storage.value ? (
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
                    );
                  },
                )}
              </div>
            </div>
          )}
          <input
            type="hidden"
            value={selectedStorage}
            {...register("storage")}
          />
        </div>
        {errors.storage?.message && (
          <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
            {errors.storage.message}
          </Text>
        )}
      </div>

      {/* Battery Health */}
      <div className="flex w-full flex-col gap-2">
        <p className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
          Battery Health
        </p>
        <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
          <input
            type="text"
            placeholder="91%"
            className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            {...register("batteryHealth")}
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex w-full flex-col gap-2">
        <p className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
          Description
        </p>
        <div className="flex w-full flex-col gap-2 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
          <textarea
            placeholder="Describe what you’re selling, in detail"
            className="min-h-[160px] w-full resize-none font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            maxLength={500}
            {...register("description")}
          />
          <div className="flex w-full items-center justify-between text-[#828282]">
            <p className="font-['Poppins'] text-sm leading-normal">
              Describe what you’re selling, in detail
            </p>
            <p className="font-['Poppins'] text-xs leading-normal">
              ({descriptionValue.length}/500)
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-center gap-2">
          <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
            Location
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
        <Button
          type="button"
          onClick={onLocationClick}
          className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
        >
          <input
            type="text"
            placeholder="Gaza, Palestine"
            value={locationValue}
            readOnly
            className="flex-1 bg-transparent font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
            {...register("location")}
          />
          <svg
            className="size-6 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 5L15 12L9 19"
              stroke="#828282"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>
        {errors.location?.message && (
          <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
            {errors.location.message}
          </Text>
        )}
      </div>

      {/* Confirmation */}
      <div className="flex w-full items-center gap-2">
        <div className="relative size-6">
          <input
            type="checkbox"
            checked={confirmNotProhibited}
            onChange={(event) => setConfirmNotProhibited(event.target.checked)}
            className="peer size-6 cursor-pointer appearance-none rounded-md border border-[#e4e4e4] checked:border-[#2563eb] checked:bg-[#2563eb]"
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
        <div className="flex items-center gap-1">
          <Text className="font-['Poppins'] text-lg leading-normal text-[#212121]">
            I confirm this item is not stolen or prohibited
          </Text>
          <div className="flex flex-col items-center justify-center text-center leading-[0]">
            <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
              *
            </Text>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-6">
        <Button
          type="button"
          onClick={onReview}
          className="flex h-14 w-[358px] items-center justify-center rounded-xl border border-[#2563eb] bg-white px-[119px] py-4"
        >
          <Text className="font-['Poppins'] text-base font-medium leading-normal text-[#2563eb]">
            Review
          </Text>
        </Button>
        <Button
          type="submit"
          className="flex h-14 w-[358px] items-center justify-center rounded-xl bg-[#2563eb] px-[119px] py-4"
        >
          <Text className="font-['Poppins'] text-base font-medium leading-normal text-white">
            Publish
          </Text>
        </Button>
      </div>
    </div>
  );
};
