import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button/button";
import { Text } from "@/components/ui/Text/text";
import { authService } from "@/services/auth.service";
import { getBackendErrorMessage } from "@/lib/api-error";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const newPasswordInvalid = submitted && !passwordRegex.test(newPassword);

  const confirmInvalid = submitted && confirmPassword !== newPassword;

  const changePasswordMutation = useMutation({
    mutationFn: authService.resetPassword,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);
    setIsSuccess(false);

    if (!passwordRegex.test(newPassword)) return;
    if (confirmPassword !== newPassword) return;
    if (!currentPassword.trim()) {
      setServerError("Please enter your current password.");
      return;
    }

    changePasswordMutation.mutate(
      { newPassword, confirmPassword },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setServerError(null);
          setSubmitted(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: unknown) => {
          setServerError(
            getBackendErrorMessage(error) ?? "Failed to update password.",
          );
        },
      },
    );
  };

  const inputBase =
    "h-11 w-full rounded-md border px-3 pr-10 text-body text-neutral-foreground focus:outline-none";

  return (
    <section className="rounded-lg border border-neutral-20 bg-white p-6">
      <h2 className="text-lg font-semibold text-neutral-foreground">
        Change Password
      </h2>
      <Text variant="muted" className="mb-6 text-caption">
        Create a new password for your account
      </Text>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col gap-2">
          <label className="text-body font-medium text-neutral-foreground">
            Current Password
          </label>

          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`${inputBase} border-neutral-20 focus:border-primary`}
            />
            <Button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-body font-medium text-neutral-foreground">
            New Password
          </label>

          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`${inputBase} ${
                newPasswordInvalid
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

          {newPasswordInvalid && (
            <Text variant="error" className="text-caption">
              Password must be at least 8 characters and include letters and
              numbers.
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputBase} ${
                confirmInvalid
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

          {confirmInvalid && (
            <Text variant="error" className="text-caption">
              Password confirmation does not match.
            </Text>
          )}
        </div>

        {serverError && (
          <Text variant="error" className="text-sm">
            {serverError}
          </Text>
        )}
        {isSuccess && (
          <Text className="text-sm text-green-600">
            Password updated successfully.
          </Text>
        )}

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="mt-4 w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:opacity-90"
        >
          {changePasswordMutation.isPending ? "Updating..." : "Change password"}
        </Button>
      </form>
    </section>
  );
};
