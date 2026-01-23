import { create } from "zustand";

type ThemeMode = "light" | "dark";

type ModalState = Record<string, boolean>;

interface UiState {
  isSidebarOpen: boolean;
  theme: ThemeMode;
  modals: ModalState;
  toggleSidebar: () => void;
  setTheme: (theme: ThemeMode) => void;
  openModal: (name: string) => void;
  closeModal: (name: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isSidebarOpen: true,
  theme: "light",
  modals: {},
  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },
  setTheme: (theme: ThemeMode) => {
    set({ theme });
  },
  openModal: (name: string) => {
    set((state) => ({ modals: { ...state.modals, [name]: true } }));
  },
  closeModal: (name: string) => {
    set((state) => ({ modals: { ...state.modals, [name]: false } }));
  },
}));
