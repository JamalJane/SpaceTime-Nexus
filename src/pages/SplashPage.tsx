import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useNavStore } from '../store'
import { audio } from '../lib/audio'

const QUOTE_LINES = [
    'A satellite only truly dies',
    'when it is forgotten.',
    '',
    '— Dr. Hiluluk',
]

const LORE = `The year is 2026. Earth's orbit has become the galaxy's largest junkyard.
Over 27,000 catalogued objects — defunct satellites, rocket bodies, and collision
fragments — circle our planet at speeds exceeding 28,000 km/h.

NEXUS was founded by the Orbital Salvage Syndicate to do what governments
couldn't: treat the graveyard as a resource.

Every kilogram of forgotten aluminum, titanium, and gold in orbit represents
pre-positioned feedstock for the next generation of space infrastructure.
We don't clean up space. We profit from it.`

const GLOSSARY = [
    { term: 'SGP4', def: 'Simplified General Perturbations 4. The algorithm that models orbital decay due to atmospheric drag and Earth\'s oblateness (J2 perturbation).' },
    { term: 'TLE', def: 'Two-Line Element Set. A standardized format from NORAD that encodes a satellite\'s orbital parameters at a given epoch.' },
    { term: 'Delta-V (Δv)', def: 'Change in velocity. The primary measure of propulsion budget for any orbital maneuver, in meters per second.' },
    { term: 'Apoapsis', def: 'The highest point in an orbit above Earth. At apoapsis, objects move slowest — ideal for orbital transfers.' },
    { term: 'Lambert Problem', def: 'Given two position vectors and a time of flight, calculate the velocity vectors required to travel between them.' },
    { term: 'NRV', def: 'Net Resource Value. NEXUS\'s economic metric: (Σ Material Value) − (ΔV Cost) − (Overhead × Time).' },
    { term: 'Tsiolkovsky Eq.', def: 'Δv = Isp × g₀ × ln(m_initial / m_final). Determines if a spacecraft has enough fuel to complete a burn.' },
    { term: 'ECI', def: 'Earth-Centered Inertial. A coordinate frame fixed to space (not rotating with Earth), used for precise orbital calculations.' },
]

const CHAR_COUNT = QUOTE_LINES.join('').replace(/\s/g, '').length

export default function SplashPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ container: containerRef })
    const enableHud = useNavStore((s) => s.enableHud)
    const [openIdx, setOpenIdx] = useState<number | null>(null)

    // Fade out quote at end of its track
    const quoteOpacity = useTransform(scrollYProgress, [0.35, 0.45], [1, 0])
    const contentOpacity = useTransform(scrollYProgress, [0.4, 0.5], [0, 1])
    const contentY = useTransform(scrollYProgress, [0.4, 0.5], [50, 0])

    // Character animation
    let charIndex = 0

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed', inset: 0, zIndex: 20,
                overflowY: 'scroll', overflowX: 'hidden',
                scrollBehavior: 'smooth',
            }}
        >
            <div style={{ height: '240vh', position: 'relative' }}>
                {/* ─── Part 1: Sticky Quote ────────────────────────── */}
                <motion.div
                    style={{
                        position: 'sticky', top: 0, height: '100vh',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: '0.6rem', opacity: quoteOpacity,
                    }}
                >
                    {QUOTE_LINES.map((line, li) => {
                        if (line === '') return <div key={li} style={{ height: '1.5rem' }} />
                        return (
                            <div key={li} style={{ display: 'flex', gap: '0.15em', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {line.split('').map((ch, ci) => {
                                    const idx = charIndex++
                                    // Faster animation mapping: finish by 0.35 progress
                                    const start = (idx / CHAR_COUNT) * 0.3
                                    const end = start + 0.1

                                    return (
                                        <ScrollChar
                                            key={`${li}-${ci}`}
                                            char={ch}
                                            scrollYProgress={scrollYProgress}
                                            rangeStart={Math.min(start, 0.3)}
                                            rangeEnd={Math.min(end, 0.35)}
                                        />
                                    )
                                })}
                            </div>
                        )
                    })}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        className="mono"
                        style={{
                            marginTop: '40px', fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '2px'
                        }}
                    >
                        SCROLL TO CONTINUE
                    </motion.div>
                </motion.div>

                {/* ─── Part 2: Briefing Content ────────────────────── */}
                <div style={{
                    position: 'absolute', top: '100vh', width: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    paddingBottom: '100px'
                }}>
                    <motion.div
                        style={{
                            opacity: contentOpacity, y: contentY,
                            width: 'min(640px, 85vw)', display: 'flex', flexDirection: 'column', gap: '24px'
                        }}
                    >
                        {/* Title */}
                        <div style={{ textAlign: 'center', margin: '40px 0 20px' }}>
                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gold)', letterSpacing: '4px' }}>
                                ORBITAL SALVAGE SYNDICATE
                            </div>
                            <h1 style={{ fontSize: '2rem', marginTop: '10px' }}>NEXUS // BRIEFING</h1>
                        </div>

                        {/* Lore */}
                        <div className="glass" style={{ padding: '24px 28px' }}>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '12px' }}>
                                SITUATION REPORT
                            </div>
                            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--signal)', opacity: 0.9, whiteSpace: 'pre-line' }}>
                                {LORE}
                            </p>
                        </div>

                        {/* Diagnostics */}
                        <div className="glass" style={{ padding: '16px 20px' }}>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '12px' }}>
                                SYSTEM DIAGNOSTICS
                            </div>
                            {[
                                { label: 'Space-Track API', status: 'CONNECTED', ok: true },
                                { label: 'SGP4 Worker', status: 'RUNNING', ok: true },
                                { label: 'MetalPrice Feed', status: 'CACHED', ok: true },
                                { label: 'Star Catalog', status: 'LOADED', ok: true },
                            ].map((row) => (
                                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(64,64,64,0.3)' }}>
                                    <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--signal)' }}>{row.label}</span>
                                    <span className={`tag ${row.ok ? 'green' : 'red'}`} style={{ fontSize: '0.55rem' }}>{row.status}</span>
                                </div>
                            ))}
                        </div>

                        {/* Glossary */}
                        <div className="glass" style={{ padding: '16px 20px' }}>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '12px' }}>
                                PHYSICS GLOSSARY
                            </div>
                            {GLOSSARY.map((item, i) => (
                                <div key={item.term} style={{ borderBottom: '1px solid rgba(64,64,64,0.3)' }}>
                                    <button
                                        onClick={() => {
                                            audio.click()
                                            setOpenIdx(openIdx === i ? null : i)
                                        }}
                                        onMouseEnter={() => audio.hover()}
                                        style={{
                                            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--signal)',
                                        }}
                                    >
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>
                                            {item.term}
                                        </span>
                                        <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                            <ChevronDown size={13} color="var(--gray)" />
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openIdx === i && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                style={{ fontSize: '0.78rem', lineHeight: 1.7, color: 'var(--signal)', opacity: 0.75, paddingBottom: '10px', overflow: 'hidden' }}
                                            >
                                                {item.def}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {/* Enter Button */}
                        <div style={{ marginTop: '20px', paddingBottom: '80px' }}>
                            <button
                                className="btn active"
                                style={{ width: '100%', padding: '20px', fontSize: '1rem' }}
                                onClick={() => {
                                    audio.click()
                                    enableHud()
                                }}
                                onMouseEnter={() => audio.hover()}
                            >
                                INITIALIZE SYSTEM ▶
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

// ─── Individual animated character ────────────────────────
interface ScrollCharProps {
    char: string
    scrollYProgress: import('framer-motion').MotionValue<number>
    rangeStart: number
    rangeEnd: number
}

function ScrollChar({ char, scrollYProgress, rangeStart, rangeEnd }: ScrollCharProps) {
    const blur = useTransform(scrollYProgress, [rangeStart, rangeEnd], ['blur(18px)', 'blur(0px)'])
    const op = useTransform(scrollYProgress, [rangeStart, rangeEnd], [0, 1])
    const scale = useTransform(scrollYProgress, [rangeStart, rangeEnd], [1.4, 1])

    return (
        <motion.span
            style={{
                display: 'inline-block',
                filter: blur,
                opacity: op,
                scale,
                fontFamily: char === '—' ? 'var(--font-mono)' : 'var(--font-ui)',
                fontSize: char === '—' ? '1.1rem' : 'clamp(1.4rem, 3vw, 2.4rem)',
                fontWeight: char === '—' ? 400 : 300,
                letterSpacing: '0.04em',
                color: 'var(--signal)',
            }}
        >
            {char === ' ' ? '\u00A0' : char}
        </motion.span>
    )
}
