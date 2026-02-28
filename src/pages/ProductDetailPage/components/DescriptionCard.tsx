import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";

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
        <Text
          variant="muted"
          className={`text-sm ${!expanded ? "max-h-20 overflow-hidden" : ""}`}
        >
          {description}
        </Text>
        <Button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-xs font-semibold text-primary"
        >
          {expanded ? "Show less" : "Show more"}
        </Button>
      </CardContent>
    </Card>
  );
};
