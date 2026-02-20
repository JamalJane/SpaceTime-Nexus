import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMissionStore, useNavStore } from '../store'
import { audio } from '../lib/audio'

// Star catalog (simplified — real positions from Hipparcos)
const STARS = [
    { name: 'Polaris', x: 50, y: 25, mag: 2.0, constellation: 'Ursa Minor' },
    { name: 'Vega', x: 70, y: 40, mag: 0.0, constellation: 'Lyra' },
    { name: 'Deneb', x: 80, y: 30, mag: 1.3, constellation: 'Cygnus' },
    { name: 'Altair', x: 75, y: 60, mag: 0.8, constellation: 'Aquila' },
    { name: 'Arcturus', x: 35, y: 55, mag: -0.1, 'constellation': 'Boötes' },
    { name: 'Sirius', x: 20, y: 65, mag: -1.5, constellation: 'Canis Major' },
    { name: 'Rigel', x: 25, y: 70, mag: 0.1, constellation: 'Orion' },
    { name: 'Betelgeuse', x: 30, y: 62, mag: 0.4, constellation: 'Orion' },
    { name: 'Capella', x: 15, y: 45, mag: 0.1, constellation: 'Auriga' },
    { name: 'Procyon', x: 22, y: 55, mag: 0.4, constellation: 'Canis Minor' },
    { name: 'Achernar', x: 60, y: 80, mag: 0.5, constellation: 'Eridanus' },
    { name: 'Hadar', x: 45, y: 85, mag: 0.6, constellation: 'Centaurus' },
    { name: 'Acrux', x: 40, y: 78, mag: 0.8, constellation: 'Crux' },
    { name: 'Aldebaran', x: 28, y: 48, mag: 0.9, constellation: 'Taurus' },
    { name: 'Spica', x: 48, y: 65, mag: 1.0, constellation: 'Virgo' },
    { name: 'Antares', x: 55, y: 72, mag: 1.1, constellation: 'Scorpius' },
    { name: 'Fomalhaut', x: 65, y: 82, mag: 1.2, constellation: 'Piscis' },
    { name: 'Pollux', x: 18, y: 38, mag: 1.1, constellation: 'Gemini' },
    { name: 'Castor', x: 16, y: 32, mag: 1.6, constellation: 'Gemini' },
    { name: 'Regulus', x: 38, y: 58, mag: 1.4, constellation: 'Leo' },
]

type Phase = 'SCANNING' | 'MATCH_FOUND' | 'LOCKED'

export default function StarLockPage() {
    const { setQuaternion, setStatus } = useMissionStore()
    const { setPage } = useNavStore()

    const [pan, setPan] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [phase, setPhase] = useState<Phase>('SCANNING')
    const [matched, setMatched] = useState<string | null>(null)
    const [scanIdx, setScanIdx] = useState(0)
    const intervalRef = useRef<ReturnType<typeof setInterval>>()

    // Auto-scan sequence
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setScanIdx((i) => (i + 1) % STARS.length)
        }, 800)
        return () => clearInterval(intervalRef.current)
    }, [])

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        setDragging(true)
        setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
    }, [pan])

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!dragging) return
        setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
    }, [dragging, dragStart])

    const handleMouseUp = useCallback(() => {
        setDragging(false)
        if (phase === 'SCANNING') {
            setPhase('MATCH_FOUND')
            setMatched('Orion')
            setTimeout(() => {
                setPhase('LOCKED')
                clearInterval(intervalRef.current)
                // Generate orientation quaternion from star positions
                const theta = Math.atan2(pan.y, pan.x)
                setQuaternion([
                    parseFloat(Math.cos(theta / 2).toFixed(4)),
                    parseFloat((Math.sin(theta / 2) * 0.0).toFixed(4)),
                    parseFloat((Math.sin(theta / 2) * 1.0).toFixed(4)),
                    parseFloat((Math.sin(theta / 2) * 0.0).toFixed(4)),
                ])
            }, 1800)
        }
    }, [phase, pan, setQuaternion])

    const visibleStars = STARS.map(s => ({
        ...s,
        sx: s.x + pan.x * 0.1,
        sy: s.y + pan.y * 0.1,
    }))

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 25,
                background: 'radial-gradient(ellipse at center, #080810 0%, #020205 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: dragging ? 'grabbing' : 'grab',
                pointerEvents: 'all',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Starfield */}
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* Noise filter */}
                <defs>
                    <filter id="noise">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
                        <feColorMatrix type="saturate" values="0" />
                        <feBlend in="SourceGraphic" mode="overlay" result="blend" />
                        <feComposite in="blend" in2="SourceGraphic" operator="in" />
                    </filter>
                    <radialGradient id="grain" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grain)" />

                {/* Stars */}
                {visibleStars.map((star, i) => {
                    const isScanning = scanIdx === i && phase === 'SCANNING'
                    const isMatchedStar = phase !== 'SCANNING' && star.constellation === matched
                    const screenX = (star.sx / 100) * window.innerWidth
                    const screenY = (star.sy / 100) * window.innerHeight
                    const size = Math.max(1, 3 - star.mag * 0.8)

                    return (
                        <g key={star.name}>
                            {isScanning && (
                                <rect
                                    x={screenX - 12} y={screenY - 12}
                                    width={24} height={24}
                                    fill="none" stroke="var(--green)" strokeWidth={1}
                                    opacity={0.7}
                                />
                            )}
                            {isMatchedStar && (
                                <line
                                    x1={screenX} y1={screenY}
                                    x2={visibleStars[(i + 1) % visibleStars.length].sx / 100 * window.innerWidth}
                                    y2={visibleStars[(i + 1) % visibleStars.length].sy / 100 * window.innerHeight}
                                    stroke="var(--green)" strokeWidth={0.5} opacity={0.5} strokeDasharray="4 4"
                                />
                            )}
                            <circle cx={screenX} cy={screenY} r={size} fill="white" opacity={0.85} />
                            {isScanning && (
                                <text x={screenX + 8} y={screenY - 8}
                                    fontFamily="var(--font-mono)" fontSize={9} fill="var(--green)" opacity={0.8}>
                                    SCANNING...
                                </text>
                            )}
                            {isMatchedStar && (
                                <text x={screenX + 8} y={screenY - 8}
                                    fontFamily="var(--font-mono)" fontSize={9} fill="var(--green)">
                                    {star.name}
                                </text>
                            )}
                        </g>
                    )
                })}
            </svg>

            {/* Viewfinder Circle */}
            <div style={{ position: 'relative', width: '300px', height: '300px', pointerEvents: 'none' }}>
                <svg viewBox="0 0 300 300" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                    {/* Crosshair */}
                    <line x1="150" y1="0" x2="150" y2="120" stroke="var(--green)" strokeWidth={1} opacity={0.5} />
                    <line x1="150" y1="180" x2="150" y2="300" stroke="var(--green)" strokeWidth={1} opacity={0.5} />
                    <line x1="0" y1="150" x2="120" y2="150" stroke="var(--green)" strokeWidth={1} opacity={0.5} />
                    <line x1="180" y1="150" x2="300" y2="150" stroke="var(--green)" strokeWidth={1} opacity={0.5} />

                    {/* Main circle */}
                    <circle cx="150" cy="150" r="148" fill="none" stroke="var(--green)" strokeWidth={1} opacity={0.4} />
                    <circle cx="150" cy="150" r="120" fill="none" stroke="var(--green)" strokeWidth={0.5} opacity={0.2} strokeDasharray="4 8" />

                    {/* Corner brackets */}
                    {[[8, 8], [292, 8], [8, 292], [292, 292]].map(([cx, cy], i) => {
                        const dx = cx === 8 ? 1 : -1
                        const dy = cy === 8 ? 1 : -1
                        return (
                            <g key={i} className={phase === 'SCANNING' ? 'anim-blink' : ''}>
                                <line x1={cx} y1={cy} x2={cx + dx * 20} y2={cy} stroke="var(--green)" strokeWidth={1.5} />
                                <line x1={cx} y1={cy} x2={cx} y2={cy + dy * 20} stroke="var(--green)" strokeWidth={1.5} />
                            </g>
                        )
                    })}

                    {/* Lock ring */}
                    {phase === 'LOCKED' && (
                        <motion.circle
                            cx="150" cy="150" r="148"
                            fill="none" stroke="var(--green)" strokeWidth={2}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2 }}
                        />
                    )}
                </svg>

                {/* Phase label */}
                <div style={{
                    position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '3px', whiteSpace: 'nowrap',
                    color: phase === 'LOCKED' ? 'var(--green)' : 'var(--gray)',
                }}>
                    {phase === 'SCANNING' && '● SCANNING STARFIELD — DRAG TO PAN'}
                    {phase === 'MATCH_FOUND' && `◆ MATCH FOUND — ${matched?.toUpperCase()} CONSTELLATION`}
                    {phase === 'LOCKED' && '✓ AZIMUTH LOCKED — QUATERNIONS SAVED'}
                </div>
            </div>

            {/* Phase status overlay */}
            <AnimatePresence>
                {phase === 'LOCKED' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            position: 'absolute', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
                        }}
                    >
                        <button className="btn active" onClick={() => {
                            audio.click()
                            setStatus('LOCKED')
                            setPage('RECOVERY_LEDGER')
                        }} onMouseEnter={() => audio.hover()}>
                            EXECUTE BURN — RECOVERY LEDGER ▶
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ESC */}
            <button
                onClick={() => {
                    audio.click()
                    setPage('GRAVEYARD')
                }}
                onMouseEnter={() => audio.hover()}
                style={{
                    position: 'absolute', top: '32px', right: '32px',
                    fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px',
                    color: 'var(--gray)', background: 'none', border: '1px solid var(--gray)',
                    padding: '6px 14px', borderRadius: '2px', cursor: 'pointer',
                }}
            >
                ← ABORT
            </button>
        </motion.div>
    )
}
