import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { Span } from "@/components/ui/span";
import { Type, Hash, ToggleLeft, List, Calendar } from "lucide-react";

export interface AttributeTypeOption {
    value: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

export interface AttributeTypeOptionsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
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

export const AttributeTypeOptions = React.forwardRef<HTMLDivElement, AttributeTypeOptionsProps>(
    (
        {
            selectedValue,
            onSelect,
            options = defaultOptions,
            className,
            ...props
        },
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
                <Text variant="body" className="font-semibold text-neutral-90 mb-2 px-2">
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
                                    "w-full flex items-start gap-3 rounded-md p-3 text-left transition-all",
                                    isSelected
                                        ? "bg-primary/10 border border-primary/20"
                                        : "hover:bg-neutral-5",
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex-shrink-0 rounded-lg p-2",
                                        isSelected
                                            ? "bg-primary/10 text-primary"
                                            : "bg-neutral-10 text-neutral-60",
                                    )}
                                >
                                    {option.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Text
                                        variant="body"
                                        className={cn(
                                            "font-semibold mb-0.5",
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
                                        <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
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
