import { create } from "zustand";
import type { ConfigStep } from "@/types/workflow";

export type Theme = "light" | "dark";

interface UIStore {
  // Theme
  theme: Theme;

  // Sidebar
  selectedNodeId: string | null;
  sidebarOpen: boolean;
  currentStep: ConfigStep;

  // Actions
  toggleTheme: () => void;
  selectNode: (id: string) => void;
  deselectNode: () => void;
  setStep: (step: ConfigStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    return (localStorage.getItem("theme") as Theme) || "dark";
  }
  return "dark";
}

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("light", theme === "light");
}

// Apply on load
const initialTheme = getInitialTheme();
applyThemeClass(initialTheme);

export const useUIStore = create<UIStore>((set, get) => ({
  theme: initialTheme,
  selectedNodeId: null,
  sidebarOpen: false,
  currentStep: 1,

  toggleTheme: () => {
    const newTheme = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyThemeClass(newTheme);
    set({ theme: newTheme });
  },

  selectNode: (id) =>
    set({ selectedNodeId: id, sidebarOpen: true, currentStep: 1 }),

  deselectNode: () =>
    set({ selectedNodeId: null, sidebarOpen: false, currentStep: 1 }),

  setStep: (step) => set({ currentStep: step }),

  nextStep: () => {
    const current = get().currentStep;
    if (current < 3) set({ currentStep: (current + 1) as ConfigStep });
  },

  prevStep: () => {
    const current = get().currentStep;
    if (current > 1) set({ currentStep: (current - 1) as ConfigStep });
  },

  closeSidebar: () =>
    set({ sidebarOpen: false, selectedNodeId: null, currentStep: 1 }),

  openSidebar: () => set({ sidebarOpen: true }),
}));
