export type Country = {
  id: string;
  name: string;
  iso2: string;
  currency: string;
  users: number;
  listings: number;
  enabled: boolean;
  hasActiveUsersOrListings: boolean;
};

export const initialCountries: Country[] = [
  {
    id: "c1",
    name: "Palestine",
    iso2: "ps",
    currency: "ILS / JOD",
    users: 1245,
    listings: 338,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c2",
    name: "Jordan",
    iso2: "jo",
    currency: "JOD",
    users: 980,
    listings: 276,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c3",
    name: "Saudi Arabia",
    iso2: "sa",
    currency: "SAR",
    users: 1640,
    listings: 410,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c4",
    name: "United Arab Emirates",
    iso2: "ae",
    currency: "AED",
    users: 730,
    listings: 204,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c5",
    name: "Egypt",
    iso2: "eg",
    currency: "EGP",
    users: 1112,
    listings: 287,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c6",
    name: "Qatar",
    iso2: "qa",
    currency: "QAR",
    users: 402,
    listings: 108,
    enabled: false,
    hasActiveUsersOrListings: false,
  },
  {
    id: "c7",
    name: "Kuwait",
    iso2: "kw",
    currency: "KWD",
    users: 366,
    listings: 94,
    enabled: true,
    hasActiveUsersOrListings: false,
  },
  {
    id: "c8",
    name: "Oman",
    iso2: "om",
    currency: "OMR",
    users: 248,
    listings: 66,
    enabled: false,
    hasActiveUsersOrListings: false,
  },
  {
    id: "c9",
    name: "Lebanon",
    iso2: "lb",
    currency: "LBP",
    users: 190,
    listings: 52,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
  {
    id: "c10",
    name: "Iraq",
    iso2: "iq",
    currency: "IQD",
    users: 519,
    listings: 139,
    enabled: true,
    hasActiveUsersOrListings: true,
  },
];
