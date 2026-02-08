import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { VerifyIdentityInput } from "@/components/forms";
import { Span } from "@/components/ui/span";
import { Text } from "@/components/ui/text";
import { documentUploadSchema } from "@/components/forms/zod-schemas";
import { useUploadIdentityDocument } from "@/services";
import { ROUTES } from "@/constants/routes";
import { MESSAGES } from "@/constants/messages";
import type { DocumentType } from "@/types";

interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

const documentTypes: DocumentTypeOption[] = [
  { value: "id", label: "Identity card" },
  { value: "passport", label: "Passport" },
  { value: "driver_license", label: "Driver License" },
];

export const IdentityVerificationSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);

  const { control, watch } = useForm({
    resolver: zodResolver(documentUploadSchema),
    mode: "onChange",
  });

  const frontImage = watch("frontImage");
  const backImage = watch("backImage");

  const uploadMutation = useUploadIdentityDocument();

  const handleSubmit = async () => {
    if (!selectedType || !frontImage) return;

    try {
      const formData = {
        type: selectedType,
        frontImage: frontImage as File,
        backImage: backImage as File | undefined,
      };

      await uploadMutation.mutateAsync(formData);
      navigate(ROUTES.VERIFY_IDENTITY_STATUS);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const canSubmit =
    selectedType && frontImage && (selectedType === "passport" || backImage);

  return (
    <PageLayout title={MESSAGES.VERIFICATION.IDENTITY.TITLE}>
      <div className="mx-auto max-w-4xl">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-8">
            {/* Document Type Selection */}
            <div className="space-y-4">
              <h2 className="text-lg font-normal text-[#101010]">
                {MESSAGES.VERIFICATION.IDENTITY.SELECT_TYPE}
              </h2>

              <div className="flex gap-6">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedType(type.value)}
                    className="flex items-center gap-2 transition-colors"
                  >
                    <div className="relative h-6 w-6">
                      <div className="absolute inset-0 flex items-center justify-center rounded-full border-2 border-[#e4e4e4]">
                        {selectedType === type.value && (
                          <div className="h-3 w-3 rounded-full bg-[#2563eb]" />
                        )}
                      </div>
                    </div>
                    <Span className="text-base text-[#3d3d3d]">
                      {type.label}
                    </Span>
                  </button>
                ))}
              </div>

              <Text className="text-sm text-[#828282]">
                Make sure the document is clear, readable, and not blurred.
              </Text>
            </div>

            {/* Upload Fields */}
            {selectedType && (
              <div className="space-y-6">
                <Controller
                  name="frontImage"
                  control={control}
                  render={({ field, fieldState }) => (
                    <VerifyIdentityInput
                      label="Front side"
                      value={field.value}
                      onChange={field.onChange}
                      error={fieldState.error?.message}
                    />
                  )}
                />

                {selectedType !== "passport" && (
                  <Controller
                    name="backImage"
                    control={control}
                    render={({ field, fieldState }) => (
                      <VerifyIdentityInput
                        label="Back side"
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!canSubmit || uploadMutation.isPending}
                className="w-full max-w-sm"
              >
                {uploadMutation.isPending ? "Uploading..." : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
