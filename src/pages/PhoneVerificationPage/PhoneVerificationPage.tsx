import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { phoneNumberSchema } from "@/components/forms/zod-schemas";
import { useSendPhoneOTP } from "@/services";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";

export const PhoneVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const sendOTPMutation = useSendPhoneOTP();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(phoneNumberSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: { phoneNumber: string }) => {
    try {
      await sendOTPMutation.mutateAsync({ phoneNumber: data.phoneNumber });
      navigate(ROUTES.VERIFY_PHONE_OTP, {
        state: { phoneNumber: data.phoneNumber },
      });
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  return (
    <PageLayout title={MESSAGES.VERIFICATION.PHONE.TITLE}>
      <div className="mx-auto max-w-md">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-center text-xl font-medium text-[#101010]">
                Enter your phone number
              </h2>
              <p className="text-center text-sm text-[#828282]">
                {MESSAGES.VERIFICATION.PHONE.DESCRIPTION}
              </p>
            </div>

            <Input
              {...register("phoneNumber")}
              label="Phone Number"
              placeholder="+972 50 123 4567"
              error={errors.phoneNumber?.message}
              helperText="Include country code"
            />

            <Button
              type="submit"
              size="lg"
              disabled={!isValid || sendOTPMutation.isPending}
              className="w-full"
            >
              {sendOTPMutation.isPending ? "Sending..." : "Send Code"}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
