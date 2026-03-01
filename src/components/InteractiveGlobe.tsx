import { useEffect, useRef, useCallback, useMemo } from 'react'
import Globe, { GlobeMethods } from 'react-globe.gl'
import { DEFAULT_MARKERS, DEFAULT_CONNECTIONS } from '../lib/globeData'

// ─── Texture URLs (same CDN used previously — reliable on Vercel) ────
const GLOBE_IMAGE = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
const BUMP_IMAGE = '//unpkg.com/three-globe/example/img/earth-topology.png'

// ─── Build ring data from markers (pulsing rings at launch sites) ─────
const RINGS_DATA = DEFAULT_MARKERS.map(m => ({
    lat: m.lat,
    lng: m.lng,
    maxR: 3,
    propagationSpeed: 2,
    repeatPeriod: 800,
    color: m.color,
}))

// ─── InteractiveGlobe — standalone DOM component ─────────────────────
export default function InteractiveGlobe() {
    const globeRef = useRef<GlobeMethods | undefined>(undefined)

    // Initial camera position + auto-rotate
    useEffect(() => {
        const globe = globeRef.current
        if (!globe) return

        // Pull camera back a bit
        globe.pointOfView({ altitude: 2.5 })

        // Enable gentle auto-rotation via the internal Three.js controls
        const controls = globe.controls() as any
        if (controls) {
            controls.autoRotate = true
            controls.autoRotateSpeed = 0.4
            controls.enableZoom = true
            controls.minDistance = 180
            controls.maxDistance = 600
        }
    }, [])

    // Point accessors
    const pointLabel = useCallback((d: any) => d.name, [])
    const pointLat = useCallback((d: any) => d.lat, [])
    const pointLng = useCallback((d: any) => d.lng, [])
    const pointColor = useCallback((d: any) => d.color, [])

    // Arc accessors
    const arcStartLat = useCallback((d: any) => d.startLat, [])
    const arcStartLng = useCallback((d: any) => d.startLng, [])
    const arcEndLat = useCallback((d: any) => d.endLat, [])
    const arcEndLng = useCallback((d: any) => d.endLng, [])
    const arcColor = useCallback((d: any) => d.color, [])

    // Ring accessors
    const ringLat = useCallback((d: any) => d.lat, [])
    const ringLng = useCallback((d: any) => d.lng, [])
    const ringColor = useCallback((d: any) => (t: number) => `rgba(${hexToRgb(d.color)},${1 - t})`, [])
    const ringMaxR = useCallback((d: any) => d.maxR, [])
    const ringSpeed = useCallback((d: any) => d.propagationSpeed, [])
    const ringRepeat = useCallback((d: any) => d.repeatPeriod, [])

    return (
        <Globe
            ref={globeRef}

            // ─── Container ──────────────────
            backgroundColor="rgba(0,0,0,0)"
            showAtmosphere={true}
            atmosphereColor="#4d9de0"
            atmosphereAltitude={0.2}
            animateIn={true}

            // ─── Globe Layer ────────────────
            globeImageUrl={GLOBE_IMAGE}
            bumpImageUrl={BUMP_IMAGE}

            // ─── Points (launch site markers) ──
            pointsData={DEFAULT_MARKERS}
            pointLabel={pointLabel}
            pointLat={pointLat}
            pointLng={pointLng}
            pointColor={pointColor}
            pointRadius={0.4}
            pointAltitude={0.01}

            // ─── Arcs (connections between sites) ──
            arcsData={DEFAULT_CONNECTIONS}
            arcStartLat={arcStartLat}
            arcStartLng={arcStartLng}
            arcEndLat={arcEndLat}
            arcEndLng={arcEndLng}
            arcColor={arcColor}
            arcDashLength={0.4}
            arcDashGap={0.2}
            arcDashAnimateTime={1500}
            arcStroke={0.5}

            // ─── Rings (pulsing halos at launch sites) ──
            ringsData={RINGS_DATA}
            ringLat={ringLat}
            ringLng={ringLng}
            ringColor={ringColor}
            ringMaxRadius={ringMaxR}
            ringPropagationSpeed={ringSpeed}
            ringRepeatPeriod={ringRepeat}
        />
    )
}

// ─── Helper: hex color → "r,g,b" string ──────────────────────────────
function hexToRgb(hex: string): string {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `${r},${g},${b}`
}
