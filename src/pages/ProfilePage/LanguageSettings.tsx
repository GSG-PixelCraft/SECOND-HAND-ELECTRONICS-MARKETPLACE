import { useState } from "react";

export const LanguageSettings = () => {
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("ILS");

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="mb-6 text-lg font-semibold text-neutral-foreground">
        Language & Currency
      </h2>

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
            onChange={(e) => setLanguage(e.target.value)}
            className="h-11 rounded-md border border-neutral-20 bg-white px-3 text-body text-neutral-foreground focus:border-primary focus:outline-none"
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
            onChange={(e) => setCurrency(e.target.value)}
            className="h-11 rounded-md border border-neutral-20 bg-white px-3 text-body text-neutral-foreground focus:border-primary focus:outline-none"
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
