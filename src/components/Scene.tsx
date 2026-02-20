import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavStore, useTargetStore } from '../store'
import { generateDebrisCloud, SAMPLE_SATELLITES } from '../lib/sampleData'
import type { Satellite } from '../store'

const EARTH_RADIUS_KM = 6371

// Convert altitude + spherical coords to 3D scene position
function altToR(altKm: number) {
    return 1 + altKm / EARTH_RADIUS_KM
}

// Deterministic position from noradId so each satellite has a unique fixed orbit spot
function satPosition(sat: { altitudeKm: number; noradId: number }) {
    const r = altToR(sat.altitudeKm)
    const theta = (sat.noradId * 137.5 * Math.PI) / 180  // golden angle spread
    const phi = ((sat.noradId * 73.1) % 180) * (Math.PI / 180)
    return new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.6,             // flatten a bit toward equator
        r * Math.sin(phi) * Math.sin(theta),
    )
}

// ─── Earth ─────────────────────────────────────────────────
function Earth() {
    const meshRef = useRef<THREE.Mesh>(null)
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.04
    })
    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhongMaterial color="#1E90FF" emissive="#001133" emissiveIntensity={0.2} specular="#222222" shininess={25} />
            <mesh scale={[1.025, 1.025, 1.025]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#88CCFF" transparent opacity={0.12} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
            </mesh>
        </mesh>
    )
}

// ─── Debris Point Cloud ─────────────────────────────────────
function DebrisCloud() {
    const positions = useMemo(() => {
        const cloud = generateDebrisCloud(5000)
        const arr = new Float32Array(cloud.length * 3)
        cloud.forEach((p, i) => {
            arr[i * 3] = p.x
            arr[i * 3 + 1] = p.y
            arr[i * 3 + 2] = p.z
        })
        return arr
    }, [])

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        return geo
    }, [positions])

    const material = useMemo(() => new THREE.PointsMaterial({
        color: '#F2F2F2', size: 0.004, sizeAttenuation: true, transparent: true, opacity: 0.6,
    }), [])

    return <points geometry={geometry} material={material} />
}

// ─── Antigravity Particles ───────────────────────────────────
function AntigravityParticles() {
    const meshRef = useRef<THREE.InstancedMesh>(null)
    const { mouse } = useThree()
    const dummy = useMemo(() => new THREE.Object3D(), [])
    const count = 3000

    const basePositions = useMemo(() => {
        const pos: { x: number; y: number; z: number; phase: number; speed: number }[] = []
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            const r = 1.5 + Math.random() * 1.5
            pos.push({
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.cos(phi),
                z: r * Math.sin(phi) * Math.sin(theta),
                phase: Math.random() * Math.PI * 2,
                speed: 0.004 + Math.random() * 0.008,
            })
        }
        return pos
    }, [])

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = clock.getElapsedTime()
        const mouseVec = new THREE.Vector3(mouse.x * 4, mouse.y * 4, 2)

        for (let i = 0; i < count; i++) {
            const bp = basePositions[i]
            const x = bp.x + Math.sin(t * bp.speed + bp.phase) * 0.08
            const y = bp.y + Math.cos(t * bp.speed * 0.7 + bp.phase) * 0.06
            const z = bp.z + Math.sin(t * bp.speed * 1.3 + bp.phase) * 0.07
            const pos = new THREE.Vector3(x, y, z)
            const dist = pos.distanceTo(mouseVec)
            if (dist < 0.8) {
                pos.add(pos.clone().sub(mouseVec).normalize().multiplyScalar((0.8 - dist) * 0.4))
            }
            dummy.position.set(pos.x, pos.y, pos.z)
            dummy.scale.setScalar(0.004 + Math.random() * 0.003)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled>
            <tetrahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color="#F2F2F2" transparent opacity={0.45} />
        </instancedMesh>
    )
}

// ─── Single Satellite Marker ─────────────────────────────────
function SatelliteMarker({ sat }: { sat: typeof SAMPLE_SATELLITES[0] }) {
    const ringRef = useRef<THREE.Mesh>(null)
    const glowRef = useRef<THREE.Mesh>(null)
    const { selectedTarget, setTarget } = useTargetStore()
    const isSelected = selectedTarget?.id === sat.id
    const pos = useMemo(() => satPosition(sat), [sat])

    // Pulse animation
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime()
        if (glowRef.current) {
            const s = 1 + Math.sin(t * 2.5 + sat.noradId) * 0.15
            glowRef.current.scale.setScalar(s)
                ; (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
                    0.25 + Math.sin(t * 2.5 + sat.noradId) * 0.1
        }
        if (ringRef.current) {
            ringRef.current.rotation.z += 0.006
        }
    })

    const color = sat.decayStatus ? '#FF3131' : sat.objectType === 'PAYLOAD' ? '#FFD700' : '#00FF41'

    return (
        <group position={[pos.x, pos.y, pos.z]}>
            {/* Glow sphere */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.3} />
            </mesh>

            {/* Core dot */}
            <mesh onClick={() => setTarget(isSelected ? null : (sat as Satellite))}>
                <sphereGeometry args={[0.012, 8, 8]} />
                <meshBasicMaterial color={color} />
            </mesh>

            {/* Rotating ring */}
            <mesh ref={ringRef}>
                <torusGeometry args={[0.024, 0.002, 6, 20]} />
                <meshBasicMaterial color={color} transparent opacity={0.7} />
            </mesh>

            {/* HTML label */}
            <Html
                center
                distanceFactor={4}
                style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
            >
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: isSelected ? '9px' : '7px',
                    color: isSelected ? color : 'rgba(242,242,242,0.6)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    textShadow: `0 0 6px ${color}`,
                    transform: 'translateY(-18px)',
                    transition: 'all 0.2s',
                    background: isSelected ? `rgba(0,0,0,0.65)` : 'transparent',
                    padding: isSelected ? '2px 5px' : '0',
                    border: isSelected ? `1px solid ${color}` : 'none',
                    borderRadius: '2px',
                }}>
                    {isSelected ? `▶ ${sat.name}` : sat.name.split(' ')[0]}
                </div>
            </Html>
        </group>
    )
}

// ─── All Satellite Markers ───────────────────────────────────
function SatelliteMarkers() {
    return (
        <>
            {SAMPLE_SATELLITES.map((sat) => (
                <SatelliteMarker key={sat.id} sat={sat} />
            ))}
        </>
    )
}

// ─── Camera Rig ─────────────────────────────────────────────
function CameraRig() {
    const { camera } = useThree()
    const page = useNavStore((s) => s.page)

    useEffect(() => {
        if (page === 'SPLASH') {
            camera.position.set(0, 0, 8)
        } else {
            const target = new THREE.Vector3(0, 0, 3.5)
            const animate = () => {
                camera.position.lerp(target, 0.03)
                if (camera.position.distanceTo(target) > 0.01) requestAnimationFrame(animate)
            }
            animate()
        }
    }, [page, camera])

    useFrame(({ clock }) => {
        if (page !== 'SPLASH') return
        const t = clock.getElapsedTime() * 0.04
        camera.position.x = Math.sin(t) * 8
        camera.position.z = Math.cos(t) * 8
        camera.lookAt(0, 0, 0)
    })

    return null
}

// ─── Scene Root ──────────────────────────────────────────────
export default function Scene() {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Canvas
                dpr={[1, 1.5]}
                frameloop="always"
                gl={{ antialias: false, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0, 8], fov: 45, near: 0.01, far: 100 }}
            >
                <ambientLight intensity={0.15} />
                <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
                <pointLight position={[-5, -3, -5]} intensity={0.3} color="#2a6db5" />

                <Stars radius={80} depth={50} count={4000} factor={3} saturation={0} fade speed={0.5} />

                <Earth />
                <DebrisCloud />
                <AntigravityParticles />
                <SatelliteMarkers />
                <CameraRig />
            </Canvas>
        </div>
    )
}
