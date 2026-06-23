import { create } from "zustand";

type Theme = "light" | "dark";

interface UiState {
  sidebarOpen: boolean;
  /** Виїзне меню на публічному сайті (md−); адмін-айдбар не використовує цей прапор. */
  mainNavOpen: boolean;
  theme: Theme;
  setSidebarOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  setMainNavOpen: (v: boolean) => void;
  toggleMainNav: () => void;
  setTheme: (t: Theme) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  mainNavOpen: false,
  theme: "light",
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setMainNavOpen: (mainNavOpen) => set({ mainNavOpen }),
  toggleMainNav: () => set((s) => ({ mainNavOpen: !s.mainNavOpen })),
  setTheme: (theme) => set({ theme }),
}));
