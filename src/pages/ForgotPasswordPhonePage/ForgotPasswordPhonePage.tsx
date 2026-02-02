import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import PageLayout from "@/components/layout/PageLayout";
import { Phone } from "lucide-react";

const forgotPasswordPhoneSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
});

type ForgotPasswordPhoneFormData = z.infer<typeof forgotPasswordPhoneSchema>;

export default function ForgotPasswordPhonePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordPhoneFormData>({
    resolver: zodResolver(forgotPasswordPhoneSchema),
  });

  const onSubmit = async (data: ForgotPasswordPhoneFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement forgot password via phone API call
      console.log("Forgot password phone:", data);
      // Navigate to OTP screen
      navigate(ROUTES.OTP_PHONE);
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
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-h2 font-semibold">Forgot Password?</h1>
          <p className="text-body text-muted-foreground">
            Enter your phone number and we'll send you a verification code to
            reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="Enter your phone number"
              {...register("phone")}
              error={errors.phone?.message}
              autoComplete="tel"
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
