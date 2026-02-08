import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

  const newPasswordInvalid = submitted && !passwordRegex.test(newPassword);

  const confirmInvalid = submitted && confirmPassword !== newPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!passwordRegex.test(newPassword)) return;
    if (confirmPassword !== newPassword) return;

    // Future API call here
    console.log("Password updated (dummy)");
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

        <Button
          type="submit"
          className="mt-4 w-full rounded-md bg-primary py-3 font-semibold text-white transition hover:opacity-90"
        >
          Change password
        </Button>
      </form>
    </section>
  );
};
