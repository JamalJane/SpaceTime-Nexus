import { useRef, useEffect, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const AMBER = '#FF8C00'
const PANEL_BLUE = '#0a1628'
const HULL_GRAY = '#3a3a3a'

interface SatelliteModelProps {
    meshRef: MutableRefObject<THREE.Group | undefined>
    rotationActive: MutableRefObject<boolean>
}

export default function SatelliteModel({ meshRef, rotationActive }: SatelliteModelProps) {
    const groupRef = useRef<THREE.Group>(null!)

    useEffect(() => {
        if (meshRef && groupRef.current) meshRef.current = groupRef.current
    }, [meshRef])

    useFrame(() => {
        if (!groupRef.current || !rotationActive.current) return
        groupRef.current.rotation.x += 0.005
        groupRef.current.rotation.y += 0.009
        groupRef.current.rotation.z += 0.003
    })

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* ── Main bus (central body — chamfered look) ── */}
            <mesh castShadow>
                <boxGeometry args={[1.2, 0.7, 0.7]} />
                <meshStandardMaterial
                    color={HULL_GRAY}
                    roughness={0.55}
                    metalness={0.8}
                    emissive={AMBER}
                    emissiveIntensity={0.03}
                    transparent
                />
            </mesh>
            {/* Bus detail panel — front face */}
            <mesh position={[0, 0, 0.351]}>
                <planeGeometry args={[0.9, 0.5]} />
                <meshStandardMaterial
                    color="#222"
                    roughness={0.9}
                    metalness={0.3}
                    transparent
                />
            </mesh>
            {/* Bus detail panel — top face */}
            <mesh position={[0, 0.351, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.9, 0.5]} />
                <meshStandardMaterial
                    color="#2d2d2d"
                    roughness={0.85}
                    metalness={0.35}
                    transparent
                />
            </mesh>

            {/* ── Solar panel LEFT — multi-segment, bent ── */}
            <group position={[-1.05, 0, 0]} rotation={[0, 0, 0.12]}>
                {/* Arm connecting to bus */}
                <mesh position={[0.35, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
                    <meshStandardMaterial color="#555" roughness={0.6} metalness={0.7} transparent />
                </mesh>
                {/* Panel segment 1 (inner) */}
                <mesh position={[-0.15, 0, 0]}>
                    <boxGeometry args={[0.7, 0.03, 0.55]} />
                    <meshStandardMaterial color={PANEL_BLUE} roughness={0.4} metalness={0.6} transparent />
                </mesh>
                {/* Panel cell grid lines — inner */}
                <mesh position={[-0.15, 0.017, 0]}>
                    <planeGeometry args={[0.68, 0.53]} />
                    <meshStandardMaterial
                        color="#0e2040"
                        roughness={0.3}
                        metalness={0.5}
                        emissive="#0a1e3a"
                        emissiveIntensity={0.15}
                        transparent
                    />
                </mesh>
                {/* Panel segment 2 (outer) — slight angle for damage */}
                <mesh position={[-0.85, 0.02, 0]} rotation={[0, 0, 0.08]}>
                    <boxGeometry args={[0.65, 0.03, 0.55]} />
                    <meshStandardMaterial color={PANEL_BLUE} roughness={0.4} metalness={0.6} transparent />
                </mesh>
                {/* Hinge between segments */}
                <mesh position={[-0.5, 0, 0]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.56, 4]} />
                    <meshStandardMaterial color="#666" roughness={0.5} metalness={0.8} transparent />
                </mesh>
            </group>

            {/* ── Solar panel RIGHT — damaged, partially snapped ── */}
            <group position={[1.05, -0.05, 0]} rotation={[0.06, 0, -0.18]}>
                {/* Arm connecting to bus */}
                <mesh position={[-0.35, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
                    <meshStandardMaterial color="#555" roughness={0.6} metalness={0.7} transparent />
                </mesh>
                {/* Panel — shorter (broken off) */}
                <mesh position={[0.15, 0, 0]}>
                    <boxGeometry args={[0.65, 0.03, 0.5]} />
                    <meshStandardMaterial color={PANEL_BLUE} roughness={0.45} metalness={0.55} transparent />
                </mesh>
                {/* Cell grid */}
                <mesh position={[0.15, 0.017, 0]}>
                    <planeGeometry args={[0.63, 0.48]} />
                    <meshStandardMaterial
                        color="#0e2040"
                        roughness={0.3}
                        metalness={0.5}
                        emissive="#0a1e3a"
                        emissiveIntensity={0.1}
                        transparent
                    />
                </mesh>
                {/* Dangling fragment — broken panel edge */}
                <mesh position={[0.62, -0.06, 0.1]} rotation={[0.3, 0.1, -0.45]}>
                    <boxGeometry args={[0.25, 0.02, 0.18]} />
                    <meshStandardMaterial color="#0d1a30" roughness={0.5} metalness={0.4} transparent />
                </mesh>
            </group>

            {/* ── Antenna mast ── */}
            <mesh position={[0, 0.55, 0]}>
                <cylinderGeometry args={[0.015, 0.012, 0.6, 6]} />
                <meshStandardMaterial color="#777" roughness={0.5} metalness={0.9} transparent />
            </mesh>
            {/* Antenna cross-bar */}
            <mesh position={[0, 0.82, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.008, 0.008, 0.35, 4]} />
                <meshStandardMaterial color="#666" roughness={0.5} metalness={0.8} transparent />
            </mesh>

            {/* ── Communication dish — cracked/tilted ── */}
            <group position={[0.15, 0.45, 0.3]} rotation={[0.5, 0.2, 0.4]}>
                <mesh>
                    <cylinderGeometry args={[0.25, 0.05, 0.06, 12]} />
                    <meshStandardMaterial
                        color="#4a4a4a"
                        roughness={0.6}
                        metalness={0.7}
                        side={THREE.DoubleSide}
                        transparent
                    />
                </mesh>
                {/* Dish feed horn */}
                <mesh position={[0, 0.15, 0]}>
                    <cylinderGeometry args={[0.02, 0.015, 0.22, 6]} />
                    <meshStandardMaterial color="#888" roughness={0.4} metalness={0.8} transparent />
                </mesh>
            </group>

            {/* ── Thruster nozzles (rear) ── */}
            {[[-0.2, -0.25, -0.35], [0.2, -0.25, -0.35]].map((pos, i) => (
                <mesh key={`thruster-${i}`} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.06, 0.08, 0.1, 8]} />
                    <meshStandardMaterial
                        color="#2a2a2a"
                        roughness={0.7}
                        metalness={0.6}
                        emissive="#331100"
                        emissiveIntensity={0.15}
                        transparent
                    />
                </mesh>
            ))}

            {/* ── Structural ribs along bus ── */}
            {[-0.25, 0, 0.25].map((z, i) => (
                <mesh key={`rib-${i}`} position={[0, 0, z]}>
                    <boxGeometry args={[1.22, 0.72, 0.015]} />
                    <meshStandardMaterial
                        color="#4a4a4a"
                        roughness={0.7}
                        metalness={0.6}
                        transparent
                        opacity={0.4}
                    />
                </mesh>
            ))}

            {/* ── Status light (dying) ── */}
            <mesh position={[0.4, 0.36, 0.2]}>
                <sphereGeometry args={[0.025, 8, 8]} />
                <meshStandardMaterial
                    color={AMBER}
                    emissive={AMBER}
                    emissiveIntensity={2}
                    transparent
                />
            </mesh>

            {/* ── Emissive power-cell glow ── */}
            <pointLight color={AMBER} intensity={0.6} distance={3} />
            {/* Subtle rim light for depth */}
            <pointLight color="#1a3a6a" intensity={0.3} distance={2} position={[-1, 0.5, 1]} />
        </group>
    )
}
