import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "../api/models/authModels";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      expiresAt: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          expiresAt: data.expiresAt,
          isAuthenticated: true,
        }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          expiresAt: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        userId: state.userId,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);