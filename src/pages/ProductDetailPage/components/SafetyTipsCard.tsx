import { Card, CardContent } from "@/components/ui/Card";
import { Span } from "@/components/ui/Span/span";

interface SafetyTipsCardProps {
  tips: string[];
}

export const SafetyTipsCard = ({ tips }: SafetyTipsCardProps) => {
  return (
    <Card className="gap-2 rounded-2xl border border-neutral-10 bg-primary-10">
      <CardContent className="space-y-3">
        <h3 className="text-sm font-semibold text-neutral-foreground">
          Safety tips!
        </h3>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {tips.map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <Span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <Span>{tip}</Span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
