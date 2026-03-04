import { Card, CardContent } from "@/components/ui/Card/Card";
import { Span } from "@/components/ui/Span/span";
import { useTranslation } from "react-i18next";

interface FeatureItem {
  label: string;
  value: string;
}

interface KeyFeaturesCardProps {
  features?: FeatureItem[];
}

export const KeyFeaturesCard = ({ features = [] }: KeyFeaturesCardProps) => {
  const { t } = useTranslation();
  return (
    <Card className="gap-3 rounded-2xl border border-neutral-10 bg-white">
      <CardContent className="space-y-4">
        <h3 className="text-sm font-semibold text-neutral-foreground">
          {t("productDetail.keyFeatures.title", { defaultValue: "Key features" })}
        </h3>
        {features.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {features.map((feature) => (
              <div
                key={`${feature.label}:${feature.value}`}
                className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2"
              >
                <Span variant="muted" className="text-xs">
                  {feature.label}
                </Span>
                <Span className="text-xs font-semibold text-neutral-foreground">
                  {feature.value}
                </Span>
              </div>
            ))}
          </div>
        ) : (
          <Span variant="muted" className="text-xs">
            {t("productDetail.keyFeatures.empty", {
              defaultValue: "No key features available",
            })}
          </Span>
        )}
      </CardContent>
    </Card>
  );
};
