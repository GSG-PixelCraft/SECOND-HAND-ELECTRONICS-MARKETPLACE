import { Button } from "@/components/ui/Button/button";
import type { FiltersState } from "@/types/filters";

interface Props {
  countries: Array<{ code: string; name: string }>;
  cities: string[];
  location: FiltersState["location"];
  onLocationChange: (
    value: Partial<FiltersState["location"]>,
  ) => void;
  onOpenPermissionModal: () => void;
}

export const LocationSection = ({
  countries,
  cities,
  location,
  onLocationChange,
  onOpenPermissionModal,
}: Props) => {
  const handleCountryChange = (country: string) => {
    onLocationChange({ country, city: "" });
  };

  const handleCityChange = (city: string) => {
    onLocationChange({ city });
  };

  const handleCurrentLocationClick = () => {
    if (location.useCurrentLocation) {
      onLocationChange({ useCurrentLocation: false });
      return;
    }

    onOpenPermissionModal();
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">Location</h3>

      <select
        value={location.country}
        onChange={(e) => handleCountryChange(e.target.value)}
        className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
      >
        <option value="">All countries</option>

        {countries.map((country) => (
          <option key={country.code} value={country.code}>
            {country.name}
          </option>
        ))}
      </select>

      {location.country && cities.length > 0 && (
        <select
          value={location.city}
          onChange={(e) => handleCityChange(e.target.value)}
          className="mb-2 w-full rounded-lg border border-gray-300 px-3 py-2"
        >
          <option value="">Select city</option>

          {cities.slice(0, 100).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}

      <Button
        type="button"
        onClick={handleCurrentLocationClick}
        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors ${
          location.useCurrentLocation
            ? "border-blue-600 bg-blue-50 text-blue-600"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {location.useCurrentLocation
          ? "✓ Using current location"
          : "Use my current location"}
      </Button>
    </div>
  );
};