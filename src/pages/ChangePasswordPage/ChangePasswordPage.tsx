import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import PageLayout from "@/components/layout/PageLayout";
import { Lock } from "lucide-react";

const changePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement change password API call
      console.log("Change password:", data);
      // Navigate to sign in page
      navigate(ROUTES.SIGN_IN);
    } catch (error) {
      console.error("Change password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Change Password" maxWidth="md" centerContent>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-h2 font-semibold">Create New Password</h1>
          <p className="text-body text-muted-foreground">
            Your new password must be different from previously used passwords.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              {...register("newPassword")}
              error={errors.newPassword?.message}
              autoComplete="new-password"
            />
          </div>

          <div>
            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />
          </div>

          <div className="rounded-md bg-neutral-5 p-3">
            <p className="mb-2 text-caption text-muted-foreground">
              Password must contain:
            </p>
            <ul className="list-inside list-disc space-y-1 text-caption text-muted-foreground">
              <li>At least 8 characters</li>
              <li>One uppercase letter</li>
              <li>One lowercase letter</li>
              <li>One number</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            intent="primary"
            size="lg"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </PageLayout>
  );
}
