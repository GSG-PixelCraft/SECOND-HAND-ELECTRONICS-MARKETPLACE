import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { ROUTES } from "@/constants/routes";
import { useSendPhoneOTP } from "@/services";

type ApiLikeError = {
  response?: { status?: number };
  code?: string;
  message?: string;
};

export function PhoneVerificationPage() {
  const navigate = useNavigate();
  const sendPhoneOtp = useSendPhoneOTP();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    setError(null);

    try {
      await sendPhoneOtp.mutateAsync({ otpType: "phone_verification" });
      navigate(
        `${ROUTES.VERIFY_PHONE_OTP}?phone=${encodeURIComponent(phoneNumber.trim())}`,
      );
    } catch (error: unknown) {
      const typedError = error as ApiLikeError;
      console.error("Phone OTP send error:", error);
      if (typedError.response?.status === 401) {
        setError("Please sign in first to send a verification code.");
      } else if (typedError.response?.status === 404) {
        setError("Phone verification is currently unavailable.");
      } else if (typedError.response?.status === 500) {
        setError("Server error. Please try again in a moment.");
      } else if (typedError.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (
        typedError.code === "NETWORK_ERROR" ||
        typedError.message?.includes("ERR_NETWORK")
      ) {
        setError("Network error. Check your connection and try again.");
      } else {
        setError("Could not send the verification code. Please try again.");
      }
    }
  };

  return (
    <PageLayout title="Verify Phone" maxWidth="md">
      <div className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Verify your phone number</h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your phone number to receive a verification code.
        </p>

        <input
          type="text"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="+970*********"
          className="mt-4 w-full rounded-md border px-3 py-2"
        />

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleSendCode}
          disabled={!phoneNumber.trim() || sendPhoneOtp.isPending}
          className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-white disabled:bg-gray-300"
        >
          {sendPhoneOtp.isPending ? "Sending..." : "Send code"}
        </button>
      </div>
    </PageLayout>
  );
}
