import { AnimatePresence } from 'framer-motion'
import { useNavStore } from './store'
import Scene from './components/Scene'
import CardNav from './components/CardNav'
import SplashPage from './pages/SplashPage'
import HomePage from './pages/HomePage'
import GraveyardPage from './pages/GraveyardPage'
import MissionProfilePage from './pages/MissionProfilePage'
import SalvagePage from './pages/SalvagePage'
import InterceptPage from './pages/InterceptPage'
import StarLockPage from './pages/StarLockPage'
import SimulationPage from './pages/SimulationPage'

export default function App() {
    const { page, hudEnabled } = useNavStore()

    return (
        <>
            {/* Always-on 3D background */}
            <Scene />

            {/* Splash scroll entry */}
            <AnimatePresence>
                {page === 'SPLASH' && <SplashPage key="splash" />}
            </AnimatePresence>

            {/* CardNav after splash */}
            {hudEnabled && <CardNav />}

            {/* Page content */}
            <AnimatePresence mode="wait">
                {page === 'HOME' && <HomePage key="home" />}
                {page === 'GRAVEYARD' && <GraveyardPage key="graveyard" />}
                {page === 'MISSION_PROFILE' && <MissionProfilePage key="mission-profile" />}
                {page === 'SALVAGE' && <SalvagePage key="salvage" />}
                {page === 'INTERCEPT' && <InterceptPage key="intercept" />}
                {page === 'STAR_LOCK' && <StarLockPage key="star-lock" />}
                {page === 'SIMULATION' && <SimulationPage key="simulation" />}
            </AnimatePresence>
        </>
    )
}
