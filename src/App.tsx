import { AnimatePresence } from 'framer-motion'
import { useNavStore } from './store'
import Scene from './components/Scene'
import HudOverlay from './components/HudOverlay'
import CardNav from './components/CardNav'
import SplashPage from './pages/SplashPage'
import GraveyardPage from './pages/GraveyardPage'
import SalvageOpsPage from './pages/SalvageOpsPage'
import InterceptPlannerPage from './pages/InterceptPlannerPage'
import StarLockPage from './pages/StarLockPage'
import RecoveryLedgerPage from './pages/RecoveryLedgerPage'

export default function App() {
    const { page, hudEnabled } = useNavStore()

    const isFullScreen = page === 'STAR_LOCK' || page === 'RECOVERY_LEDGER'

    return (
        <>
            {/* Always-on 3D background */}
            {page !== 'STAR_LOCK' && <Scene />}

            {/* Splash scroll entry */}
            <AnimatePresence>
                {page === 'SPLASH' && <SplashPage key="splash" />}
            </AnimatePresence>

            {/* HUD only visible after splash */}
            {hudEnabled && !isFullScreen && (
                <>
                    <HudOverlay />
                    <CardNav />
                </>
            )}

            {/* Page content */}
            <AnimatePresence mode="wait">
                {page === 'GRAVEYARD' && <GraveyardPage key="graveyard" />}
                {page === 'SALVAGE_OPS' && <SalvageOpsPage key="salvage-ops" />}
                {page === 'INTERCEPT_PLANNER' && <InterceptPlannerPage key="intercept-planner" />}
                {page === 'STAR_LOCK' && <StarLockPage key="star-lock" />}
                {page === 'RECOVERY_LEDGER' && <RecoveryLedgerPage key="recovery-ledger" />}
            </AnimatePresence>
        </>
    )
}
