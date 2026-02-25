import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";

export interface ProfileData {
  id?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  country?: string;
  countryId?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  avatar?: string;
  avatarUrl?: string;
  profileImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface UpdateProfilePayload {
  // Legacy UI fields, mapped to swagger-compatible payload where possible.
  fullName?: string;
  country?: string;
  bio?: string;
  location?: string;
  countryId?: number;
  latitude?: number;
  longitude?: number;
  avatarFile?: File | null;
}

type ApiEnvelope<T> = {
  data?: T;
} & Record<string, unknown>;

const unwrapResponse = <T extends object>(
  response: T | ApiEnvelope<T>,
): T | Record<string, unknown> => {
  if (
    response &&
    typeof response === "object" &&
    "data" in response &&
    response.data &&
    typeof response.data === "object"
  ) {
    return response.data as T;
  }

  if (response && typeof response === "object") {
    return response as Record<string, unknown>;
  }

  return {};
};

export const profileService = {
  getProfile: async (): Promise<ProfileData> => {
    const response = await api.get<ProfileData | ApiEnvelope<ProfileData>>(
      API_ENDPOINTS.PROFILE.CURRENT,
    );
    return unwrapResponse(response) as ProfileData;
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ProfileData> => {
    const formData = new FormData();
    const bio = payload.bio ?? payload.fullName;
    const location = payload.location ?? payload.country;

    if (bio !== undefined) {
      formData.append("bio", bio);
    }
    if (location !== undefined) {
      formData.append("location", location);
    }
    if (typeof payload.countryId === "number") {
      formData.append("countryId", String(payload.countryId));
    }
    if (typeof payload.latitude === "number") {
      formData.append("latitude", String(payload.latitude));
    }
    if (typeof payload.longitude === "number") {
      formData.append("longitude", String(payload.longitude));
    }
    if (payload.avatarFile) {
      formData.append("avatar", payload.avatarFile);
    }

    const response = await api.patch<ProfileData | ApiEnvelope<ProfileData>>(
      API_ENDPOINTS.PROFILE.CURRENT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return unwrapResponse(response) as ProfileData;
  },
};

export const PROFILE_KEYS = {
  all: ["profile"] as const,
  current: () => [...PROFILE_KEYS.all, "current"] as const,
};

export const useProfile = () => {
  return useQuery({
    queryKey: PROFILE_KEYS.current(),
    queryFn: profileService.getProfile,
    staleTime: 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
};
