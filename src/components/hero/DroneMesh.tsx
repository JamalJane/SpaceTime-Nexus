import { useRef, useEffect, MutableRefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const YELLOW = '#FACC15'
const DRONE_START_X = -18

const armPositions: [number, number, number][] = [
    [0.55, 0, 0.55],
    [-0.55, 0, 0.55],
    [0.55, 0, -0.55],
    [-0.55, 0, -0.55],
]

interface DroneMeshProps {
    meshRef: MutableRefObject<THREE.Group | undefined>
}

export default function DroneMesh({ meshRef }: DroneMeshProps) {
    const groupRef = useRef<THREE.Group>(null!)

    useEffect(() => {
        if (meshRef && groupRef.current) meshRef.current = groupRef.current
    }, [meshRef])

    // Subtle hover throb
    useFrame(({ clock }) => {
        if (!groupRef.current) return
        groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 2.2) * 0.04
    })

    return (
        <group ref={groupRef} position={[DRONE_START_X, 0.4, 0]}>
            {/* Body */}
            <mesh castShadow>
                <octahedronGeometry args={[0.38, 0]} />
                <meshStandardMaterial
                    color={YELLOW}
                    roughness={0.2}
                    metalness={0.85}
                    emissive={YELLOW}
                    emissiveIntensity={0.15}
                    transparent
                />
            </mesh>
            {/* Arms */}
            {armPositions.map((pos, i) => (
                <mesh key={i} position={pos} rotation={[0, Math.PI / 4, 0]}>
                    <cylinderGeometry args={[0.025, 0.025, 0.78, 5]} />
                    <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.7} transparent />
                </mesh>
            ))}
            {/* Thruster rings */}
            {armPositions.map((pos, i) => (
                <mesh key={`t${i}`} position={[pos[0] * 1.1, 0, pos[2] * 1.1]}>
                    <torusGeometry args={[0.13, 0.025, 6, 12]} />
                    <meshStandardMaterial
                        color={YELLOW}
                        emissive={YELLOW}
                        emissiveIntensity={0.6}
                        transparent
                    />
                </mesh>
            ))}
            {/* Engine glow lights */}
            {armPositions.map((pos, i) => (
                <pointLight
                    key={`l${i}`}
                    position={[pos[0] * 1.1, 0, pos[2] * 1.1]}
                    color={YELLOW}
                    intensity={0.5}
                    distance={1.8}
                />
            ))}
            {/* Front targeting light */}
            <pointLight position={[0.8, 0, 0]} color={YELLOW} intensity={1.2} distance={4} />
        </group>
    )
}
