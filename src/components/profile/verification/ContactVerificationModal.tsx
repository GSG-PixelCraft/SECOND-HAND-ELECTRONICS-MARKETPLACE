import { COUNTRY_DIAL_OPTIONS, OTP_LENGTH } from "@/constants/verification";
import type {
  EmailVerificationFlow,
  PhoneVerificationFlow,
} from "@/hooks/useContactVerification";

export const VerificationOverlay = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-lg bg-white p-8">{children}</div>
    </div>
  );
};

export const OtpInputGroup = ({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: string[];
  onChange: (index: number, digit: string) => void;
}) => (
  <div className="mb-4 flex items-center justify-center gap-2">
    {value.map((digit, index) => (
      <input
        key={`${idPrefix}-${index}`}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={digit}
        onChange={(e) => onChange(index, e.target.value.replace(/\D/g, ""))}
        className="h-11 w-11 rounded-md border text-center"
      />
    ))}
  </div>
);

export const ContactVerificationModal = ({
  type,
  flow,
}: { type: "phone"; flow: PhoneVerificationFlow } | { type: "email"; flow: EmailVerificationFlow }) => {
  if (!flow.isOpen) return null;
  const title = type === "phone" ? "Verify phone number" : "Verify email address";
  const successTitle = type === "phone" ? "Phone verified" : "Email verified";
  const description = type === "phone" ? "Enter your phone number below." : "Enter your email address.";

  const renderInput = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="mb-6 text-gray-600">{description}</p>
      <input
        type={type === "phone" ? "tel" : "email"}
        value={flow.value}
        onChange={(e) => flow.setValue(e.target.value)}
        placeholder={type === "phone" ? "+970 59 000 0000" : "name@example.com"}
        className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      {flow.error && <p className="mb-3 text-sm text-red-600">{flow.error}</p>}
      <button
        type="button"
        onClick={flow.requestCode}
        disabled={!flow.value.trim() || flow.isSending}
        className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
      >
        {flow.isSending ? "Sending..." : "Send code"}
      </button>
      <button type="button" onClick={flow.close} className="w-full py-2 text-gray-600">
        Cancel
      </button>
    </>
  );

  const renderOtp = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="mb-6 text-gray-600">Enter the {OTP_LENGTH}-digit verification code.</p>
      <OtpInputGroup idPrefix={`${type}-otp`} value={flow.otp} onChange={flow.onOtpChange} />
      {flow.error && <p className="mb-3 text-sm text-red-600">{flow.error}</p>}
      <button
        type="button"
        onClick={flow.verifyCode}
        disabled={flow.otp.join("").length !== OTP_LENGTH || flow.isVerifying}
        className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
      >
        {flow.isVerifying ? "Verifying..." : "Verify"}
      </button>
      <div className="text-center text-sm">
        <button type="button" onClick={flow.resendCode} className="text-blue-600">
          Resend code
        </button>
      </div>
    </>
  );

  const renderChange = () => {
    if (type !== "phone" || !("startChange" in flow)) return null;
    return (
      <>
        <h2 className="mb-2 text-xl font-bold">Change phone number</h2>
        <p className="mb-6 text-gray-600">We will send a verification code to your new phone number.</p>
        <div className="mb-4">
          <div className="flex items-center rounded-lg border px-4 py-3">
            <div className="relative flex-1">
              <select
                value={flow.countryDialCode}
                onChange={(e) => flow.setCountryDialCode(e.target.value)}
                className="w-full appearance-none bg-transparent pr-8 text-sm outline-none"
              >
                {COUNTRY_DIAL_OPTIONS.map((item) => (
                  <option key={`${item.name}-${item.dialCode}`} value={item.dialCode}>
                    {item.dialCode} {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <input
          type="tel"
          value={flow.value}
          onChange={(e) => flow.setValue(e.target.value)}
          placeholder="59 000 0000"
          className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
        />
        {flow.error && <p className="mb-3 text-sm text-red-600">{flow.error}</p>}
        <button
          type="button"
          onClick={flow.requestCode}
          disabled={!flow.value.trim() || flow.isSending}
          className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
        >
          {flow.isSending ? "Sending..." : "Send code"}
        </button>
        <button type="button" onClick={flow.close} className="w-full py-2 text-gray-600">
          Cancel
        </button>
      </>
    );
  };

  const renderSuccess = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{successTitle}</h2>
      <p className="mb-6 text-gray-600">
        {type === "phone"
          ? "Your phone number has been verified successfully."
          : "Your email address has been verified successfully."}
      </p>
      <button type="button" onClick={flow.close} className="w-full rounded-md bg-blue-600 py-2 text-white">
        Done
      </button>
    </>
  );

  const content = (() => {
    switch (flow.step) {
      case "input":
        return renderInput();
      case "otp":
        return renderOtp();
      case "change":
        return renderChange();
      case "success":
        return renderSuccess();
      default:
        return null;
    }
  })();

  return <VerificationOverlay isOpen={flow.isOpen} onClose={flow.close}>{content}</VerificationOverlay>;
};

export const IdentityVerificationModal = ({
  isOpen,
  onClose,
  onStart,
  status = "not_started",
}: {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  status?: "not_started" | "pending" | "approved" | "rejected" | "waiting" | "uploading";
}) => {
  if (!isOpen) return null;
  const isPending = status === "pending";
  return (
    <VerificationOverlay isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-2 text-xl font-bold">Verify your identity</h2>
      <p className="mb-6 text-gray-600">
        Upload a valid government issued ID to unlock additional account features.
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-4 text-sm text-gray-600">
        <li>Have your passport or national ID ready.</li>
        <li>We will guide you through secure photo uploads.</li>
        <li>Review usually takes only a few minutes.</li>
      </ul>
      <button type="button" onClick={onStart} className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white">
        {isPending ? "Continue submission" : "Start verification"}
      </button>
      <button type="button" onClick={onClose} className="w-full py-2 text-gray-600">
        Maybe later
      </button>
    </VerificationOverlay>
  );
};
