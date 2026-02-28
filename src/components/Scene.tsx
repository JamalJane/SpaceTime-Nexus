import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { generateDebrisCloud } from '../lib/sampleData'
import InteractiveGlobe from './InteractiveGlobe'

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

        for (let i = 0; i < count; i++) {
            const bp = basePositions[i]
            const x = bp.x + Math.sin(t * bp.speed + bp.phase) * 0.08
            const y = bp.y + Math.cos(t * bp.speed * 0.7 + bp.phase) * 0.06
            const z = bp.z + Math.sin(t * bp.speed * 1.3 + bp.phase) * 0.07
            dummy.position.set(x, y, z)
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

// ─── Scene Root ──────────────────────────────────────────────
export default function Scene() {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
            <Canvas
                dpr={[1, 1.5]}
                frameloop="always"
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                camera={{ position: [0, 0, 3.5], fov: 45, near: 0.01, far: 100 }}
            >
                <ambientLight intensity={0.2} />
                <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
                <pointLight position={[-5, -3, -5]} intensity={0.4} color="#2a6db5" />

                <Stars radius={80} depth={50} count={4000} factor={3} saturation={0} fade speed={0.5} />

                {/* Suspense boundary for async texture loading */}
                <Suspense fallback={null}>
                    <InteractiveGlobe />
                </Suspense>

                <DebrisCloud />
                <AntigravityParticles />

                {/* Interactive drag/rotate/zoom — replaces CameraRig */}
                <OrbitControls
                    enablePan={false}
                    enableZoom={true}
                    minDistance={2}
                    maxDistance={8}
                    autoRotate
                    autoRotateSpeed={0.3}
                    enableDamping
                    dampingFactor={0.05}
                />
            </Canvas>
        </div>
    )
}
