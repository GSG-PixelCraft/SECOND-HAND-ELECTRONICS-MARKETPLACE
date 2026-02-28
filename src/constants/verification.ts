import { countries } from "countries-list";

export const OTP_LENGTH = 4;

export const createEmptyOtp = () => Array.from({ length: OTP_LENGTH }, () => "");

export const COUNTRY_DIAL_OPTIONS = Object.values(countries)
  .map((country) => {
    const firstDial = country.phone?.[0];
    return {
      name: country.name,
      dialCode: firstDial ? `+${firstDial}` : "",
    };
  })
  .filter((item) => Boolean(item.dialCode))
  .sort((a, b) => a.name.localeCompare(b.name));

