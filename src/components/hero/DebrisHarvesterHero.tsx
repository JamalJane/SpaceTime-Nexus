import { useRef, useState, useCallback, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Preload } from '@react-three/drei'
import * as THREE from 'three'
import SatelliteModel from './SatelliteModel'
import DroneMesh from './DroneMesh'
import MissionOverlay from './MissionOverlay'
import useMissionSequence from './useMissionSequence'
import { useNavStore } from '../../store'
import type { Page } from '../../store'

const BLACK = '#0a0a0a'

// ── Scene (inner Canvas content) ──────────────────────
function Scene({
    droneRef,
    satelliteRef,
    rotationActive,
}: {
    droneRef: React.MutableRefObject<THREE.Group | undefined>
    satelliteRef: React.MutableRefObject<THREE.Group | undefined>
    rotationActive: React.MutableRefObject<boolean>
}) {
    return (
        <>
            <ambientLight intensity={0.08} />
            <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" castShadow />
            <directionalLight position={[-5, -3, -5]} intensity={0.15} color="#FFD700" />

            <Stars
                radius={120}
                depth={60}
                count={5000}
                factor={4}
                saturation={0}
                fade
                speed={0.3}
            />

            <Suspense fallback={null}>
                <SatelliteModel meshRef={satelliteRef} rotationActive={rotationActive} />
                <DroneMesh meshRef={droneRef} />
            </Suspense>

            <Preload all />
        </>
    )
}

// ── Root Component ────────────────────────────────────
export default function DebrisHarvesterHero() {
    const droneRef = useRef<THREE.Group | undefined>(undefined)
    const satelliteRef = useRef<THREE.Group | undefined>(undefined)
    const rotationActive = useRef(true)
    const [logs, setLogs] = useState<string[]>([])
    const [transitioning, setTransitioning] = useState(false)
    const enableHud = useNavStore((s) => s.enableHud)
    const setPage = useNavStore((s) => s.setPage)

    const addLog = useCallback((text: string) => {
        setLogs((prev) => [...prev, text])
    }, [])

    const handleComplete = useCallback(() => {
        // finished state is managed inside the hook
    }, [])

    const { start, started, finished } = useMissionSequence({
        droneRef,
        satelliteRef,
        rotationActive,
        onLogLine: addLog,
        onComplete: handleComplete,
    })

    // Smooth transition: fade to black → then swap pages
    const handleEnterNexus = useCallback(() => {
        setTransitioning(true)
        setTimeout(() => {
            enableHud()
        }, 1200)
    }, [enableHud])

    // "OUR MISSION" button: fade → go to Mission Profile
    const handleMission = useCallback(() => {
        setTransitioning(true)
        setTimeout(() => {
            enableHud()
            // Small delay so HUD enables first, then navigate
            setTimeout(() => setPage('MISSION_PROFILE'), 50)
        }, 1200)
    }, [enableHud, setPage])

    return (
        <section
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100vh',
                background: BLACK,
                overflow: 'hidden',
                zIndex: 20,
            }}
        >
            {/* ── Scan-line texture overlay ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 1,
                    pointerEvents: 'none',
                    backgroundImage:
                        'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
                }}
            />

            {/* ── Vignette ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 2,
                    pointerEvents: 'none',
                    background:
                        'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.75) 100%)',
                }}
            />

            {/* ── Three.js Canvas ── */}
            <Canvas
                shadows
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 10], fov: 55 }}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
                gl={{ alpha: false, antialias: true }}
                onCreated={({ gl }) => {
                    gl.setClearColor(BLACK)
                }}
            >
                <Scene
                    droneRef={droneRef}
                    satelliteRef={satelliteRef}
                    rotationActive={rotationActive}
                />
            </Canvas>

            {/* ── Mission Overlay HUD ── */}
            <MissionOverlay
                logs={logs}
                started={started}
                finished={finished}
                onStart={start}
                onEnterNexus={handleEnterNexus}
                onMission={handleMission}
            />

            {/* ── Fade-to-black transition overlay ── */}
            <div
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 100,
                    pointerEvents: transitioning ? 'all' : 'none',
                    background: 'var(--void, #050505)',
                    opacity: transitioning ? 1 : 0,
                    transition: 'opacity 1s ease-in',
                }}
            />
        </section>
    )
}
