import { Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/Switch/switch";
import type { CategoryAttribute, CategoryAttributeType } from "@/types/admin";
import { AttributeTypeDropdown } from "./AttributeTypeDropdown";
import { getCategoryAttributeTypeLabel } from "./constants";

export type EditableCategoryAttribute = Omit<CategoryAttribute, "type"> & {
  type: CategoryAttributeType | "";
  optionsText?: string;
};

export interface AttributeEditorCardProps {
  attribute: EditableCategoryAttribute;
  onChange: (next: EditableCategoryAttribute) => void;
  onDelete: () => void;
}

const inputClassName =
  "h-12 w-full rounded-xl border border-neutral-20 px-4 text-sm text-neutral-90 placeholder:text-neutral-40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

const disabledInputClassName =
  "h-12 w-full rounded-xl border border-neutral-20 bg-neutral-10 px-4 text-sm text-neutral-40";

const usesOptionsInput = (type: CategoryAttributeType | "") =>
  type === "select_dropdown" || type === "checkboxes";

const parseOptionsInput = (value: string) =>
  value
    .split(",")
    .map((option) => option.trim())
    .filter(Boolean);

export function AttributeEditorCard({
  attribute,
  onChange,
  onDelete,
}: AttributeEditorCardProps) {
  const optionsText =
    attribute.optionsText ?? (attribute.options?.join(", ") || "");

  return (
    <div className="rounded-2xl border border-neutral-10 p-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr_auto_auto] lg:items-end">
        <div className="space-y-2">
          <label className="text-neutral-80 text-sm font-medium">
            Attribute Name
          </label>
          <input
            value={attribute.name}
            onChange={(event) =>
              onChange({ ...attribute, name: event.target.value })
            }
            placeholder="Enter attribute name"
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="text-neutral-80 text-sm font-medium">Type</label>
          <AttributeTypeDropdown
            value={attribute.type}
            onChange={(type) => onChange({ ...attribute, type })}
          />
        </div>

        <div className="pb-[10px]">
          <Switch
            checked={attribute.isActive}
            onCheckedChange={(isActive) => onChange({ ...attribute, isActive })}
          />
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="mb-2 text-error transition-colors hover:text-error/80"
          aria-label="Delete attribute"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4">
        {usesOptionsInput(attribute.type) ? (
          <div className="space-y-2">
            <label className="text-neutral-80 text-sm font-medium">
              Options (Comma Seperated)
            </label>
            <input
              value={optionsText}
              onChange={(event) =>
                onChange({
                  ...attribute,
                  optionsText: event.target.value,
                  options: parseOptionsInput(event.target.value),
                })
              }
              placeholder="Enter options"
              className={inputClassName}
            />
          </div>
        ) : null}

        {attribute.type === "toggle" ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-neutral-80 text-sm font-medium">
                Option 1
              </label>
              <input
                value={attribute.toggleOption1 || ""}
                onChange={(event) =>
                  onChange({ ...attribute, toggleOption1: event.target.value })
                }
                placeholder="Enter first option"
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <label className="text-neutral-80 text-sm font-medium">
                Option 2
              </label>
              <input
                value={attribute.toggleOption2 || ""}
                onChange={(event) =>
                  onChange({ ...attribute, toggleOption2: event.target.value })
                }
                placeholder="Enter second option"
                className={inputClassName}
              />
            </div>
          </div>
        ) : null}

        {attribute.type &&
        !usesOptionsInput(attribute.type) &&
        attribute.type !== "toggle" ? (
          <div className="space-y-2">
            <label className="text-neutral-80 text-sm font-medium">
              Options (Comma Seperated)
            </label>
            <input
              value=""
              readOnly
              placeholder={`Not Applicable for ${getCategoryAttributeTypeLabel(attribute.type)}`}
              className={disabledInputClassName}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
