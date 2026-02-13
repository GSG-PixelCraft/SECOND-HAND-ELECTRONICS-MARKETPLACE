import type {
  CategoryAttribute,
  CategoryAttributeType,
  CreateCategoryPayload,
} from "@/types/admin";
import type { EditableCategoryAttribute } from "./AttributeEditorCard";

const createTempId = () => `TMP-${Math.random().toString(36).slice(2, 10)}`;

export const createEmptyEditableAttribute = (): EditableCategoryAttribute => ({
  id: createTempId(),
  name: "",
  type: "",
  isActive: false,
  options: [],
  optionsText: "",
});

const requiresOptions = (type: CategoryAttributeType | "") =>
  type === "select_dropdown" || type === "checkboxes";

const requiresToggleOptions = (type: CategoryAttributeType | "") =>
  type === "toggle";

const getParsedOptions = (attribute: EditableCategoryAttribute) => {
  const source = attribute.optionsText ?? attribute.options?.join(", ") ?? "";
  return source
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);
};

const hasMeaningfulContent = (attribute: EditableCategoryAttribute) =>
  Boolean(
    attribute.name.trim() ||
    attribute.type ||
    attribute.options?.length ||
    attribute.optionsText?.trim() ||
    attribute.toggleOption1?.trim() ||
    attribute.toggleOption2?.trim(),
  );

const isAttributeComplete = (attribute: EditableCategoryAttribute) => {
  if (!hasMeaningfulContent(attribute)) return false;
  if (!attribute.name.trim() || !attribute.type) return false;

  if (requiresOptions(attribute.type)) {
    return getParsedOptions(attribute).length > 0;
  }

  if (requiresToggleOptions(attribute.type)) {
    return Boolean(
      attribute.toggleOption1?.trim() && attribute.toggleOption2?.trim(),
    );
  }

  return true;
};

export const isCategoryFormValid = (
  categoryName: string,
  attributes: EditableCategoryAttribute[],
) => {
  if (!categoryName.trim()) return false;

  const meaningfulAttributes = attributes.filter(hasMeaningfulContent);
  if (!meaningfulAttributes.length) return false;

  return meaningfulAttributes.every(isAttributeComplete);
};

export const toCategoryPayload = (
  name: string,
  iconUrl: string | undefined,
  categoryStatus: boolean,
  attributes: EditableCategoryAttribute[],
): CreateCategoryPayload => {
  const normalizedAttributes: CategoryAttribute[] = attributes
    .filter(hasMeaningfulContent)
    .map((attribute) => {
      const normalized: CategoryAttribute = {
        id: attribute.id || createTempId(),
        name: attribute.name.trim(),
        type: attribute.type as CategoryAttributeType,
        isActive: attribute.isActive,
      };

      if (requiresOptions(attribute.type)) {
        normalized.options = getParsedOptions(attribute);
      }

      if (requiresToggleOptions(attribute.type)) {
        normalized.toggleOption1 = attribute.toggleOption1?.trim() || "";
        normalized.toggleOption2 = attribute.toggleOption2?.trim() || "";
      }

      return normalized;
    })
    .filter((attribute) => attribute.name && attribute.type);

  return {
    name: name.trim(),
    iconUrl,
    categoryStatus,
    attributes: normalizedAttributes,
  };
};

export const toEditableAttributes = (
  attributes: CategoryAttribute[],
): EditableCategoryAttribute[] => {
  return attributes.map((attribute) => ({
    ...attribute,
    options: attribute.options || [],
    optionsText: attribute.options?.join(", ") || "",
    toggleOption1: attribute.toggleOption1 || "",
    toggleOption2: attribute.toggleOption2 || "",
  }));
};

export const isTemporaryAttribute = (id: string) => id.startsWith("TMP-");
