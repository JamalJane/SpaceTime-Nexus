import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { DEFAULT_MARKERS, DEFAULT_CONNECTIONS } from '../lib/globeData'

// ─── Helper: lat/lng → 3D position on unit sphere ───────────
function latLngToVec3(lat: number, lng: number, radius = 1.001): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    )
}

// ─── Fresnel Atmosphere Shader ───────────────────────────────
const atmosphereVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform vec3 uColor;
  uniform float uIntensity;
  void main() {
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - dot(viewDir, vNormal);
    fresnel = pow(fresnel, 3.0) * uIntensity;
    gl_FragColor = vec4(uColor, fresnel);
  }
`

// ─── Atmosphere Glow Mesh ────────────────────────────────────
function Atmosphere() {
    const uniforms = useMemo(() => ({
        uColor: { value: new THREE.Color('#4d9de0') },
        uIntensity: { value: 1.1 },
    }), [])

    return (
        <mesh scale={[1.08, 1.08, 1.08]}>
            <sphereGeometry args={[1, 64, 64]} />
            <shaderMaterial
                vertexShader={atmosphereVertexShader}
                fragmentShader={atmosphereFragmentShader}
                uniforms={uniforms}
                transparent
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </mesh>
    )
}

// ─── 3D Marker Dot ───────────────────────────────────────────
function MarkerDot({ lat, lng, color }: { lat: number; lng: number; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const pos = useMemo(() => latLngToVec3(lat, lng, 1.005), [lat, lng])

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const pulse = 1 + Math.sin(clock.getElapsedTime() * 3) * 0.25
        meshRef.current.scale.setScalar(pulse)
    })

    return (
        <mesh ref={meshRef} position={pos}>
            <sphereGeometry args={[0.012, 16, 16]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
    )
}

// Ring emanating from marker
function MarkerRing({ lat, lng, color }: { lat: number; lng: number; color: string }) {
    const meshRef = useRef<THREE.Mesh>(null)
    const pos = useMemo(() => latLngToVec3(lat, lng, 1.004), [lat, lng])
    const normal = useMemo(() => pos.clone().normalize(), [pos])

    useFrame(({ clock }) => {
        if (!meshRef.current) return
        const t = (clock.getElapsedTime() * 0.5) % 1
        const scale = 1 + t * 3
        meshRef.current.scale.setScalar(scale)
            ; (meshRef.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - t)
    })

    // Orient ring to face outward from surface
    const quaternion = useMemo(() => {
        const q = new THREE.Quaternion()
        q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
        return q
    }, [normal])

    return (
        <mesh ref={meshRef} position={pos} quaternion={quaternion}>
            <ringGeometry args={[0.012, 0.016, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
    )
}

// ─── Animated Arc ────────────────────────────────────────────
function ArcLine({ startLat, startLng, endLat, endLng, color }: {
    startLat: number; startLng: number
    endLat: number; endLng: number
    color: string
}) {
    const lineRef = useRef<THREE.Line>(null)

    const geometry = useMemo(() => {
        const start = latLngToVec3(startLat, startLng, 1.002)
        const end = latLngToVec3(endLat, endLng, 1.002)

        // Midpoint raised above the surface
        const mid = start.clone().add(end).multiplyScalar(0.5)
        const dist = start.distanceTo(end)
        mid.normalize().multiplyScalar(1 + dist * 0.35)

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
        const points = curve.getPoints(64)
        const geo = new THREE.BufferGeometry().setFromPoints(points)
        return geo
    }, [startLat, startLng, endLat, endLng])

    const material = useMemo(() => {
        const mat = new THREE.LineDashedMaterial({
            color,
            dashSize: 0.03,
            gapSize: 0.02,
            transparent: true,
            opacity: 0.7,
        })
        return mat
    }, [color])

    useFrame(() => {
        if (!lineRef.current) return
        const mat = lineRef.current.material as THREE.LineDashedMaterial
        mat.dashSize = 0.03
        mat.gapSize = 0.02
            // Animate the dash offset
            ; (mat as any).dashOffset -= 0.002
        lineRef.current.computeLineDistances()
    })

    return <line ref={lineRef as any} geometry={geometry} material={material} />
}

// ─── Earth Sphere with Textures ──────────────────────────────
function EarthSphere() {
    const meshRef = useRef<THREE.Mesh>(null)

    // Async texture loading via drei's useTexture (Suspense-friendly)
    const [albedo, bump, specular] = useTexture([
        'https://unpkg.com/three-globe@2.37.2/example/img/earth-blue-marble.jpg',
        'https://unpkg.com/three-globe@2.37.2/example/img/earth-topology.png',
        'https://unpkg.com/three-globe@2.37.2/example/img/earth-water.png',
    ])

    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.03
    })

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshPhongMaterial
                map={albedo}
                bumpMap={bump}
                bumpScale={0.04}
                specularMap={specular}
                specular={new THREE.Color('#666666')}
                shininess={15}
            />
        </mesh>
    )
}

// ─── InteractiveGlobe — composed group (used inside Scene's Canvas) ─
export default function InteractiveGlobe() {
    const groupRef = useRef<THREE.Group>(null)

    return (
        <group ref={groupRef}>
            {/* Textured Earth */}
            <EarthSphere />

            {/* Fresnel atmosphere glow */}
            <Atmosphere />

            {/* Inner haze for soft edge */}
            <mesh scale={[1.04, 1.04, 1.04]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#88CCFF"
                    transparent
                    opacity={0.06}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>

            {/* Markers */}
            {DEFAULT_MARKERS.map(m => (
                <group key={m.id}>
                    <MarkerDot lat={m.lat} lng={m.lng} color={m.color} />
                    <MarkerRing lat={m.lat} lng={m.lng} color={m.color} />
                </group>
            ))}

            {/* Animated arcs */}
            {DEFAULT_CONNECTIONS.map((c, i) => (
                <ArcLine key={i} {...c} />
            ))}
        </group>
    )
}
