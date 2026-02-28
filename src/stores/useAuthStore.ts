import { create } from "zustand";
import {
  setVerification as persistVerification,
  removeVerification,
} from "@/lib/storage";

import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken as persistToken,
  setUser as persistUser,
} from "@/lib/storage";
import type { User, VerificationState } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  verification: VerificationState;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setVerification: (verification: Partial<VerificationState>) => void;
  logout: () => void;
}

const initialVerificationState: VerificationState = {
  identity: {
    type: null,
    status: "not_started",
  },
  phone: {
    phoneNumber: null,
    status: "not_verified",
  },
  email: {
    email: null,
    status: "not_verified",
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  user: (getUser() as User | null) ?? null,
  token: getToken(),
  verification: initialVerificationState,
  setUser: (user: User | null) => {
    set({ user });
    if (user) {
      persistUser(user);
    } else {
      removeUser();
    }
  },
  setToken: (token: string | null) => {
    set({ token });
    if (token) {
      persistToken(token);
    } else {
      removeToken();
    }
  },
  setVerification: (verification: Partial<VerificationState>) => {
    set((state) => {
      const nextVerification = {
        ...state.verification,
        ...verification,
        identity: {
          ...state.verification.identity,
          ...(verification.identity || {}),
        },
        phone: {
          ...state.verification.phone,
          ...(verification.phone || {}),
        },
        email: {
          ...state.verification.email,
          ...(verification.email || {}),
        },
      };
      persistVerification(nextVerification);
      return { verification: nextVerification };
    });
  },
  logout: () => {
    removeToken();
    removeUser();
    removeVerification();
    set({ user: null, token: null, verification: initialVerificationState });
  },
}));
