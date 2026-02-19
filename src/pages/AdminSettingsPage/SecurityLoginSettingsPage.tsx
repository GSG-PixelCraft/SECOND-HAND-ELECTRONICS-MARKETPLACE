import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Portal } from "@/components/ui/portal";
import {
  Eye,
  EyeOff,
  X,
  BadgeCheck,
  LogOut,
  TriangleAlert,
} from "lucide-react";
import { Image } from "@/components/ui/image";
import {
  defaultOtpDigits,
  initialPasswordForm,
  initialPasswordVisibility,
  initialSecurityForm,
  modalCardClass,
  otpInputClass,
  passwordFields,
  type PasswordForm,
  type PasswordVisibility,
  type SecurityForm,
} from "./securityLoginSettings.data";

const SecurityLoginSettingsPage = () => {
  const [form, setForm] = useState<SecurityForm>(initialSecurityForm);
  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>(initialPasswordVisibility);
  const [twoFactorStep, setTwoFactorStep] = useState<
    | null
    | "choose-method"
    | "verify-sms"
    | "scan-qr"
    | "verify-auth"
    | "success"
  >(null);
  const [otpDigits] = useState(defaultOtpDigits);
  const [showLogoutAllConfirm, setShowLogoutAllConfirm] = useState(false);

  const updateField = <K extends keyof SecurityForm>(
    key: K,
    value: SecurityForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updatePasswordField = <K extends keyof PasswordForm>(
    key: K,
    value: PasswordForm[K],
  ) => {
    setPasswordForm((prev) => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (key: keyof PasswordVisibility) => {
    setPasswordVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closeOverlay = () => {
    setTwoFactorStep(null);
  };

  const handleTwoFactorToggle = (value: boolean) => {
    if (!value) {
      updateField("twoFactorEnabled", false);
      return;
    }
    setTwoFactorStep("choose-method");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="font-['Poppins'] text-[44px] font-semibold leading-[1.2] text-[#101010] max-[1200px]:text-[32px]">
        Security & Login
      </h1>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <h2 className="font-['Poppins'] text-[24px] font-semibold text-[#101010]">
          Change Password
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-3">
          {passwordFields.map((field) => (
            <div key={field.key} className="flex flex-col gap-2">
              <label className="font-['Poppins'] text-[14px] font-medium text-[#555]">
                {field.label}
              </label>
              <div className="relative">
                <input
                  type={passwordVisibility[field.key] ? "text" : "password"}
                  value={passwordForm[field.key]}
                  onChange={(event) =>
                    updatePasswordField(field.key, event.target.value)
                  }
                  className="h-12 w-full rounded-[10px] border border-[#e2e4e8] bg-white px-4 pr-10 text-[14px] text-[#3D3D3D] outline-none"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                  onClick={() => togglePasswordVisibility(field.key)}
                  aria-label={
                    passwordVisibility[field.key]
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {passwordVisibility[field.key] ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <div className="min-w-[110px]">
            <Button
              intent="primary"
              className="h-9 w-full rounded-[12px] px-4 text-sm"
            >
              Save Password
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-['Poppins'] text-[24px] font-semibold text-[#101010]">
              Two-Factor Authentication
            </h2>
            <span
              className={`rounded-md px-2 py-0.5 text-[12px] font-medium ${
                form.twoFactorEnabled
                  ? "bg-[#DCFCE7] text-[#22C55E]"
                  : "bg-[#eeeeee] text-[#9ca3af]"
              }`}
            >
              {form.twoFactorEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Switch
            checked={form.twoFactorEnabled}
            onCheckedChange={handleTwoFactorToggle}
            className="h-6 w-12"
          />
        </div>
        <p className="mt-4 font-['Poppins'] text-[17px] text-[#444]">
          Adds an extra layer of security to your account. A verification code
          will be required when signing in.
        </p>
      </section>

      <section className="rounded-[18px] border border-[#e8e8e8] bg-white p-6 shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
        <div className="border-b border-[#eceff3] pb-2">
          <div className="inline-flex items-center gap-2 border-b-2 border-[#3B82F6] pb-2">
            <h2 className="font-['Poppins'] text-[28px] font-medium text-[#2563EB]">
              Login Activity
            </h2>
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#DDE7FF] px-1 text-[14px] font-medium text-[#2563EB]">
              3
            </span>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="rounded-[10px] bg-[#EEF3FF] text-left">
                <th className="rounded-l-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Date & Time ^
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Device ^
                </th>
                <th className="px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Status ^
                </th>
                <th className="rounded-r-[10px] px-4 py-3 text-[14px] font-medium text-[#3f3f46]">
                  Action ^
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[#eceff3]">
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  18-10-2026 - 10:42 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  MAC Laptop
                </td>
                <td className="px-4 py-5">
                  <span className="rounded-lg bg-[#DCFCE7] px-3 py-1 text-xs font-medium text-[#22C55E]">
                    Active
                  </span>
                </td>
                <td className="px-4 py-5">
                  <button className="inline-flex items-center gap-2 text-[#2563EB]">
                    <LogOut className="h-4 w-4" />
                    <span className="text-[14px] font-medium">Logout</span>
                  </button>
                </td>
              </tr>
              <tr className="border-b border-[#eceff3]">
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  17-10-2026 - 11:05 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Google Chrome (Windows)
                </td>
                <td className="px-4 py-5">
                  <span className="rounded-lg bg-[#FEE2E2] px-3 py-1 text-xs font-medium text-[#EF4444]">
                    Logged out
                  </span>
                </td>
                <td className="px-4 py-5 text-[24px] leading-none text-[#9ca3af]">
                  ---
                </td>
              </tr>
              <tr>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  16-10-2026 - 9:30 AM
                </td>
                <td className="px-4 py-5 text-[14px] text-[#52525b]">
                  Dell Laptop
                </td>
                <td className="px-4 py-5">
                  <span className="rounded-lg bg-[#EEEEEE] px-3 py-1 text-xs font-medium text-[#9ca3af]">
                    Expired
                  </span>
                </td>
                <td className="px-4 py-5 text-[24px] leading-none text-[#9ca3af]">
                  ---
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            intent="primary"
            className="h-10 rounded-[12px] px-5 text-sm"
            onClick={() => setShowLogoutAllConfirm(true)}
          >
            Log out of all sessions
          </Button>
        </div>
      </section>

      {twoFactorStep ? (
        <Portal>
          <div
            className="z-[2147483647] flex items-center justify-center bg-black/60 p-4"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          >
            {twoFactorStep === "choose-method" ? (
              <div className={modalCardClass}>
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-center text-[20px] font-semibold text-[#2B2B2B]">
                    Choose verification method
                  </h3>
                  <button
                    type="button"
                    onClick={closeOverlay}
                    className="rounded text-[#9ca3af]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-6 text-center text-[14px] text-[#6b7280]">
                  Select how you would like to receive verification codes.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  <label className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      checked={form.twoFactorMethod === "sms"}
                      onChange={() => updateField("twoFactorMethod", "sms")}
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="text-[14px] text-[#444]">SMS</span>
                  </label>
                  <label className="inline-flex items-center gap-3">
                    <input
                      type="radio"
                      checked={form.twoFactorMethod === "auth"}
                      onChange={() => updateField("twoFactorMethod", "auth")}
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="text-[14px] text-[#444]">
                      Authenticator app
                    </span>
                  </label>
                </div>
                <Button
                  intent="primary"
                  className="mt-6 h-11 w-full rounded-[12px] text-[16px] font-medium"
                  onClick={() =>
                    setTwoFactorStep(
                      form.twoFactorMethod === "sms" ? "verify-sms" : "scan-qr",
                    )
                  }
                >
                  Continue
                </Button>
              </div>
            ) : null}

            {twoFactorStep === "verify-sms" ? (
              <div className={modalCardClass}>
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-center text-[20px] font-semibold text-[#2B2B2B]">
                    Verify your phone number
                  </h3>
                  <button
                    type="button"
                    onClick={closeOverlay}
                    className="rounded text-[#9ca3af]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-6 text-center text-[14px] text-[#6b7280]">
                  We&apos;ll send a 6-digit code to your registered phone number
                  <br />
                  <span className="font-semibold">+970 ... ... 777.</span>
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {otpDigits.map((digit, index) => (
                    <div key={index} className={otpInputClass}>
                      {digit}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-[14px] text-[#6b7280]">
                  Didn&apos;t receive the code?{" "}
                  <button className="font-semibold text-[#444]">Resend</button>
                </p>
                <Button
                  intent="primary"
                  className="mt-6 h-11 w-full rounded-[12px] text-[16px] font-medium"
                  onClick={() => setTwoFactorStep("success")}
                >
                  Verify
                </Button>
              </div>
            ) : null}

            {twoFactorStep === "scan-qr" ? (
              <div className={modalCardClass}>
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-center text-[20px] font-semibold text-[#2B2B2B]">
                    Scan QR Code
                  </h3>
                  <button
                    type="button"
                    onClick={closeOverlay}
                    className="rounded text-[#9ca3af]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-5 text-center text-[14px] text-[#6b7280]">
                  Scan the QR code using{" "}
                  <span className="font-medium text-[#3B82F6]">
                    Google Authenticator
                  </span>
                  <br />
                  or <span className="font-medium text-[#3B82F6]">
                    copy
                  </span>{" "}
                  the setup key manually
                </p>
                <div className="mt-5 flex justify-center">
                  <Image
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=electrolink-2fa-demo"
                    alt="QR code"
                    className="h-[180px] w-[180px]"
                  />
                </div>
                <Button
                  intent="primary"
                  className="mt-6 h-11 w-full rounded-[12px] text-[16px] font-medium"
                  onClick={() => setTwoFactorStep("verify-auth")}
                >
                  Continue
                </Button>
              </div>
            ) : null}

            {twoFactorStep === "verify-auth" ? (
              <div className={modalCardClass}>
                <div className="flex items-center justify-between">
                  <h3 className="w-full text-center text-[20px] font-semibold text-[#2B2B2B]">
                    Set up Two-Factor Authentication
                  </h3>
                  <button
                    type="button"
                    onClick={closeOverlay}
                    className="rounded text-[#9ca3af]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-6 text-center text-[14px] text-[#6b7280]">
                  Enter the 6-digit code from your authenticator app.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  {otpDigits.map((digit, index) => (
                    <div key={index} className={otpInputClass}>
                      {digit}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-[14px] text-[#6b7280]">
                  Didn&apos;t receive the code?{" "}
                  <button className="font-semibold text-[#444]">Resend</button>
                </p>
                <Button
                  intent="primary"
                  className="mt-6 h-11 w-full rounded-[12px] text-[16px] font-medium"
                  onClick={() => setTwoFactorStep("success")}
                >
                  Verify
                </Button>
              </div>
            ) : null}

            {twoFactorStep === "success" ? (
              <div className={modalCardClass}>
                <div className="flex justify-center">
                  <BadgeCheck className="h-[62px] w-[62px] text-[#22C55E]" />
                </div>
                <h3 className="mt-4 text-center text-[32px] font-semibold leading-tight text-[#2B2B2B]">
                  Two-Factor Authentication Enabled Successfully
                </h3>
                <p className="mt-3 text-center text-[14px] leading-[1.5] text-[#8b8b8b]">
                  Your account is now protected with an
                  <br />
                  extra layer of security.
                </p>
                <Button
                  intent="primary"
                  className="mt-6 h-11 w-full rounded-[12px] text-[16px] font-medium"
                  onClick={() => {
                    updateField("twoFactorEnabled", true);
                    closeOverlay();
                  }}
                >
                  Done
                </Button>
              </div>
            ) : null}
          </div>
        </Portal>
      ) : null}

      {showLogoutAllConfirm ? (
        <Portal>
          <div
            className="z-[2147483647] flex items-center justify-center p-4"
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            }}
          >
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setShowLogoutAllConfirm(false)}
            />
            <div className="relative w-full max-w-[380px] rounded-[18px] border border-[#e5e7eb] bg-white px-6 pb-6 pt-6 shadow-[0px_18px_40px_rgba(0,0,0,0.32)]">
              <div className="mb-4 flex justify-center">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#FFF4CC]">
                  <TriangleAlert className="h-8 w-8 fill-[#FACC15] text-[#FACC15]" />
                </div>
              </div>
              <h3 className="text-center text-[26px] font-semibold leading-snug text-[#2B2B2B] max-[1200px]:text-[22px]">
                Are you sure you want to log out of all sessions?
              </h3>
              <p className="mt-3 text-center text-[14px] leading-relaxed text-[#8B8B8B]">
                Logging out will end all active sessions on other devices.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <button
                  type="button"
                  className="h-11 w-full rounded-[12px] bg-red-500 px-5 text-[16px] font-medium text-white transition-colors hover:bg-red-600"
                  onClick={() => setShowLogoutAllConfirm(false)}
                >
                  Yes, Logout
                </button>
                <button
                  type="button"
                  className="h-11 w-full rounded-[12px] border border-[#9CA3AF] bg-white px-5 text-[16px] font-medium text-[#6B7280] transition-colors hover:bg-[#f8fafc]"
                  onClick={() => setShowLogoutAllConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Portal>
      ) : null}
    </div>
  );
};

export default SecurityLoginSettingsPage;
