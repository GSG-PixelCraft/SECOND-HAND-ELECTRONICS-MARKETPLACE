// User-facing messages
export const MESSAGES = {
  SUCCESS: {
    LOGIN: "Successfully logged in",
    PRODUCT_CREATED: "Product created successfully",
    ORDER_PLACED: "Order placed successfully",
    IDENTITY_UPLOADED: "Identity document uploaded successfully",
    PHONE_VERIFIED: "Phone number verified successfully",
    EMAIL_VERIFIED: "Email verified successfully",
    OTP_SENT: "Verification code sent successfully",
    PHONE_CHANGED: "Phone number changed successfully",
  },
  ERROR: {
    GENERIC: "Something went wrong",
    NETWORK: "Network error. Please try again",
    UNAUTHORIZED: "You must be logged in",
    INVALID_OTP: "Invalid verification code",
    OTP_EXPIRED: "Verification code has expired",
    UPLOAD_FAILED: "Failed to upload document",
    INVALID_PHONE: "Invalid phone number",
    INVALID_EMAIL: "Invalid email address",
    VERIFICATION_REJECTED: "Your verification was rejected",
  },
  VERIFICATION: {
    IDENTITY: {
      TITLE: "Verify Your Identity",
      DESCRIPTION: "Upload a government-issued ID to verify your identity",
      UPLOADING: "Uploading your document...",
      WAITING: "Your document is under review",
      APPROVED: "Your identity has been verified",
      REJECTED: "Your verification was rejected",
      SELECT_TYPE: "Select document type",
    },
    PHONE: {
      TITLE: "Verify Your Phone Number",
      DESCRIPTION: "Enter your phone number to receive a verification code",
      OTP_SENT: "We've sent a code to your phone",
      ENTER_CODE: "Enter the verification code",
      CHANGE_NUMBER: "Change Phone Number",
    },
    EMAIL: {
      TITLE: "Verify Your Email",
      DESCRIPTION: "Enter the verification code sent to your email",
      OTP_SENT: "We've sent a code to your email",
    },
  },
} as const;
