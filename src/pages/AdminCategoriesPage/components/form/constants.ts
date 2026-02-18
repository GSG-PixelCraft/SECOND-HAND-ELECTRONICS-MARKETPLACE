import type { CategoryAttributeType } from "@/types/admin";

export interface CategoryAttributeTypeOption {
  value: CategoryAttributeType;
  label: string;
}

export const CATEGORY_ATTRIBUTE_TYPE_OPTIONS: CategoryAttributeTypeOption[] = [
  { value: "select_dropdown", label: "Select (DropDown)" },
  { value: "text_input", label: "Text Input" },
  { value: "number_input", label: "Number Input" },
  { value: "checkboxes", label: "checkboxes" },
  { value: "toggle", label: "Toggle" },
  { value: "date_picker", label: "Date Picker" },
  { value: "textarea", label: "Textarea" },
];

export const getCategoryAttributeTypeLabel = (
  type?: CategoryAttributeType | "",
) => {
  if (!type) return "Select type";
  return (
    CATEGORY_ATTRIBUTE_TYPE_OPTIONS.find((option) => option.value === type)
      ?.label || "Select type"
  );
};
