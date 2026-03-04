import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import { getToken } from "@/lib/storage";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ProfileResponseDto, UpdateProfilePayload } from "@/dto/profile";

// Re-export for consumers that previously imported from this module
export type { ProfileResponseDto, UpdateProfilePayload } from "@/dto/profile";

type ApiEnvelope<T> = {
  data?: T;
} & Record<string, unknown>;

const unwrapResponse = <T extends object>(
  response: T | ApiEnvelope<T>,
): T | Partial<T> => {
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
    return response as T;
  }

  return {} as Partial<T>;
};

export const profileService = {
  getProfile: async (): Promise<ProfileResponseDto> => {
    try {
      const response = await api.get<
        ProfileResponseDto | ApiEnvelope<ProfileResponseDto>
      >(API_ENDPOINTS.PROFILE.CURRENT);
      return unwrapResponse(response) as ProfileResponseDto;
    } catch (err: unknown) {
      const e = err as { response?: { status?: number } };
      if (e?.response?.status === 404 || e?.response?.status === 401) {
        // No profile created yet — return safe empty object
        return {} as ProfileResponseDto;
      }
      throw err;
    }
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
  ): Promise<ProfileResponseDto> => {
    const formData = new FormData();

    if (payload.bio !== undefined) {
      formData.append("bio", payload.bio);
    }
    if (payload.location !== undefined) {
      formData.append("location", payload.location);
    }
    if (payload.countryId !== undefined && payload.countryId !== "") {
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

    const response = await api.patch<
      ProfileResponseDto | ApiEnvelope<ProfileResponseDto>
    >(API_ENDPOINTS.PROFILE.CURRENT, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return unwrapResponse(response) as ProfileResponseDto;
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
    retry: false,
    enabled: Boolean(getToken()),
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
};
