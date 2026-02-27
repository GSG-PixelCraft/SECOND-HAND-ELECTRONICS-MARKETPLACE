import { useEffect, useState } from "react";
import { Text } from "@/components/ui/Text/text";
import { useProfile, useUpdateProfile } from "@/services/profile.service";

export const LanguageSettings = () => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("ILS");

  useEffect(() => {
    if (profile?.language) {
      setLanguage(profile.language);
    }
    if (profile?.currency) {
      setCurrency(profile.currency);
    }
  }, [profile?.currency, profile?.language]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    updateProfile.mutate({ language: value });
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    updateProfile.mutate({ currency: value });
  };

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="mb-2 text-lg font-semibold text-neutral-foreground">
        Language & Currency
      </h2>
      {isLoading && (
        <Text className="mb-4 text-sm text-muted-foreground">Loading...</Text>
      )}

      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="language"
            className="text-body font-medium text-neutral-foreground"
          >
            Language
          </label>

          <select
            id="language"
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="h-11 rounded-md border border-neutral-20 bg-white px-3 text-body text-neutral-foreground focus:border-primary focus:outline-none"
            disabled={isLoading || updateProfile.isPending}
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="currency"
            className="text-body font-medium text-neutral-foreground"
          >
            Currency
          </label>

          <select
            id="currency"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="h-11 rounded-md border border-neutral-20 bg-white px-3 text-body text-neutral-foreground focus:border-primary focus:outline-none"
            disabled={isLoading || updateProfile.isPending}
          >
            <option value="ILS">ILS</option>
            <option value="USD">USD</option>
            <option value="JOD">JOD</option>
          </select>
        </div>
      </div>
    </section>
  );
};
