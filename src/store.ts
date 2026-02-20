import { create } from 'zustand'

// ─── Mission Status ──────────────────────────────────────
export type MissionStatus = 'IDLE' | 'PLOTTED' | 'LOCKED'

// ─── App Page (7 pages + splash) ─────────────────────────
export type Page =
    | 'SPLASH'
    | 'GRAVEYARD'
    | 'MISSION_PROFILE'
    | 'SALVAGE_OPS'
    | 'INTERCEPT_PLANNER'
    | 'STAR_LOCK'
    | 'RECOVERY_LEDGER'

// ─── Satellite Object ─────────────────────────────────────
export interface Satellite {
    id: string
    noradId: number
    name: string
    objectType: 'DEBRIS' | 'PAYLOAD'
    tleLine1: string
    tleLine2: string
    altitudeKm: number
    decayStatus: boolean
    dryMassKg: number
    materialProfile: {
        aluminum: number
        titanium: number
        gold: number
        copper: number
    }
}

// ─── Target Store ─────────────────────────────────────────
interface TargetStore {
    selectedTarget: Satellite | null
    setTarget: (sat: Satellite | null) => void
}

export const useTargetStore = create<TargetStore>((set) => ({
    selectedTarget: null,
    setTarget: (sat) => set({ selectedTarget: sat }),
}))

// ─── Mission Store ────────────────────────────────────────
interface MissionStore {
    status: MissionStatus
    deltaV: number | null
    fuelOk: boolean
    nrv: number | null
    timeOfFlight: number  // days
    orientationQuaternion: [number, number, number, number] | null
    setStatus: (s: MissionStatus) => void
    setDeltaV: (dv: number) => void
    setFuelOk: (ok: boolean) => void
    setNrv: (nrv: number) => void
    setTimeOfFlight: (t: number) => void
    setQuaternion: (q: [number, number, number, number]) => void
    reset: () => void
}

export const useMissionStore = create<MissionStore>((set) => ({
    status: 'IDLE',
    deltaV: null,
    fuelOk: true,
    nrv: null,
    timeOfFlight: 3,
    orientationQuaternion: null,
    setStatus: (status) => set({ status }),
    setDeltaV: (deltaV) => set({ deltaV }),
    setFuelOk: (fuelOk) => set({ fuelOk }),
    setNrv: (nrv) => set({ nrv }),
    setTimeOfFlight: (timeOfFlight) => set({ timeOfFlight }),
    setQuaternion: (q) => set({ orientationQuaternion: q }),
    reset: () => set({
        status: 'IDLE', deltaV: null, fuelOk: true,
        nrv: null, timeOfFlight: 3, orientationQuaternion: null,
    }),
}))

// ─── Navigation Store ─────────────────────────────────────
interface NavStore {
    page: Page
    hudEnabled: boolean
    setPage: (p: Page) => void
    enableHud: () => void
}

export const useNavStore = create<NavStore>((set) => ({
    page: 'SPLASH',
    hudEnabled: false,
    setPage: (page) => set({ page }),
    enableHud: () => set({ hudEnabled: true, page: 'GRAVEYARD' }),
}))

// ─── Market Store ─────────────────────────────────────────
export interface MetalPrices {
    aluminum: number  // USD/kg
    titanium: number
    gold: number
    copper: number
    lastUpdated: string
}

interface MarketStore {
    prices: MetalPrices
    setPrices: (p: MetalPrices) => void
}

export const useMarketStore = create<MarketStore>((set) => ({
    prices: {
        aluminum: 2.65,
        titanium: 11.50,
        gold: 62000,
        copper: 9.80,
        lastUpdated: new Date().toISOString(),
    },
    setPrices: (prices) => set({ prices }),
}))
