import { create } from 'zustand'

// ─── App Pages ────────────────────────────────────────────
export type Page =
    | 'SPLASH'
    | 'HOME'
    | 'GRAVEYARD'
    | 'MISSION_PROFILE'
    | 'SALVAGE'
    | 'INTERCEPT'
    | 'STAR_LOCK'
    | 'SIMULATION'

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
    enableHud: () => set({ hudEnabled: true, page: 'HOME' }),
}))
