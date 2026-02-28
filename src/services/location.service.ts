import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface LocationCountry {
  code: string;
  name: string;
}

const extractArray = (payload: unknown): unknown[] => {
  const findArray = (value: unknown, depth = 0): unknown[] => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object" || depth > 4) return [];

    const record = value as Record<string, unknown>;
    const priorityKeys = [
      "data",
      "countries",
      "cities",
      "items",
      "results",
      "list",
      "rows",
    ];

    for (const key of priorityKeys) {
      const found = findArray(record[key], depth + 1);
      if (found.length > 0) return found;
    }

    for (const child of Object.values(record)) {
      const found = findArray(child, depth + 1);
      if (found.length > 0) return found;
    }

    return [];
  };

  return findArray(payload);
};

const toCountry = (item: unknown): LocationCountry | null => {
  if (typeof item === "string") {
    const value = item.trim();
    if (!value) return null;
    return { code: value, name: value };
  }
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;

  const rawCode =
    record.id ??
    record.countryId ??
    record._id ??
    record.code ??
    record.countryCode ??
    record.iso2 ??
    record.isoCode;
  const name =
    (record.name as string) ||
    (record.nameEn as string) ||
    (record.nameAr as string) ||
    (record.title as string) ||
    (record.label as string) ||
    (record.countryName as string) ||
    (record.enName as string) ||
    (record.arName as string) ||
    (record.country as string) ||
    "";
  const code =
    typeof rawCode === "string" || typeof rawCode === "number"
      ? String(rawCode)
      : name;

  if (!code || !name) return null;
  return { code, name };
};

const toCity = (item: unknown): string | null => {
  if (typeof item === "string") return item;
  if (!item || typeof item !== "object") return null;

  const record = item as Record<string, unknown>;
  return (
    (record.name as string) ??
    (record.nameEn as string) ??
    (record.nameAr as string) ??
    (record.city as string) ??
    (record.cityName as string) ??
    null
  );
};

export const fetchCountries = async (): Promise<LocationCountry[]> => {
  try {
    const response = await fetch(`/api${API_ENDPOINTS.LOCATIONS.COUNTRIES}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Countries request failed: ${response.status}`);
    }
    const payload = (await response.json()) as unknown;
    const countries = extractArray(payload)
      .map(toCountry)
      .filter((country): country is LocationCountry => country !== null)
      .sort((a, b) => a.name.localeCompare(b.name));

    if (countries.length === 0) {
      console.warn(
        "Countries endpoint returned no mappable countries.",
        payload,
      );
    }

    return countries;
  } catch (error) {
    console.error("Failed to fetch countries from backend:", error);
    return [];
  }
};

export const fetchCitiesByCountry = async (
  countryCode: string,
): Promise<string[]> => {
  if (!countryCode) return [];
  try {
    const response = await fetch(
      `/api${API_ENDPOINTS.LOCATIONS.CITIES_BY_COUNTRY(countryCode)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      },
    );
    if (!response.ok) {
      throw new Error(`Cities request failed: ${response.status}`);
    }
    const payload = (await response.json()) as unknown;
    return extractArray(payload)
      .map(toCity)
      .filter((city): city is string => Boolean(city));
  } catch (error) {
    console.error(
      `Failed to fetch cities from backend for country "${countryCode}":`,
      error,
    );
    return [];
  }
};
