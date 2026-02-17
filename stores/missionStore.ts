import { create } from 'zustand';

export type MissionPhase = 'discovery' | 'identification' | 'calculation' | 'calibration' | 'extraction';

export interface MissionState {
  phase: MissionPhase;
  missionId: string | null;
  targetId: string | null;
  burnDeltaV: number | null;
  profitEst: number | null;
  fuelOk: boolean;
  tofHours: number;
  setPhase: (p: MissionPhase) => void;
  setMission: (id: string | null, targetId: string | null) => void;
  setBurnDeltaV: (v: number | null) => void;
  setProfitEst: (v: number | null) => void;
  setFuelOk: (v: boolean) => void;
  setTofHours: (v: number) => void;
  completeIdentification: () => void;
  completeCalculation: () => void;
  completeCalibration: () => void;
  completeExtraction: () => void;
  resetMission: () => void;
}

const initialState = {
  phase: 'discovery' as MissionPhase,
  missionId: null as string | null,
  targetId: null as string | null,
  burnDeltaV: null as number | null,
  profitEst: null as number | null,
  fuelOk: true,
  tofHours: 24,
};

export const useMissionStore = create<MissionState>((set) => ({
  ...initialState,
  setPhase: (phase) => set({ phase }),
  setMission: (missionId, targetId) => set({ missionId, targetId }),
  setBurnDeltaV: (burnDeltaV) => set({ burnDeltaV }),
  setProfitEst: (profitEst) => set({ profitEst }),
  setFuelOk: (fuelOk) => set({ fuelOk }),
  setTofHours: (tofHours) => set({ tofHours }),
  completeIdentification: () => set({ phase: 'identification' }),
  completeCalculation: () => set({ phase: 'calculation' }),
  completeCalibration: () => set({ phase: 'calibration' }),
  completeExtraction: () => set({ phase: 'extraction' }),
  resetMission: () => set(initialState),
}));
