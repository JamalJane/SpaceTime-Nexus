import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, Globe, Radio, ArrowRight } from 'lucide-react'
import { useNavStore } from '../store'
import { audio } from '../lib/audio'

const QUOTE_LINES = [
    'A satellite only truly dies',
    'when it is forgotten.',
    '',
    '— Dr. Hiluluk',
]

const NARRATIVE = `The year is 2026. Earth's orbit has become the galaxy's largest junkyard.
Over 27,000 catalogued objects — defunct satellites, rocket bodies, and collision
fragments — circle our planet at speeds exceeding 28,000 km/h.

SpaceTime Nexus is your portal to understanding the cosmos, orbital mechanics,
and the invisible infrastructure that connects our world to the stars.`

const GLOSSARY_PREVIEW = [
    { term: 'Orbital Mechanics', def: 'The science of predicting how objects move through space under gravity — the foundation of everything from GPS to deep space missions.' },
    { term: 'Space Debris', def: 'Defunct satellites, rocket stages, and collision fragments orbiting Earth at 28,000 km/h — a growing threat to active missions.' },
    { term: 'Delta-V (Δv)', def: 'Change in velocity — the primary currency of spaceflight, determining what missions are possible with available fuel.' },
]

const CHAR_COUNT = QUOTE_LINES.join('').replace(/\s/g, '').length

export default function SplashPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({ container: containerRef })
    const enableHud = useNavStore((s) => s.enableHud)
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const quoteOpacity = useTransform(scrollYProgress, [0.25, 0.32], [1, 0])
    const heroOpacity = useTransform(scrollYProgress, [0.28, 0.38], [0, 1])
    const heroY = useTransform(scrollYProgress, [0.28, 0.38], [60, 0])
    const contentOpacity = useTransform(scrollYProgress, [0.52, 0.6], [0, 1])
    const contentY = useTransform(scrollYProgress, [0.52, 0.6], [40, 0])

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
            <div style={{ height: '380vh', position: 'relative' }}>
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
                                    const start = (idx / CHAR_COUNT) * 0.22
                                    const end = start + 0.08
                                    return (
                                        <ScrollChar
                                            key={`${li}-${ci}`}
                                            char={ch}
                                            scrollYProgress={scrollYProgress}
                                            rangeStart={Math.min(start, 0.22)}
                                            rangeEnd={Math.min(end, 0.26)}
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
                        style={{ marginTop: '40px', fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '2px' }}
                    >
                        SCROLL TO CONTINUE
                    </motion.div>
                </motion.div>

                {/* ─── Part 2: Hero Section (from HomePage) ──────── */}
                <div style={{ position: 'absolute', top: '90vh', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <motion.div
                        style={{
                            opacity: heroOpacity, y: heroY,
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            textAlign: 'center', gap: '24px', width: 'min(800px, 90vw)', padding: '0 20px',
                        }}
                    >
                        <span className="tag coral" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Sparkles size={11} /> SpaceTime Nexus
                        </span>

                        <h1 style={{ maxWidth: '700px', lineHeight: 1.15 }}>
                            Ignite Your Curiosity,{' '}
                            <span className="gradient-text">Expand Your Universe</span>
                        </h1>

                        <p style={{ maxWidth: '560px', fontSize: '1rem' }}>
                            Embark on a celestial journey as we unravel the mysteries of the cosmos.
                            Your portal to understanding orbital mechanics, space debris, and the
                            wonders of the universe.
                        </p>

                        {/* Live telemetry strip */}
                        <div className="stat-strip" style={{ marginTop: '16px' }}>
                            <div className="stat-item glass" style={{ borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '4px' }}>
                                    <Globe size={13} color="var(--coral)" />
                                    <span className="stat-label" style={{ marginTop: 0 }}>OBJECTS TRACKED</span>
                                </div>
                                <div className="stat-value">27,000+</div>
                            </div>
                            <div className="stat-item glass" style={{ borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '4px' }}>
                                    <Radio size={13} color="var(--green)" />
                                    <span className="stat-label" style={{ marginTop: 0 }}>SYSTEM TIME</span>
                                </div>
                                <div className="mono" style={{ fontSize: '1.1rem', color: 'var(--green)' }}>
                                    {time.toISOString().slice(11, 19)} UTC
                                </div>
                            </div>
                            <div className="stat-item glass" style={{ borderRadius: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '4px' }}>
                                    <Sparkles size={13} color="var(--gold)" />
                                    <span className="stat-label" style={{ marginTop: 0 }}>ORBITAL DENSITY</span>
                                </div>
                                <div className="stat-value">CRITICAL</div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ─── Part 3: Narrative + Glossary + Enter ─────── */}
                <div style={{
                    position: 'absolute', top: '200vh', width: '100%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    paddingBottom: '100px',
                }}>
                    <motion.div
                        style={{
                            opacity: contentOpacity, y: contentY,
                            width: 'min(640px, 85vw)', display: 'flex', flexDirection: 'column', gap: '24px',
                        }}
                    >
                        {/* Narrative */}
                        <div className="glass" style={{ padding: '28px 32px' }}>
                            <div className="section-label">WHY SPACE MATTERS</div>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                                {NARRATIVE}
                            </p>
                        </div>

                        {/* Preview Glossary */}
                        <div className="glass" style={{ padding: '20px 24px' }}>
                            <div className="section-label">KEY CONCEPTS</div>
                            {GLOSSARY_PREVIEW.map((item, i) => (
                                <div key={item.term} style={{ borderBottom: i < GLOSSARY_PREVIEW.length - 1 ? '1px solid rgba(64,64,64,0.3)' : 'none' }}>
                                    <button
                                        onClick={() => {
                                            audio.click()
                                            setOpenIdx(openIdx === i ? null : i)
                                        }}
                                        onMouseEnter={() => audio.hover()}
                                        style={{
                                            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--signal)',
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
                                className="btn btn-coral"
                                style={{ width: '100%', padding: '20px', fontSize: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                onClick={() => {
                                    audio.click()
                                    enableHud()
                                }}
                                onMouseEnter={() => audio.hover()}
                            >
                                ENTER NEXUS <ArrowRight size={16} />
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
                fontFamily: char === '—' ? 'var(--font-mono)' : 'var(--font-display)',
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
