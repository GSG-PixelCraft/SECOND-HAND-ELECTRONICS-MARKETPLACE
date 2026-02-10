import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ROUTES } from "@/constants/routes";
import { authService } from "@/services/auth.service";
import type { AxiosError } from "axios";

const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export default function ForgotPasswordEmailPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
    mode: "onChange",
  });

  const emailValue = watch("email");

  const onSubmit = async (data: ForgotPasswordEmailFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await authService.sendVerificationCode({
        otpType: "email_verification",
        email: data.email.trim(),
      });
      // Navigate to OTP screen
      navigate(ROUTES.OTP_EMAIL);
    } catch (error) {
      const apiError = error as AxiosError<{ message?: string }>;
      setSubmitError(
        apiError.response?.data?.message ??
          "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <Link
          to={ROUTES.HOME}
          className="text-base font-semibold text-blue-600"
        >
          Logo
        </Link>
        <span className="w-10" aria-hidden="true" />
      </div>

      <div className="flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-6 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">
            Forget Password
          </h1>
          <p className="text-sm text-gray-400">
            Enter your email to receive a verification code.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                className={`mt-1 block w-full rounded-md border px-3 py-2.5 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
                {...register("email")}
              />
              {errors.email ? (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            {submitError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!isValid || !emailValue || isSubmitting}
              className={`w-full rounded-md px-4 py-3 text-sm font-medium transition ${
                isValid && emailValue && !isSubmitting
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-gray-200 text-gray-400"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Code"}
            </button>
          </form>

          <Link
            to={ROUTES.FORGOT_PASSWORD_PHONE}
            className="text-xs text-gray-600 hover:underline"
          >
            Reset Password via Phone Number
          </Link>
        </div>
      </div>
    </div>
  );
}
