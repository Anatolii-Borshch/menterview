import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthResponse } from "../api/models/authModels";

function decodeRoleFromJwt(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;

    const payload = parts[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded)) as Record<string, unknown>;

    const rawRole = decoded.role ?? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    if (typeof rawRole === 'string') return rawRole;
    if (Array.isArray(rawRole) && typeof rawRole[0] === 'string') return rawRole[0];
    return null;
  } catch {
    return null;
  }
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  expiresAt: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (data: AuthResponse) => void;
  setRole: (role: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      expiresAt: null,
      role: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          userId: data.userId,
          expiresAt: data.expiresAt,
          role: decodeRoleFromJwt(data.accessToken),
          isAuthenticated: true,
        }),

      setRole: (role) => set({ role }),

      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          expiresAt: null,
          role: null,
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
        role: state.role,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

