import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse, UserResponse } from "@/types/api";

export interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  setFromAuthResponse: (r: AuthResponse) => void;
  setTokensFromRefresh: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setFromAuthResponse: (r) =>
        set({
          user: r.user,
          accessToken: r.accessToken,
          refreshToken: r.refreshToken,
        }),
      setTokensFromRefresh: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),
      setAccessToken: (accessToken) => set({ accessToken }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
        }),
    }),
    {
      name: "luxury-resort-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
    }
  )
);
