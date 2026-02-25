export type ProfileForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  language: string;
  timezone: string;
};

export const initialProfileForm: ProfileForm = {
  firstName: "Ahmad",
  lastName: "Al Sayed",
  email: "ahmad.alsayed@example.com",
  phone: "+970 597762777",
  language: "English",
  timezone: "Palestine (UTC +2 / UTC +3)",
};

export const initialProfileImage = "https://i.pravatar.cc/280?img=68";

export const languageOptions = ["English"];
export const timezoneOptions = ["Palestine (UTC +2 / UTC +3)"];
