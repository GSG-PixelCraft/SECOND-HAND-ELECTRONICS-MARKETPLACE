import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  OTPRequest,
  OTPVerification,
  DocumentUploadRequest,
  DocumentUploadResponse,
  VerificationStatusResponse,
} from "@/types";

// ============================================================================
// API Functions
// ============================================================================

export const verificationService = {
  // Get overall verification status
  getStatus: async (): Promise<VerificationStatusResponse> => {
    try {
      return await api.get<VerificationStatusResponse>(
        API_ENDPOINTS.VERIFICATION.STATUS,
      );
    } catch {
      return {
        identity: {
          status: "not_started",
          type: null,
        },
        phone: {
          status: "not_verified",
          phoneNumber: null,
        },
        email: {
          status: "not_verified",
          email: null,
        },
      };
    }
  },

  // Identity verification
  uploadIdentityDocument: (
    data: DocumentUploadRequest,
  ): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    formData.append("type", data.type);
    formData.append("frontImage", data.frontImage);
    if (data.backImage) {
      formData.append("backImage", data.backImage);
    }

    return api.post<DocumentUploadResponse>(
      API_ENDPOINTS.VERIFICATION.IDENTITY.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  getIdentityStatus: (): Promise<VerificationStatusResponse["identity"]> =>
    api.get<VerificationStatusResponse["identity"]>(
      API_ENDPOINTS.VERIFICATION.IDENTITY.STATUS,
    ),

  // Phone verification
  sendPhoneOTP: (data?: Partial<OTPRequest>): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(API_ENDPOINTS.VERIFICATION.PHONE.SEND_OTP, {
      otpType: "phone_verification",
      ...data,
    }),

  verifyPhoneOTP: (data: OTPVerification): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(
      API_ENDPOINTS.VERIFICATION.PHONE.VERIFY_OTP,
      {
        code: data.code,
        phoneNumber: data.phoneNumber,
        type: "phone_verification",
      },
    ),

  changePhone: (phoneNumber: string): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(API_ENDPOINTS.VERIFICATION.PHONE.CHANGE, {
      phoneNumber,
    }),

  sendChangePhoneOTP: (data: OTPRequest): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(
      API_ENDPOINTS.VERIFICATION.PHONE.CHANGE_SEND_OTP,
      data,
    ),

  verifyChangePhoneOTP: (
    data: OTPVerification,
  ): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(
      API_ENDPOINTS.VERIFICATION.PHONE.CHANGE_VERIFY_OTP,
      data,
    ),

  // Email verification
  sendEmailOTP: (data?: Partial<OTPRequest>): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(API_ENDPOINTS.VERIFICATION.EMAIL.SEND_OTP, {
      otpType: "email_verification",
      ...data,
    }),

  verifyEmailOTP: (data: OTPVerification): Promise<{ success: boolean }> =>
    api.post<{ success: boolean }>(
      API_ENDPOINTS.VERIFICATION.EMAIL.VERIFY_OTP,
      {
        code: data.code,
        email: data.email,
        type: "email_verification",
      },
    ),
};

// ============================================================================
// Query Keys
// ============================================================================

export const VERIFICATION_KEYS = {
  all: ["verification"] as const,
  status: () => [...VERIFICATION_KEYS.all, "status"] as const,
  identity: () => [...VERIFICATION_KEYS.all, "identity"] as const,
  identityStatus: () => [...VERIFICATION_KEYS.identity(), "status"] as const,
};

// ============================================================================
// React Query Hooks
// ============================================================================

// Get verification status
export const useVerificationStatus = () => {
  return useQuery({
    queryKey: VERIFICATION_KEYS.status(),
    queryFn: verificationService.getStatus,
    staleTime: 30000, // 30 seconds
  });
};

// Get identity verification status
export const useIdentityStatus = () => {
  return useQuery({
    queryKey: VERIFICATION_KEYS.identityStatus(),
    queryFn: verificationService.getIdentityStatus,
    staleTime: 30000,
  });
};

// Upload identity document
export const useUploadIdentityDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificationService.uploadIdentityDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_KEYS.identity() });
      queryClient.invalidateQueries({ queryKey: VERIFICATION_KEYS.status() });
    },
  });
};

// Send phone OTP
export const useSendPhoneOTP = () => {
  return useMutation({
    mutationFn: verificationService.sendPhoneOTP,
  });
};

// Verify phone OTP
export const useVerifyPhoneOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificationService.verifyPhoneOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_KEYS.status() });
    },
  });
};

// Send change phone OTP
export const useSendChangePhoneOTP = () => {
  return useMutation({
    mutationFn: verificationService.sendChangePhoneOTP,
  });
};

// Verify change phone OTP
export const useVerifyChangePhoneOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificationService.verifyChangePhoneOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_KEYS.status() });
    },
  });
};

// Send email OTP
export const useSendEmailOTP = () => {
  return useMutation({
    mutationFn: verificationService.sendEmailOTP,
  });
};

// Verify email OTP
export const useVerifyEmailOTP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verificationService.verifyEmailOTP,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VERIFICATION_KEYS.status() });
    },
  });
};
