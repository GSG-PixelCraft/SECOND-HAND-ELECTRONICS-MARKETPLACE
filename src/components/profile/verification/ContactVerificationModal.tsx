import { COUNTRY_DIAL_OPTIONS, OTP_LENGTH } from "@/constants/verification";
import type {
  EmailVerificationFlow,
  PhoneVerificationFlow,
} from "@/hooks/useContactVerification";
import { OtpInputGroup } from "./OtpInputGroup";
import { VerificationOverlay } from "./VerificationOverlay";

type ContactVerificationModalProps =
  | { type: "phone"; flow: PhoneVerificationFlow }
  | { type: "email"; flow: EmailVerificationFlow };

export const ContactVerificationModal = ({
  type,
  flow,
}: ContactVerificationModalProps) => {
  if (!flow.isOpen) return null;

  const title =
    type === "phone" ? "Verify phone number" : "Verify email address";
  const successTitle =
    type === "phone" ? "Phone verified" : "Email verified";
  const description =
    type === "phone"
      ? "Enter your phone number below."
      : "Enter your email address.";

  const renderInputStep = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="mb-6 text-gray-600">{description}</p>
      <input
        type={type === "phone" ? "tel" : "email"}
        value={flow.value}
        onChange={(event) => flow.setValue(event.target.value)}
        placeholder={type === "phone" ? "+970 59 000 0000" : "name@example.com"}
        className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
      />
      {flow.error && (
        <p className="mb-3 text-sm text-red-600">{flow.error}</p>
      )}
      <button
        type="button"
        onClick={flow.requestCode}
        disabled={!flow.value.trim() || flow.isSending}
        className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
      >
        {flow.isSending ? "Sending..." : "Send code"}
      </button>
      <button
        type="button"
        onClick={flow.close}
        className="w-full py-2 text-gray-600"
      >
        Cancel
      </button>
    </>
  );

  const renderOtpStep = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <p className="mb-6 text-gray-600">
        Enter the {OTP_LENGTH}-digit verification code.
      </p>

      <OtpInputGroup
        idPrefix={`${type}-otp`}
        value={flow.otp}
        onChange={flow.onOtpChange}
      />

      {flow.error && (
        <p className="mb-3 text-sm text-red-600">{flow.error}</p>
      )}

      <button
        type="button"
        onClick={flow.verifyCode}
        disabled={flow.otp.join("").length !== OTP_LENGTH || flow.isVerifying}
        className="mb-4 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
      >
        {flow.isVerifying ? "Verifying..." : "Verify"}
      </button>

      <div className="text-center text-sm">
        <button
          type="button"
          onClick={flow.resendCode}
          className="text-blue-600"
        >
          Resend code
        </button>
        {type === "phone" && "startChange" in flow && (
          <button
            type="button"
            onClick={flow.startChange}
            className="ml-3 text-gray-600"
          >
            Change phone number
          </button>
        )}
      </div>
    </>
  );

  const renderChangeStep = () => {
    if (type !== "phone" || !("startChange" in flow)) return null;
    return (
      <>
        <h2 className="mb-2 text-xl font-bold">Change phone number</h2>
        <p className="mb-6 text-gray-600">
          We will send a verification code to your new phone number.
        </p>
        <div className="mb-4">
          <div className="flex items-center rounded-lg border px-4 py-3">
            <div className="relative flex-1">
              <select
                value={flow.countryDialCode}
                onChange={(event) => flow.setCountryDialCode(event.target.value)}
                className="w-full appearance-none bg-transparent pr-8 text-sm outline-none"
              >
                {COUNTRY_DIAL_OPTIONS.map((item) => (
                  <option
                    key={`${item.name}-${item.dialCode}`}
                    value={item.dialCode}
                  >
                    {item.dialCode} {item.name}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-gray-400">
                ▼
              </span>
            </div>
          </div>
        </div>
        <input
          type="tel"
          value={flow.value}
          onChange={(event) => flow.setValue(event.target.value)}
          placeholder="59 000 0000"
          className="mb-4 w-full rounded-lg border px-4 py-3 text-sm outline-none"
        />
        {flow.error && (
          <p className="mb-3 text-sm text-red-600">{flow.error}</p>
        )}
        <button
          type="button"
          onClick={flow.requestCode}
          disabled={!flow.value.trim() || flow.isSending}
          className="mb-2 w-full rounded-md bg-blue-600 py-2 text-white disabled:bg-gray-300"
        >
          {flow.isSending ? "Sending..." : "Send code"}
        </button>
        <button
          type="button"
          onClick={flow.close}
          className="w-full py-2 text-gray-600"
        >
          Cancel
        </button>
      </>
    );
  };

  const renderSuccessStep = () => (
    <>
      <h2 className="mb-2 text-xl font-bold">{successTitle}</h2>
      <p className="mb-6 text-gray-600">
        {type === "phone"
          ? "Your phone number has been verified successfully."
          : "Your email address has been verified successfully."}
      </p>
      <button
        type="button"
        onClick={flow.close}
        className="w-full rounded-md bg-blue-600 py-2 text-white"
      >
        Done
      </button>
    </>
  );

  const content = (() => {
    switch (flow.step) {
      case "input":
        return renderInputStep();
      case "otp":
        return renderOtpStep();
      case "change":
        return renderChangeStep();
      case "success":
        return renderSuccessStep();
      default:
        return null;
    }
  })();

  return (
    <VerificationOverlay isOpen={flow.isOpen} onClose={flow.close}>
      {content}
    </VerificationOverlay>
  );
};

