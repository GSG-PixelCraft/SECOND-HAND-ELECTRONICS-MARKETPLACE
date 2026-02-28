import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type {
  DocumentUploadRequest,
  DocumentUploadResponse,
  VerificationStatusResponse,
  OTPRequest,
  OTPVerification,
  User,
} from "@/types";
import type { ApiResponse, VerifyCodeResponse } from "./auth.service";
import { profileService } from "./profile.service";
import { getUser, getToken } from "@/lib/storage";

type VerificationOtpType = "email_verification" | "phone_verification";
const IDENTITY_PENDING_KEY = "identity_verification_pending";

// ============================================================================
// API Functions
// ============================================================================

export const verificationService = {
  // Get overall verification status
  getStatus: async (): Promise<VerificationStatusResponse> => {
    // Derive status from stored user flags and profile info
    const storedUser = (getUser() || {}) as Partial<User> | null;
    let isEmailVerified = Boolean(storedUser?.emailVerified ?? storedUser?.isEmailVerified);
    let isPhoneVerified = Boolean(storedUser?.phoneVerified ?? storedUser?.isPhoneVerified);
    let isIdentityVerified = Boolean(
      storedUser?.identityVerified ?? storedUser?.isIdentityVerified,
    );

    // Fetch profile for latest contact values
    let email: string | null = storedUser?.email ?? null;
    let phoneNumber: string | null = storedUser?.phoneNumber ?? null;
    try {
      const profile = await profileService.getProfile();
      email = (profile.email as string) ?? email;
      phoneNumber = (profile.phoneNumber as string) ?? phoneNumber;
    } catch {
      // ignore; fallback to stored user
    }

    const pendingIdentityFlag = sessionStorage.getItem(IDENTITY_PENDING_KEY) === "true";
    if (isIdentityVerified) {
      sessionStorage.removeItem(IDENTITY_PENDING_KEY);
    }

    return {
      identity: {
        status: isIdentityVerified ? "approved" : pendingIdentityFlag ? "pending" : "not_started",
        type: null,
      },
      phone: {
        status: isPhoneVerified ? "verified" : "not_verified",
        phoneNumber: phoneNumber ?? null,
      },
      email: {
        status: isEmailVerified ? "verified" : "not_verified",
        email: email ?? null,
      },
    };
  },

  // Identity verification
  uploadIdentityDocument: (
    data: DocumentUploadRequest,
  ): Promise<DocumentUploadResponse> => {
    const formData = new FormData();
    // Keep multiple keys for backend compatibility until schema is finalized.
    formData.append("type", data.type);
    formData.append("verificationType", data.type);
    formData.append("identityType", data.type);
    formData.append("frontImage", data.frontImage);
    formData.append("idFrontImage", data.frontImage);
    if (data.backImage) {
      formData.append("backImage", data.backImage);
      formData.append("idBackImage", data.backImage);
    }

    return api
      .patch<DocumentUploadResponse>(API_ENDPOINTS.PROFILE.CURRENT, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        sessionStorage.setItem(IDENTITY_PENDING_KEY, "true");
        return response;
      });
  },

  getIdentityStatus: async (): Promise<
    VerificationStatusResponse["identity"]
  > => {
    const status = await verificationService.getStatus();
    return status.identity;
  },

  // Phone verification
  sendPhoneOTP: (data: OTPRequest): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(
      API_ENDPOINTS.VERIFICATION.PHONE.SEND_OTP,
      data,
    ),

  verifyPhoneOTP: (
    data: OTPVerification,
  ): Promise<ApiResponse<VerifyCodeResponse>> =>
    api.post<ApiResponse<VerifyCodeResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_CODE,
      data,
    ),

  changePhone: (phoneNumber: string): Promise<unknown> =>
    api.patch(API_ENDPOINTS.PROFILE.CURRENT, {
      phoneNumber,
    }),

  sendChangePhoneOTP: (payload: { phoneNumber: string }): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(
      API_ENDPOINTS.VERIFICATION.PHONE.CHANGE_SEND_OTP,
      payload,
    ),

  verifyChangePhoneOTP: (payload: { code: string; phoneNumber: string }): Promise<ApiResponse<VerifyCodeResponse>> =>
    api.post<ApiResponse<VerifyCodeResponse>>(
      API_ENDPOINTS.VERIFICATION.PHONE.CHANGE_VERIFY_OTP,
      payload,
    ),

  // Email verification
  sendEmailOTP: (data: OTPRequest): Promise<ApiResponse<string>> =>
    api.post<ApiResponse<string>>(
      API_ENDPOINTS.VERIFICATION.EMAIL.SEND_OTP,
      data,
    ),

  verifyEmailOTP: (
    data: OTPVerification,
  ): Promise<ApiResponse<VerifyCodeResponse>> =>
    api.post<ApiResponse<VerifyCodeResponse>>(
      API_ENDPOINTS.AUTH.VERIFY_CODE,
      data,
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
    enabled: Boolean(getToken()),
  });
};

// Get identity verification status
export const useIdentityStatus = () => {
  return useQuery({
    queryKey: VERIFICATION_KEYS.identityStatus(),
    queryFn: verificationService.getIdentityStatus,
    staleTime: 30000,
    enabled: Boolean(getToken()),
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
