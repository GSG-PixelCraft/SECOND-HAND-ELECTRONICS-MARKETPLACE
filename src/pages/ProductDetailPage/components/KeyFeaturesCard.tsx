import { Card, CardContent } from "@/components/ui/Card";

interface FeatureItem {
  label: string;
  value: string;
}

interface KeyFeaturesCardProps {
  features: FeatureItem[];
}

export const KeyFeaturesCard = ({ features }: KeyFeaturesCardProps) => {
  return (
    <Card className="gap-3 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-foreground">
          Key features
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.label}
              className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2"
            >
              <span className="text-xs text-muted-foreground">
                {feature.label}
              </span>
              <span className="text-xs font-semibold text-neutral-foreground">
                {feature.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
