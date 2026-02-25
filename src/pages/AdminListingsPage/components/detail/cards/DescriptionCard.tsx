import { forwardRef, useState } from "react";
import { Text } from "@/components/ui/Text/text";
import { truncateText } from "@/lib/listing-utils";

export interface DescriptionCardProps {
  description: string;
  maxLength?: number;
}

export const DescriptionCard = forwardRef<HTMLDivElement, DescriptionCardProps>(
  ({ description, maxLength = 300 }, ref) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const shouldTruncate = description.length > maxLength;
    const displayText =
      isExpanded || !shouldTruncate
        ? description
        : truncateText(description, maxLength);

    const toggleExpanded = () => {
      setIsExpanded((prev) => !prev);
    };

    return (
      <div
        ref={ref}
        className="rounded-xl border border-neutral-20 bg-white p-4"
      >
        <h2 className="text-neutral-90 mb-4 text-lg font-medium">
          Description
        </h2>
        <div className="space-y-3">
          <Text variant="body" className="text-neutral-60 leading-relaxed">
            {displayText}
          </Text>
          {shouldTruncate && (
            <button
              onClick={toggleExpanded}
              className="text-sm font-medium text-blue-600 transition-colors hover:underline"
            >
              {isExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>
      </div>
    );
  },
);

DescriptionCard.displayName = "DescriptionCard";
