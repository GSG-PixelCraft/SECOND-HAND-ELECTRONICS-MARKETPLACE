// src/pages/AddListingPage/components/MoreDetailsStep.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
  UseFormSetValue,
} from "react-hook-form";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";

interface ListingFormData {
  title: string;
  category: string;
  condition: string;
  price: number;
  isNegotiable?: boolean;
  brand?: string;
  storage?: string;
  model?: string;
  batteryHealth?: string;
  description: string | undefined;
  location: string;
  isPickupAvailable?: boolean;
}

export interface CategoryAttributeDetail {
  id: string;
  name: string;
  type: string;
  body?: Record<string, unknown>;
  isRequired: boolean;
}

interface MoreDetailsStepProps {
  register: UseFormRegister<ListingFormData>;
  setValue: UseFormSetValue<ListingFormData>;
  errors: FieldErrors<ListingFormData>;
  watch: UseFormWatch<ListingFormData>;
  onBack: () => void;
  onReview: () => void;
  onLocationClick: () => void;
  /** Full attribute definitions fetched from the category detail endpoint */
  categoryAttributes?: CategoryAttributeDetail[];
  /** Current dynamic attribute values keyed by attribute ID */
  attributeValues: Record<string, string>;
  /** Called whenever a dynamic attribute value changes */
  onAttributeValuesChange: (values: Record<string, string>) => void;
  onSaveDraft: () => void;
  isSavingDraft: boolean;
}

const LOCATION_KEYWORDS = [
  "location", "address", "city",
  "Ø§Ù„Ù…ÙˆÙ‚Ø¹", "Ø§Ù„Ø¹Ù†ÙˆØ§Ù†", "Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©", "Ø§Ù„Ù…Ø¯ÙŠÙ†Ù‡", "Ø§Ù„Ù…ÙƒØ§Ù†",
];
const DESCRIPTION_KEYWORDS = [
  "description", "details", "notes",
  "Ø§Ù„ÙˆØµÙ", "Ø§Ù„ØªÙØ§ØµÙŠÙ„", "Ù…Ù„Ø§Ø­Ø¸Ø§Øª",
];

const isLocationAttr = (name: string) =>
  LOCATION_KEYWORDS.some((k) => name.toLowerCase().includes(k));
const isDescriptionAttr = (name: string) =>
  DESCRIPTION_KEYWORDS.some((k) => name.toLowerCase().includes(k));

// â”€â”€â”€ Static fallback fields (used only when API returns no category attributes) â”€
const BRANDS_STATIC = [
  { value: "apple", label: "Apple" },
  { value: "samsung", label: "Samsung" },
  { value: "xiaomi", label: "Xiaomi" },
  { value: "huawei", label: "Huawei" },
];

const STORAGE_OPTIONS_STATIC = [
  { value: "64", label: "64 GB" },
  { value: "128", label: "128 GB" },
  { value: "256", label: "256 GB" },
  { value: "512", label: "512 GB" },
];

// â”€â”€â”€ Chevron SVG helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ChevronDown = () => (
  <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 9L12 15L5 9" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const ChevronRight = () => (
  <svg className="size-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 5L15 12L9 19" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const RadioSelected = () => (
  <svg className="size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" fill="#2563eb" stroke="#2563eb" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);
const RadioUnselected = () => (
  <svg className="size-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#828282" strokeWidth="2" fill="none" />
  </svg>
);

// ── Collect option list for a select attribute ─────────────────────────────
const getSelectOptions = (body?: Record<string, unknown>): string[] => {
  if (!body) return [];
  if (Array.isArray(body.options)) return body.options.filter((o) => typeof o === "string") as string[];
  return [];
};

export const MoreDetailsStep: FC<MoreDetailsStepProps> = ({
  register,
  errors,
  watch,
  onReview,
  onLocationClick,
  categoryAttributes,
  attributeValues,
  onAttributeValuesChange,
  onSaveDraft,
  isSavingDraft,
}): ReactElement => {
  const { t } = useTranslation();
  void t; // t kept for i18n compatibility
  const descriptionValue = watch("description") ?? "";
  const locationValue = watch("location") ?? "";
  const [confirmNotProhibited, setConfirmNotProhibited] = useState(true);
  // Track which dropdown is open by attribute ID
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // â”€â”€ Static-fallback state (only used when no categoryAttributes from API) â”€â”€
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");

  const hasDynamicAttrs = categoryAttributes && categoryAttributes.length > 0;

  // Seed attributeValues with defaults when category attributes first load so that
  // select fields have a pre-selected value and hasDynamic evaluates to true
  // in the parent's submission handler.
  useEffect(() => {
    if (!categoryAttributes || categoryAttributes.length === 0) return;
    const unseeded = categoryAttributes.filter((a) => !(a.id in attributeValues));
    if (unseeded.length === 0) return;
    const defaults: Record<string, string> = {};
    for (const attr of unseeded) {
      if (attr.type === "select") {
        const opts = getSelectOptions(attr.body);
        defaults[attr.id] = opts[0] ?? "";
      } else {
        defaults[attr.id] = "";
      }
    }
    onAttributeValuesChange({ ...attributeValues, ...defaults });
    // Only re-run when the attribute definitions list itself changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryAttributes]);

  // Sync location RHF value into attributeValues for any location-type attribute
  const prevLocationRef = useRef("");
  useEffect(() => {
    if (!hasDynamicAttrs || locationValue === prevLocationRef.current) return;
    prevLocationRef.current = locationValue;
    const locationAttr = categoryAttributes!.find((a) => isLocationAttr(a.name));
    if (locationAttr && locationValue) {
      onAttributeValuesChange({ ...attributeValues, [locationAttr.id]: locationValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationValue, hasDynamicAttrs]);

  // Sync description RHF value into attributeValues for any description-type attribute
  const prevDescRef = useRef("");
  useEffect(() => {
    if (!hasDynamicAttrs || descriptionValue === prevDescRef.current) return;
    prevDescRef.current = descriptionValue;
    const descAttr = categoryAttributes!.find(
      (a) => isDescriptionAttr(a.name) || a.type === "textarea",
    );
    if (descAttr) {
      onAttributeValuesChange({ ...attributeValues, [descAttr.id]: descriptionValue });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [descriptionValue, hasDynamicAttrs]);

  const updateAttrValue = useCallback(
    (id: string, value: string) => {
      onAttributeValuesChange({ ...attributeValues, [id]: value });
    },
    [attributeValues, onAttributeValuesChange],
  );

  // â”€â”€ Render a single dynamic attribute field â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const renderDynamicAttribute = useMemo(
    () =>
      (attr: CategoryAttributeDetail): ReactElement => {
        const { id, name, type, body, isRequired } = attr;
        const currentValue = attributeValues[id] ?? "";
        const isOpen = openDropdown === id;

        const fieldLabel = (
          <div className="flex items-center gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">{name}</Text>
            {isRequired && (
              <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">*</Text>
            )}
          </div>
        );

        // Location field â€“ show the dialog button
        if (isLocationAttr(name)) {
          return (
            <div key={id} className="flex w-full flex-col gap-2">
              {fieldLabel}
              <Button
                type="button"
                onClick={onLocationClick}
                className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
              >
                <input
                  type="text"
                  placeholder="Gaza, Palestine"
                  value={locationValue || currentValue}
                  readOnly
                  className="flex-1 bg-transparent font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                  {...register("location")}
                />
                <ChevronRight />
              </Button>
              {errors.location?.message && (
                <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
                  {errors.location.message}
                </Text>
              )}
            </div>
          );
        }

        // Description / textarea field
        if (type === "textarea" || isDescriptionAttr(name)) {
          return (
            <div key={id} className="flex w-full flex-col gap-2">
              {fieldLabel}
              <div className="flex w-full flex-col gap-2 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
                <textarea
                  placeholder="Describe what you're selling, in detail"
                  className="min-h-[160px] w-full resize-none font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                  maxLength={500}
                  {...register("description")}
                />
                <div className="flex w-full items-center justify-between text-[#828282]">
                  <p className="font-['Poppins'] text-sm leading-normal">Describe what you're selling, in detail</p>
                  <p className="font-['Poppins'] text-xs leading-normal">({descriptionValue.length}/500)</p>
                </div>
              </div>
            </div>
          );
        }

        // Select field
        if (type === "select") {
          const options = getSelectOptions(body);
          return (
            <div key={id} className="flex w-full flex-col gap-2">
              {fieldLabel}
              <div className="flex w-full flex-col gap-1">
                <Button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : id)}
                  className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
                >
                  <Text className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
                    {currentValue || `Select ${name}`}
                  </Text>
                  <ChevronDown />
                </Button>
                {isOpen && (
                  <div className="relative z-10 flex w-full flex-col gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
                    {options.length > 0 ? (
                      options.map((opt) => (
                        <Button
                          key={opt}
                          type="button"
                          onClick={() => {
                            updateAttrValue(id, opt);
                            setOpenDropdown(null);
                          }}
                          className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                            currentValue === opt ? "border-[#2563eb] bg-white" : "border-[#e4e4e4] bg-white"
                          }`}
                        >
                          <Text
                            className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                              currentValue === opt ? "text-[#3d3d3d]" : "text-[#828282]"
                            }`}
                          >
                            {opt}
                          </Text>
                          <div className="relative size-6 overflow-clip">
                            {currentValue === opt ? <RadioSelected /> : <RadioUnselected />}
                          </div>
                        </Button>
                      ))
                    ) : (
                      // No options from API â€“ fall back to free text inside dropdown
                      <input
                        type="text"
                        autoFocus
                        value={currentValue}
                        onChange={(e) => updateAttrValue(id, e.target.value)}
                        placeholder={`Enter ${name}`}
                        className="w-full font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // Number field
        if (type === "number") {
          return (
            <div key={id} className="flex w-full flex-col gap-2">
              {fieldLabel}
              <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
                <input
                  type="number"
                  placeholder={`Enter ${name}`}
                  value={currentValue}
                  onChange={(e) => updateAttrValue(id, e.target.value)}
                  className="flex-1 font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                />
              </div>
            </div>
          );
        }

        // Default: text / checkboxes / toggle / datepicker â†’ plain text input
        return (
          <div key={id} className="flex w-full flex-col gap-2">
            {fieldLabel}
            <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
              <input
                type="text"
                placeholder={`Enter ${name}`}
                value={currentValue}
                onChange={(e) => updateAttrValue(id, e.target.value)}
                className="flex-1 font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
              />
            </div>
          </div>
        );
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [attributeValues, openDropdown, locationValue, descriptionValue, errors.location],
  );

  return (
    <div className="flex w-full flex-col gap-6">
      {/* â”€â”€ Dynamic fields from the API category attributes â”€â”€ */}
      {hasDynamicAttrs ? (
        categoryAttributes!.map((attr) => renderDynamicAttribute(attr))
      ) : (
        /* â”€â”€ Static fallback: classic phone fields â”€â”€ */
        <>
          {/* Brand */}
          <div className="flex w-full flex-col gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Brand</Text>
            <div className="flex w-full flex-col gap-1">
              <Button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "brand" ? null : "brand")}
                className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
              >
                <Text className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
                  {selectedBrand
                    ? BRANDS_STATIC.find((b) => b.value === selectedBrand)?.label ?? selectedBrand
                    : "Select brand"}
                </Text>
                <ChevronDown />
              </Button>
              {openDropdown === "brand" && (
                <div className="relative z-10 flex w-full flex-col gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
                  {BRANDS_STATIC.map((brand) => (
                    <Button
                      key={brand.value}
                      type="button"
                      onClick={() => { setSelectedBrand(brand.value); setOpenDropdown(null); }}
                      className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                        selectedBrand === brand.value ? "border-[#2563eb] bg-white" : "border-[#e4e4e4] bg-white"
                      }`}
                    >
                      <Text className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                        selectedBrand === brand.value ? "text-[#3d3d3d]" : "text-[#828282]"
                      }`}>{brand.label}</Text>
                      <div className="relative size-6 overflow-clip">
                        {selectedBrand === brand.value ? <RadioSelected /> : <RadioUnselected />}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              <input type="hidden" value={selectedBrand} {...register("brand")} />
            </div>
          </div>

          {/* Model */}
          <div className="flex w-full flex-col gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Model</Text>
            <div className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
              <input
                type="text"
                placeholder="iPhone 11"
                className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                {...register("model")}
              />
            </div>
          </div>

          {/* Storage */}
          <div className="flex w-full flex-col gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Storage</Text>
            <div className="flex w-full flex-col gap-1">
              <Button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === "storage" ? null : "storage")}
                className="flex w-full items-center gap-2.5 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4 text-left"
              >
                <Text className="flex-1 whitespace-pre-wrap font-['Poppins'] text-base leading-normal text-[#3d3d3d]">
                  {selectedStorage
                    ? STORAGE_OPTIONS_STATIC.find((s) => s.value === selectedStorage)?.label ?? selectedStorage
                    : "Select storage"}
                </Text>
                <ChevronDown />
              </Button>
              {openDropdown === "storage" && (
                <div className="relative z-10 flex w-full flex-col gap-2.5 overflow-clip rounded-xl border border-solid border-[#e4e4e4] bg-white p-4 pr-6">
                  {STORAGE_OPTIONS_STATIC.map((opt) => (
                    <Button
                      key={opt.value}
                      type="button"
                      onClick={() => { setSelectedStorage(opt.value); setOpenDropdown(null); }}
                      className={`flex w-full items-center gap-2.5 rounded-xl border border-solid px-4 py-3 ${
                        selectedStorage === opt.value ? "border-[#2563eb] bg-white" : "border-[#e4e4e4] bg-white"
                      }`}
                    >
                      <Text className={`flex-1 whitespace-pre-wrap text-left font-['Poppins'] text-base leading-normal ${
                        selectedStorage === opt.value ? "text-[#3d3d3d]" : "text-[#828282]"
                      }`}>{opt.label}</Text>
                      <div className="relative size-6 overflow-clip">
                        {selectedStorage === opt.value ? <RadioSelected /> : <RadioUnselected />}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              <input type="hidden" value={selectedStorage} {...register("storage")} />
            </div>
          </div>

          {/* Battery Health */}
          <div className="flex w-full flex-col gap-2">
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Battery Health</Text>
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
            <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Description</Text>
            <div className="flex w-full flex-col gap-2 rounded-[10px] border border-solid border-[#e4e4e4] bg-white p-4">
              <textarea
                placeholder="Describe what you're selling, in detail"
                className="min-h-[160px] w-full resize-none font-['Poppins'] text-base leading-normal text-[#3d3d3d] outline-none placeholder:text-[#c7c7c7]"
                maxLength={500}
                {...register("description")}
              />
              <div className="flex w-full items-center justify-between text-[#828282]">
                <p className="font-['Poppins'] text-sm leading-normal">Describe what you're selling, in detail</p>
                <p className="font-['Poppins'] text-xs leading-normal">({descriptionValue.length}/500)</p>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
              <Text className="font-['Poppins'] text-base leading-normal text-[#3d3d3d]">Location</Text>
              <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">*</Text>
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
              <ChevronRight />
            </Button>
            {errors.location?.message && (
              <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">
                {errors.location.message}
              </Text>
            )}
          </div>
        </>
      )}

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="flex items-center gap-1">
          <Text className="font-['Poppins'] text-lg leading-normal text-[#212121]">
            I confirm this item is not stolen or prohibited
          </Text>
          <Text className="font-['Poppins'] text-sm leading-normal text-[#ef4444]">*</Text>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          type="button"
          onClick={onSaveDraft}
          disabled={isSavingDraft}
          className="flex h-14 w-[320px] items-center justify-center rounded-xl border border-[#e4e4e4] bg-white px-10 py-4 text-[#212121] hover:bg-neutral-5 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Text className="font-['Poppins'] text-base font-medium leading-normal">
            {isSavingDraft ? "Saving draft..." : "Save as draft"}
          </Text>
        </Button>
        <Button
          type="button"
          onClick={onReview}
          className="flex h-14 w-[320px] items-center justify-center rounded-xl border border-[#2563eb] bg-white px-[90px] py-4"
        >
          <Text className="font-['Poppins'] text-base font-medium leading-normal text-[#2563eb]">
            Review
          </Text>
        </Button>
        <Button
          type="submit"
          className="flex h-14 w-[320px] items-center justify-center rounded-xl bg-[#2563eb] px-[90px] py-4"
        >
          <Text className="font-['Poppins'] text-base font-medium leading-normal text-white">
            Publish
          </Text>
        </Button>
      </div>
    </div>
  );
};
