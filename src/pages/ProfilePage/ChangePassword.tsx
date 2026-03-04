import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";

// ──────────────────────────────────────────────────────────────────────────────
// Schemas
// ──────────────────────────────────────────────────────────────────────────────
const passwordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Za-z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

type Step = "password" | "otp" | "success";

// ──────────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────────
export const ChangePassword = () => {
  const user = useAuthStore((state) => state.user);
  const [step, setStep] = useState<Step>("password");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({ resolver: zodResolver(passwordSchema) });

  // Step 1 → send OTP
  const sendOtpMutation = useMutation({
    mutationFn: () =>
      authService.sendVerificationCode({ email: user?.email ?? "" }),
    onSuccess: () => {
      toast.success("Verification code sent to your email.");
      setStep("otp");
    },
    onError: () => {
      toast.error("Failed to send verification code. Please try again.");
    },
  });

  // Step 2 → verify OTP + reset password in one shot
  const verifyAndResetMutation = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      // First verify the OTP to get a short-lived token
      const verifyRes = await authService.verifyCode({
        code,
        type: "password_reset",
        email: user?.email ?? "",
      });
      const token = verifyRes.data?.token ?? null;

      // Then reset the password with that token
      await authService.resetPassword(
        {
          newPassword: passwords.newPassword,
          confirmPassword: passwords.confirmPassword,
        },
        token,
      );
    },
    onSuccess: () => {
      toast.success("Password changed successfully.");
      setStep("success");
    },
    onError: () => {
      toast.error("Invalid or expired code. Please try again.");
    },
  });

  const onPasswordSubmit = (data: PasswordFormData) => {
    setPasswords(data);
    sendOtpMutation.mutate();
  };

  const inputBase =
    "h-11 w-full rounded-md border px-3 pr-10 text-body text-neutral-foreground focus:outline-none";

  // ── Step: success ──────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <section className="rounded-lg border border-neutral-20 bg-white p-6">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <CheckCircle2 size={48} className="text-success" />
          <h2 className="text-lg font-semibold text-neutral-foreground">
            Password Changed
          </h2>
          <Text variant="muted" className="text-caption">
            Your password has been updated successfully.
          </Text>
          <Button
            type="button"
            onClick={() => {
              setStep("password");
              setOtp("");
            }}
            className="mt-2 rounded-md bg-primary px-6 py-2 text-body text-primary-foreground"
          >
            Done
          </Button>
        </div>
      </section>
    );
  }

  // ── Step: otp ──────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <section className="rounded-lg border border-neutral-20 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-foreground">
          Enter Verification Code
        </h2>
        <Text variant="muted" className="mb-6 text-caption">
          A 6-digit code was sent to{" "}
          <span className="font-medium text-neutral-foreground">
            {user?.email ?? "your email"}
          </span>
          .
        </Text>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="text-body font-medium text-neutral-foreground">
              Verification code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              className={`${inputBase} border-neutral-20 text-center tracking-widest focus:border-primary`}
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => setStep("password")}
              disabled={verifyAndResetMutation.isPending}
              className="flex-1 rounded-md bg-neutral-10 py-3 text-body text-neutral-foreground"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={() => verifyAndResetMutation.mutate({ code: otp })}
              disabled={otp.length < 6 || verifyAndResetMutation.isPending}
              className="flex-1 rounded-md bg-primary py-3 text-body font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {verifyAndResetMutation.isPending ? "Verifying…" : "Confirm"}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => sendOtpMutation.mutate()}
            disabled={sendOtpMutation.isPending}
            className="w-full text-center text-caption text-primary underline-offset-2 hover:underline disabled:opacity-50"
          >
            {sendOtpMutation.isPending ? "Resending…" : "Resend code"}
          </button>
        </div>
      </section>
    );
  }

  // ── Step: password (default) ───────────────────────────────────────────────
  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="text-lg font-semibold text-neutral-foreground">
        Change Password
      </h2>
      <Text variant="muted" className="mb-6 text-caption">
        A verification code will be sent to your email to confirm the change.
      </Text>

      <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-body font-medium text-neutral-foreground">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              {...register("newPassword")}
              className={`${inputBase} ${
                errors.newPassword
                  ? "border-error focus:border-error"
                  : "border-neutral-20 focus:border-primary"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {errors.newPassword && (
            <Text variant="error" className="text-caption">
              {errors.newPassword.message}
            </Text>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-body font-medium text-neutral-foreground">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              className={`${inputBase} ${
                errors.confirmPassword
                  ? "border-error focus:border-error"
                  : "border-neutral-20 focus:border-primary"
              }`}
            />
            <Button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
          {errors.confirmPassword && (
            <Text variant="error" className="text-caption">
              {errors.confirmPassword.message}
            </Text>
          )}
        </div>

        <Button
          type="submit"
          disabled={sendOtpMutation.isPending}
          className="mt-4 w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {sendOtpMutation.isPending ? "Sending code…" : "Continue"}
        </Button>
      </form>
    </section>
  );
};
