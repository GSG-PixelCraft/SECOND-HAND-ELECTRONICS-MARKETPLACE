import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";

interface DescriptionCardProps {
  description: string;
}

export const DescriptionCard = ({ description }: DescriptionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="gap-3 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-foreground">
          Description
        </h3>
        <p
          className={`text-sm text-muted-foreground ${
            !expanded ? "max-h-20 overflow-hidden" : ""
          }`}
        >
          {description}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs font-semibold text-primary"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </CardContent>
    </Card>
  );
};
