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
    activeGlossaryTerm: string | null
    setPage: (p: Page) => void
    enableHud: () => void
    setGlossaryTerm: (term: string) => void
}

export const useNavStore = create<NavStore>((set) => ({
    page: 'SPLASH',
    hudEnabled: false,
    activeGlossaryTerm: null,
    setPage: (page) => set({ page, activeGlossaryTerm: null }),
    enableHud: () => set({ hudEnabled: true, page: 'HOME', activeGlossaryTerm: null }),
    setGlossaryTerm: (term) => set({ page: 'MISSION_PROFILE', activeGlossaryTerm: term }),
}))
