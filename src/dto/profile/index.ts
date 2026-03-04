/**
 * Matches the ProfileResponseDto from the Swagger spec.
 * GET /profile and PATCH /profile both return this shape.
 *
 * Note: user-level fields (fullName, email, phoneNumber) are NOT
 * included here — they live on the User entity (auth store / /auth/login response).
 */
export interface ProfileResponseDto {
  id: number;
  userId: number;
  bio: string | null;
  location: string | null;
  avatarAssetId: number | null;
  countryId: number | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Multipart fields accepted by PATCH /profile (UpdateProfileDto).
 * avatarFile maps to the `avatar` binary field in the swagger.
 */
export interface UpdateProfilePayload {
  bio?: string;
  location?: string;
  countryId?: number | string;
  latitude?: number;
  longitude?: number;
  avatarFile?: File | null;
}

/**
 * Internal shape used by the edit form (react-hook-form).
 * countryId is kept as string for the <select> element; converted
 * to a number before being sent to the API.
 */
export interface ProfileEditFormData {
  bio: string;
  location: string;
  countryId: string;
}
