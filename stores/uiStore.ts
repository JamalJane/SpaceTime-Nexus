import { create } from 'zustand';

export type CardNavTab = 'hub' | 'profile' | 'salvage' | 'intercept' | 'star-lock' | 'ledger';

interface UiState {
  hudEnabled: boolean;
  firstVisitComplete: boolean;
  activeCardNavTab: CardNavTab;
  globalLoading: boolean;
  setHudEnabled: (v: boolean) => void;
  setFirstVisitComplete: (v: boolean) => void;
  setActiveCardNavTab: (tab: CardNavTab) => void;
  setGlobalLoading: (v: boolean) => void;
  enableHud: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  hudEnabled: false,
  firstVisitComplete: false,
  activeCardNavTab: 'hub',
  globalLoading: false,
  setHudEnabled: (v) => set({ hudEnabled: v }),
  setFirstVisitComplete: (v) => set({ firstVisitComplete: v }),
  setActiveCardNavTab: (tab) => set({ activeCardNavTab: tab }),
  setGlobalLoading: (v) => set({ globalLoading: v }),
  enableHud: () => set({ hudEnabled: true, firstVisitComplete: true }),
}));
