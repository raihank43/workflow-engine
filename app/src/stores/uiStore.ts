import { create } from "zustand";
import type { ConfigStep } from "@/types/workflow";

interface UIStore {
  // Sidebar
  selectedNodeId: string | null;
  sidebarOpen: boolean;
  currentStep: ConfigStep;

  // Actions
  selectNode: (id: string) => void;
  deselectNode: () => void;
  setStep: (step: ConfigStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  selectedNodeId: null,
  sidebarOpen: false,
  currentStep: 1,

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
