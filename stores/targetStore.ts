import { create } from 'zustand';

export interface MaterialBreakdown {
  aluminum: number;
  titanium: number;
  gold: number;
  copper: number;
  [key: string]: number;
}

export interface SatelliteTarget {
  id: string;
  norad_id: number;
  name: string;
  object_type: 'DEBRIS' | 'PAYLOAD';
  dry_mass_kg: number;
  material_profile: MaterialBreakdown;
  altitude_km?: number;
  decay_status?: boolean;
}

export interface TargetState {
  selected: SatelliteTarget | null;
  locked: boolean;
  materialBreakdown: MaterialBreakdown | null;
  nrv: number | null;
  setSelected: (sat: SatelliteTarget | null) => void;
  setLocked: (v: boolean) => void;
  setMaterialBreakdown: (m: MaterialBreakdown | null) => void;
  setNrv: (v: number | null) => void;
  clearTarget: () => void;
}

export const useTargetStore = create<TargetState>((set) => ({
  selected: null,
  locked: false,
  materialBreakdown: null,
  nrv: null,
  setSelected: (sat) => set({ selected: sat, materialBreakdown: sat?.material_profile ?? null }),
  setLocked: (v) => set({ locked: v }),
  setMaterialBreakdown: (m) => set({ materialBreakdown: m }),
  setNrv: (v) => set({ nrv: v }),
  clearTarget: () =>
    set({
      selected: null,
      materialBreakdown: null,
      nrv: null,
      locked: false,
    }),
}));
