import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import PageLayout from "@/components/layout/PageLayout";
import { Mail } from "lucide-react";
import { Text } from "@/components/ui/text";

const forgotPasswordEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordEmailFormData = z.infer<typeof forgotPasswordEmailSchema>;

export default function ForgotPasswordEmailPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordEmailFormData>({
    resolver: zodResolver(forgotPasswordEmailSchema),
  });

  const onSubmit = async (data: ForgotPasswordEmailFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement forgot password API call
      console.log("Forgot password email:", data);
      // Navigate to OTP screen
      navigate(ROUTES.OTP_EMAIL);
    } catch (error) {
      console.error("Forgot password error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout title="Forgot Password" maxWidth="md" centerContent>
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-h2 font-semibold">Forgot Password?</h1>
          <Text variant="muted">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </Text>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              error={errors.email?.message}
              autoComplete="email"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            intent="primary"
            size="lg"
          >
            {isSubmitting ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate(ROUTES.SIGN_IN)}
            className="text-bodySmall text-primary hover:underline"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
