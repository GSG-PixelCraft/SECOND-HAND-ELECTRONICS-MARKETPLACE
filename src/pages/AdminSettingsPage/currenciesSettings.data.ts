export type Currency = {
  id: string;
  name: string;
  code: string;
  countries: string;
  listings: string;
  exchangeRate: string;
  enabled: boolean;
  hasActiveCountriesOrListings: boolean;
};

export const initialCurrencies: Currency[] = [
  {
    id: "eur",
    name: "Euro",
    code: "EUR",
    countries: "19 countries",
    listings: "32,345",
    exchangeRate: "1 USD = 0.92 EUR",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
  {
    id: "gbp",
    name: "British Pound",
    code: "GBP",
    countries: "4 countries",
    listings: "23,456",
    exchangeRate: "1 USD = 0.78 GBP",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
  {
    id: "jod",
    name: "Jordanian Dinar",
    code: "JOD",
    countries: "1 country",
    listings: "45,678",
    exchangeRate: "1 USD = 0.71 JOD",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
  {
    id: "sar",
    name: "Saudi Riyal",
    code: "SAR",
    countries: "1 country",
    listings: "45,678",
    exchangeRate: "1 USD = 3.75 SAR",
    enabled: false,
    hasActiveCountriesOrListings: false,
  },
  {
    id: "aud",
    name: "Australian Dollar",
    code: "AUD",
    countries: "1 country",
    listings: "10,234",
    exchangeRate: "1 USD = 1.57 AUD",
    enabled: true,
    hasActiveCountriesOrListings: false,
  },
  {
    id: "chf",
    name: "Swiss Franc",
    code: "CHF",
    countries: "2 countries",
    listings: "67,890",
    exchangeRate: "1 USD = 0.88 CHF",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
  {
    id: "cny",
    name: "Chinese Yuan",
    code: "CNY",
    countries: "1 country",
    listings: "34,567",
    exchangeRate: "1 USD = 7.25 CNY",
    enabled: false,
    hasActiveCountriesOrListings: false,
  },
  {
    id: "inr",
    name: "Indian Rupee",
    code: "INR",
    countries: "1 country",
    listings: "90,123",
    exchangeRate: "1 USD = 83.22 INR",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
  {
    id: "brl",
    name: "Brazilian Real",
    code: "BRL",
    countries: "1 country",
    listings: "56,789",
    exchangeRate: "1 USD = 4.91 BRL",
    enabled: true,
    hasActiveCountriesOrListings: false,
  },
  {
    id: "ils",
    name: "Shekel",
    code: "ILS",
    countries: "1 country",
    listings: "23,456",
    exchangeRate: "1 USD = 3.62 ILS",
    enabled: true,
    hasActiveCountriesOrListings: true,
  },
];
