import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Type, Hash, ToggleLeft, List, Calendar } from "lucide-react";

export interface AttributeTypeOption {
  value: string;
  label: string;
  description: string;
  icon: ReactNode;
}

export interface AttributeTypeOptionsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onSelect"
> {
  selectedValue?: string;
  onSelect?: (value: string) => void;
  options?: AttributeTypeOption[];
}

const defaultOptions: AttributeTypeOption[] = [
  {
    value: "text",
    label: "Text",
    description: "Single line text input",
    icon: <Type className="h-5 w-5" />,
  },
  {
    value: "number",
    label: "Number",
    description: "Numeric values only",
    icon: <Hash className="h-5 w-5" />,
  },
  {
    value: "boolean",
    label: "Boolean",
    description: "Yes/No or True/False",
    icon: <ToggleLeft className="h-5 w-5" />,
  },
  {
    value: "select",
    label: "Select",
    description: "Dropdown with predefined options",
    icon: <List className="h-5 w-5" />,
  },
  {
    value: "date",
    label: "Date",
    description: "Date picker",
    icon: <Calendar className="h-5 w-5" />,
  },
];

export const AttributeTypeOptions = forwardRef<
  HTMLDivElement,
  AttributeTypeOptionsProps
>(
  (
    { selectedValue, onSelect, options = defaultOptions, className, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-72 rounded-lg border border-neutral-20 bg-white p-2 shadow-lg",
          className,
        )}
        {...props}
      >
        <Text
          variant="body"
          className="text-neutral-90 mb-2 px-2 font-semibold"
        >
          Select Attribute Type
        </Text>

        <div className="space-y-1">
          {options.map((option) => {
            const isSelected = selectedValue === option.value;

            return (
              <button
                key={option.value}
                onClick={() => onSelect?.(option.value)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-md p-3 text-left transition-all",
                  isSelected
                    ? "border border-primary/20 bg-primary/10"
                    : "hover:bg-neutral-5",
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 rounded-lg p-2",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "text-neutral-60 bg-neutral-10",
                  )}
                >
                  {option.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <Text
                    variant="body"
                    className={cn(
                      "mb-0.5 font-semibold",
                      isSelected ? "text-primary" : "text-neutral-90",
                    )}
                  >
                    {option.label}
                  </Text>
                  <Span variant="caption" className="text-neutral-60">
                    {option.description}
                  </Span>
                </div>
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  },
);

AttributeTypeOptions.displayName = "AttributeTypeOptions";
