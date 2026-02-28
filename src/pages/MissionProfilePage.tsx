import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Cpu, Radio, Database } from 'lucide-react'
import { audio } from '../lib/audio'
import { useNavStore } from '../store'
import GlossaryLink from '../components/GlossaryLink'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const NARRATIVE = `Earth's orbit is a paradox: the most valuable real estate humanity has ever claimed,
and the most polluted environment we've ever created.

Since Sputnik in 1957, we've launched over 13,000 satellites. Today, fewer than 7,000 remain
functional. The rest — along with rocket bodies, lens caps, paint flecks, and fragments from
over 600 breakup events — form an invisible minefield traveling at 7.8 km/s.

At these speeds, a 1-cm fragment carries the kinetic energy of a hand grenade. A 1-cm object
hits like 7 kg of TNT. And unlike terrestrial pollution, orbital debris doesn't settle or decompose.
Each collision creates more fragments, which create more collisions — the Kessler Syndrome.

Understanding this crisis isn't optional. It's existential. Without active debris management,
we risk losing access to space within a generation.`

const GLOSSARY = [
    { term: 'SGP4', def: 'Simplified General Perturbations 4 — the algorithm that models orbital decay due to atmospheric drag and Earth\'s oblateness (J2 perturbation). Used by NORAD since the 1960s.' },
    { term: 'TLE', def: 'Two-Line Element Set — a standardized format from NORAD that encodes a satellite\'s orbital parameters at a given epoch. Contains inclination, eccentricity, mean motion, and more in just 138 characters.' },
    { term: 'Delta-V (Δv)', def: 'Change in velocity — the primary measure of propulsion budget for any orbital maneuver. Measured in meters per second (m/s). Getting to LEO requires ~9,400 m/s of delta-v.' },
    { term: 'Apoapsis & Periapsis', def: 'The highest and lowest points in an orbit. At apoapsis, objects move slowest — ideal for orbital transfers. At periapsis, atmospheric drag is strongest.' },
    { term: 'Lambert Problem', def: 'Given two position vectors and a time of flight, calculate the velocity vectors required to travel between them. The mathematical foundation of interplanetary mission planning.' },
    { term: 'NRV', def: 'Net Resource Value — (Σ Material Value) − (ΔV Cost) − (Overhead × Time). An economic metric for evaluating whether recovering an orbital asset is financially viable.' },
    { term: 'Tsiolkovsky Equation', def: 'Δv = Isp × g₀ × ln(m_initial / m_final). Determines if a spacecraft has enough fuel to complete a burn. The most important equation in rocket science.' },
    { term: 'ECI Frame', def: 'Earth-Centered Inertial — a coordinate frame fixed to space (not rotating with Earth). Used for precise orbital calculations because it removes Earth\'s rotation from the math.' },
    { term: 'Kessler Syndrome', def: 'A theoretical cascade where orbital debris collisions generate more debris, triggering more collisions in an exponential chain reaction that could render orbits unusable.' },
    { term: 'Hohmann Transfer', def: 'The most fuel-efficient way to transfer between two circular orbits. Uses two engine burns: one to enter an elliptical transfer orbit, one to circularize at the target altitude.' },
]

const DIAGNOSTICS = [
    { label: 'SGP4 Propagation Engine', status: 'OPERATIONAL', ok: true, icon: <Cpu size={14} /> },
    { label: 'Orbital Data Feed', status: 'CONNECTED', ok: true, icon: <Radio size={14} /> },
    { label: 'Physics Calculator', status: 'READY', ok: true, icon: <Database size={14} /> },
    { label: 'Star Catalog', status: 'LOADED', ok: true, icon: <BookOpen size={14} /> },
]

export default function MissionProfilePage() {
    const [openIdx, setOpenIdx] = useState<number | null>(null)
    const { activeGlossaryTerm } = useNavStore()
    const itemRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        if (activeGlossaryTerm) {
            const idx = GLOSSARY.findIndex(g =>
                g.term.toLowerCase().includes(activeGlossaryTerm.toLowerCase()) ||
                activeGlossaryTerm.toLowerCase().includes(g.term.toLowerCase())
            )
            if (idx !== -1) {
                setOpenIdx(idx)
                setTimeout(() => {
                    itemRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 100)
            }
        }
    }, [activeGlossaryTerm])

    return (
        <div className="page-section" style={{ paddingTop: '100px', alignItems: 'center' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '800px', margin: '0 auto' }}
            >
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>MISSION PROFILE</div>
                    <h2>Understanding <span className="gradient-text">Space Debris</span></h2>
                </motion.div>

                <motion.div variants={fadeUp} className="glass" style={{ padding: '32px' }}>
                    <div className="section-label">THE CRISIS</div>
                    <p style={{ fontSize: '0.92rem', whiteSpace: 'pre-line', lineHeight: 1.85 }}>
                        Earth's orbit is a paradox: the most valuable real estate humanity has ever claimed,
                        and the most polluted environment we've ever created.

                        Since Sputnik in 1957, we've launched over 13,000 satellites. Today, fewer than 7,000 remain
                        functional. The rest — along with rocket bodies, lens caps, paint flecks, and fragments from
                        over 600 breakup events — form an invisible minefield traveling at 7.8 km/s.

                        At these speeds, a 1-cm fragment carries the kinetic energy of a hand grenade. A 1-cm object
                        hits like 7 kg of TNT. And unlike terrestrial pollution, orbital debris doesn't settle or decompose.
                        Each collision creates more fragments, which create more collisions — the <GlossaryLink term="Kessler Syndrome">Kessler Syndrome</GlossaryLink>.

                        Understanding this crisis isn't optional. It's existential. Without active debris management,
                        we risk losing access to space within a generation.
                    </p>
                </motion.div>

                <motion.div variants={fadeUp} className="glass" style={{ padding: '20px 24px' }}>
                    <div className="section-label">SYSTEM DIAGNOSTICS</div>
                    {DIAGNOSTICS.map((row) => (
                        <div key={row.label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '10px 0', borderBottom: '1px solid rgba(64,64,64,0.2)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: 'var(--gray)' }}>{row.icon}</span>
                                <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--signal)' }}>{row.label}</span>
                            </div>
                            <span className={`tag ${row.ok ? 'green' : 'red'}`} style={{ fontSize: '0.55rem' }}>{row.status}</span>
                        </div>
                    ))}
                </motion.div>

                <motion.div variants={fadeUp} className="glass" style={{ padding: '20px 24px' }}>
                    <div className="section-label">ORBITAL PHYSICS GLOSSARY</div>
                    {GLOSSARY.map((item, i) => (
                        <div
                            key={item.term}
                            ref={el => itemRefs.current[i] = el}
                            style={{ borderBottom: i < GLOSSARY.length - 1 ? '1px solid rgba(64,64,64,0.2)' : 'none' }}>
                            <button
                                onClick={() => {
                                    audio.click()
                                    setOpenIdx(openIdx === i ? null : i)
                                }}
                                onMouseEnter={() => audio.hover()}
                                style={{
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--signal)',
                                }}
                            >
                                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '1px' }}>
                                    {item.term}
                                </span>
                                <motion.div animate={{ rotate: openIdx === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                    <ChevronDown size={14} color="var(--gray)" />
                                </motion.div>
                            </button>
                            <AnimatePresence>
                                {openIdx === i && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        style={{
                                            fontSize: '0.82rem', lineHeight: 1.8, color: 'rgba(242,242,242,0.8)',
                                            paddingBottom: '14px', overflow: 'hidden',
                                        }}
                                    >
                                        {item.def}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </motion.div>

                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}
