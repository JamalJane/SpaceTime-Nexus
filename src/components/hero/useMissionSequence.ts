import { useState, useCallback, useRef, MutableRefObject } from 'react'
import gsap from 'gsap'
import * as THREE from 'three'

const DRONE_END_X = -1.8

const LOG_LINES = [
    { t: 1.5, text: 'TARGET ACQUIRED' },
    { t: 2.3, text: 'TELEMETRY LOCK: 412km LEO' },
    { t: 2.9, text: 'LAMBERT SOLVER: INTERCEPT CONFIRMED' },
    { t: 3.6, text: 'STABILIZATION COMPLETE' },
    { t: 4.1, text: 'MASS ESTIMATE: 42kg ALUMINUM ALLOY' },
    { t: 4.7, text: 'TETHER DEPLOYED — ΔV BUDGET: 0.34 km/s' },
    { t: 5.5, text: 'DEBRIS NEUTRALIZED — ORBIT SECURED' },
]

interface UseMissionSequenceArgs {
    droneRef: MutableRefObject<THREE.Group | undefined>
    satelliteRef: MutableRefObject<THREE.Group | undefined>
    rotationActive: MutableRefObject<boolean>
    onLogLine: (text: string) => void
    onComplete: () => void
}

export default function useMissionSequence({
    droneRef,
    satelliteRef,
    rotationActive,
    onLogLine,
    onComplete,
}: UseMissionSequenceArgs) {
    const [started, setStarted] = useState(false)
    const [finished, setFinished] = useState(false)
    const timeoutsRef = useRef<number[]>([])

    const start = useCallback(() => {
        if (started) return
        setStarted(true)

        const drone = droneRef.current
        const sat = satelliteRef.current
        if (!drone || !sat) return

        // ── Drone enters from the left
        gsap.to(drone.position, {
            x: DRONE_END_X,
            duration: 2.8,
            ease: 'power2.inOut',
        })

        // ── Log lines fire on schedule
        LOG_LINES.forEach(({ t, text }) => {
            const id = window.setTimeout(() => onLogLine(text), t * 1000)
            timeoutsRef.current.push(id)
        })

        // ── Satellite tumble stops at t=3.0
        const stopId = window.setTimeout(() => {
            rotationActive.current = false
            gsap.to(sat.rotation, {
                x: 0,
                y: 0,
                z: 0,
                duration: 0.35,
                ease: 'expo.out',
            })
        }, 3000)
        timeoutsRef.current.push(stopId)

        // ── Tow: both drift right and fade at t=4.5
        const towId = window.setTimeout(() => {
            gsap.to(drone.position, {
                x: drone.position.x + 22,
                duration: 2.2,
                ease: 'power3.in',
            })
            gsap.to(sat.position, {
                x: sat.position.x + 22,
                duration: 2.2,
                ease: 'power3.in',
            })

            // Fade materials
            const fadeGroup = (group: THREE.Group) => {
                group.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh
                        if (mesh.material) {
                            const mat = mesh.material as THREE.MeshStandardMaterial
                            mat.transparent = true
                            gsap.to(mat, { opacity: 0, duration: 1.6, ease: 'power2.in' })
                        }
                    }
                })
            }
            fadeGroup(drone)
            fadeGroup(sat)
        }, 4500)
        timeoutsRef.current.push(towId)

        // ── Sequence completion
        const doneId = window.setTimeout(() => {
            setFinished(true)
            onComplete()
        }, 6500)
        timeoutsRef.current.push(doneId)
    }, [started, droneRef, satelliteRef, rotationActive, onLogLine, onComplete])

    return { start, started, finished }
}
