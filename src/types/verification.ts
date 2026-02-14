export type DocumentType = "id" | "passport" | "driver_license";

export type VerificationStatus =
  | "not_started"
  | "pending"
  | "uploading"
  | "waiting"
  | "approved"
  | "rejected";

export type ContactVerificationStatus = "not_verified" | "verified" | "pending";
export type VerificationTargetType =
  | "email_verification"
  | "phone_verification";
export type OTPFlowType = VerificationTargetType | "password_reset";

export interface DocumentVerification {
  type: DocumentType | null;
  status: VerificationStatus;
  frontImage?: string;
  backImage?: string;
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface PhoneVerification {
  phoneNumber: string | null;
  status: ContactVerificationStatus;
  verifiedAt?: string;
}

export interface EmailVerification {
  email: string | null;
  status: ContactVerificationStatus;
  verifiedAt?: string;
}

export interface VerificationState {
  identity: DocumentVerification;
  phone: PhoneVerification;
  email: EmailVerification;
}

export interface OTPRequest {
  otpType?: VerificationTargetType;
  phoneNumber?: string;
  email?: string;
}

export interface OTPVerification {
  code: string;
  type?: OTPFlowType;
  phoneNumber?: string;
  email?: string;
}

export interface DocumentUploadRequest {
  type: DocumentType;
  frontImage: File;
  backImage?: File;
}

export interface DocumentUploadResponse {
  id: string;
  status: VerificationStatus;
  submittedAt: string;
}

export interface VerificationStatusResponse {
  identity: {
    status: VerificationStatus;
    type: DocumentType | null;
    rejectionReason?: string;
    reviewedAt?: string;
  };
  phone: {
    status: ContactVerificationStatus;
    phoneNumber: string | null;
  };
  email: {
    status: ContactVerificationStatus;
    email: string | null;
  };
}
