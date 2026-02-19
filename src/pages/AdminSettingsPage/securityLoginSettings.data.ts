export type SecurityForm = {
  twoFactorEnabled: boolean;
  twoFactorMethod: "sms" | "auth";
};

export type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type PasswordVisibility = {
  currentPassword: boolean;
  newPassword: boolean;
  confirmNewPassword: boolean;
};

export const initialSecurityForm: SecurityForm = {
  twoFactorEnabled: false,
  twoFactorMethod: "sms",
};

export const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

export const initialPasswordVisibility: PasswordVisibility = {
  currentPassword: false,
  newPassword: false,
  confirmNewPassword: false,
};

export const defaultOtpDigits = ["1", "5", "3", "8", "2", "1"];

export const passwordFields: Array<{
  key: keyof PasswordForm;
  label: string;
}> = [
  { key: "currentPassword", label: "Current Password" },
  { key: "newPassword", label: "New Password" },
  { key: "confirmNewPassword", label: "Confirm New Password" },
];

export const modalCardClass =
  "w-full max-w-[404px] rounded-[16px] bg-white px-6 pb-6 pt-5 shadow-[0px_8px_24px_rgba(0,0,0,0.12)]";

export const otpInputClass =
  "flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#3B82F6] bg-white text-[24px] font-medium text-[#3D3D3D]";
