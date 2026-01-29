export interface Country {
  code: string;
  name: string;
}

const citiesCache: Record<string, string[]> = {};
export let countries: Country[] = [];

// جلب الدول (يبقى كما هو تقريباً مع التأكد من النوع)
export const fetchCountries = async (): Promise<Country[]> => {
  if (countries.length > 0) return countries;
  try {
    const res = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2",
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    // استبدال any بنوع صريح يطابق الـ API
    const list: Country[] = data
      .map((c: { cca2: string; name: { common: string } }) => ({
        code: c.cca2,
        name: c.name.common,
      }))
      .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

    countries = list;
    return list;
  } catch (err) {
    console.error("Failed to fetch countries:", err);
    return [];
  }
};

// جلب المدن باستخدام CountriesNow
export const fetchCitiesByCountry = async (
  countryName: string,
): Promise<string[]> => {
  if (!countryName) return [];
  if (citiesCache[countryName]) return citiesCache[countryName];

  try {
    const res = await fetch(
      "https://countriesnow.space/api/v0.1/countries/cities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName }), // هذا الـ API يحتاج اسم الدولة وليس الكود
      },
    );

    const result = await res.json();

    if (result.error) throw new Error(result.msg);

    const cities = result.data; // مصفوفة من أسماء المدن مباشرة
    citiesCache[countryName] = cities;
    return cities;
  } catch (err) {
    console.error(`Failed to fetch cities for ${countryName}:`, err);
    return [];
  }
};
