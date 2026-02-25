import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Globe, Radio, ArrowRight } from 'lucide-react'
import { useNavStore } from '../store'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const NARRATIVE = `The year is 2026. Earth's orbit has become the galaxy's largest junkyard.
Over 27,000 catalogued objects — defunct satellites, rocket bodies, and collision
fragments — circle our planet at speeds exceeding 28,000 km/h.

Understanding this frontier isn't just about science — it's about our future.
Every piece of orbital debris tells a story of human ambition, and every
solution we find brings us closer to sustainable space exploration.

SpaceTime Nexus is your portal to understanding the cosmos, orbital mechanics,
and the invisible infrastructure that connects our world to the stars.`

export default function HomePage() {
    const { setPage } = useNavStore()
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    return (
        <div className="page-section" style={{ minHeight: '100vh', justifyContent: 'flex-start', paddingTop: '100px' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '32px' }}
            >
                {/* Badge */}
                <motion.div variants={fadeUp}>
                    <span className="tag coral" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={11} /> SpaceTime Nexus
                    </span>
                </motion.div>

                {/* Hero headline */}
                <motion.h1 variants={fadeUp} style={{ maxWidth: '800px' }}>
                    Ignite Your Curiosity,{' '}
                    <span className="gradient-text">Expand Your Universe</span>
                </motion.h1>

                {/* Sub text */}
                <motion.p variants={fadeUp} style={{ maxWidth: '600px', fontSize: '1.05rem' }}>
                    Embark on a celestial journey as we unravel the mysteries of the cosmos.
                    Your portal to understanding orbital mechanics, space debris, and the
                    wonders of the universe.
                </motion.p>

                {/* CTA buttons */}
                <motion.div variants={fadeUp} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <button className="btn btn-coral" onClick={() => setPage('GRAVEYARD')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Explore Debris <ArrowRight size={14} />
                    </button>
                    <button className="btn" onClick={() => setPage('MISSION_PROFILE')}>
                        Learn More
                    </button>
                </motion.div>

                {/* Live telemetry strip */}
                <motion.div variants={fadeUp} className="stat-strip" style={{ marginTop: '24px' }}>
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
                </motion.div>

                {/* Narrative card */}
                <motion.div variants={fadeUp} className="glass" style={{ padding: '28px 32px', textAlign: 'left', maxWidth: '650px', width: '100%' }}>
                    <div className="section-label">WHY SPACE MATTERS</div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                        {NARRATIVE}
                    </p>
                </motion.div>

                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}
