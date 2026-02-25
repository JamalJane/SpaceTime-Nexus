import { motion } from 'framer-motion'
import { AlertTriangle, Orbit, Layers, TrendingUp, Zap } from 'lucide-react'
import { SAMPLE_SATELLITES } from '../lib/sampleData'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const ALTITUDE_BANDS = [
    { name: 'LEO', range: '160 – 2,000 km', density: '78%', color: 'var(--coral)', desc: 'Low Earth Orbit — ISS, Hubble, Starlink. Highest debris density zone.' },
    { name: 'MEO', range: '2,000 – 35,786 km', density: '15%', color: 'var(--gold)', desc: 'Medium Earth Orbit — GPS and navigation constellations.' },
    { name: 'GEO', range: '35,786 km', density: '7%', color: 'var(--purple)', desc: 'Geostationary — Weather, communications, and broadcast satellites.' },
]

const DEBRIS_EVENTS = [
    { year: '2007', event: 'China ASAT Test', desc: 'Deliberate destruction of Fengyun-1C created 3,500+ trackable fragments.', severity: 'critical' },
    { year: '2009', event: 'Iridium-Cosmos Collision', desc: 'First accidental hypervelocity collision between two intact satellites.', severity: 'critical' },
    { year: '2021', event: 'Russia ASAT Test', desc: 'Destruction of Cosmos 1408 threatened ISS crew with debris cloud.', severity: 'warning' },
    { year: '2025', event: 'Kessler Threshold', desc: 'Projected point where cascading collisions become self-sustaining.', severity: 'danger' },
]

export default function GraveyardPage() {
    const totalDebris = SAMPLE_SATELLITES.length
    const decaying = SAMPLE_SATELLITES.filter(s => s.decayStatus).length
    const payloads = SAMPLE_SATELLITES.filter(s => s.objectType === 'PAYLOAD').length

    return (
        <div className="page-section" style={{ paddingTop: '100px' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>THE ORBITAL GRAVEYARD</div>
                    <h2>Earth's <span className="gradient-text">Invisible Crisis</span></h2>
                    <p style={{ maxWidth: '650px', margin: '16px auto 0', fontSize: '0.95rem' }}>
                        Over 27,000 catalogued objects orbit Earth at speeds exceeding 28,000 km/h.
                        Each one is a potential catastrophe — and a potential resource.
                    </p>
                </motion.div>

                {/* Stats grid */}
                <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <StatCard icon={<Orbit size={20} />} value="27,000+" label="Tracked Objects" color="var(--coral)" />
                    <StatCard icon={<Zap size={20} />} value="28,000" label="km/h Avg Speed" color="var(--gold)" />
                    <StatCard icon={<Layers size={20} />} value={`${payloads}`} label="Active Payloads" color="var(--green)" />
                    <StatCard icon={<AlertTriangle size={20} />} value={`${decaying}`} label="Decaying Orbits" color="var(--red)" />
                    <StatCard icon={<TrendingUp size={20} />} value="1M+" label="Fragments < 1cm" color="var(--purple)" />
                </motion.div>

                {/* Altitude Bands */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">ORBITAL ALTITUDE BANDS</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                        {ALTITUDE_BANDS.map(band => (
                            <div key={band.name} className="glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{
                                    width: '56px', height: '56px', borderRadius: '14px',
                                    background: `${band.color}15`,
                                    border: `1px solid ${band.color}40`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: band.color }}>{band.name}</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{band.range}</span>
                                        <span className="tag" style={{ color: band.color, borderColor: band.color }}>{band.density} of debris</span>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.7 }}>{band.desc}</p>
                                    {/* Progress bar */}
                                    <div style={{ height: '3px', background: 'var(--gray-dim)', borderRadius: '2px', marginTop: '8px' }}>
                                        <div style={{ height: '100%', width: band.density, background: band.color, borderRadius: '2px', transition: 'width 1s' }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Notable Events Timeline */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">NOTABLE DEBRIS EVENTS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginTop: '12px' }}>
                        {DEBRIS_EVENTS.map(event => (
                            <div key={event.year} className="glass info-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="mono" style={{ fontSize: '1.2rem', color: 'var(--gold)' }}>{event.year}</span>
                                    <span className={`tag ${event.severity === 'critical' ? 'red' : event.severity === 'danger' ? 'coral' : 'gold'}`}>
                                        {event.severity.toUpperCase()}
                                    </span>
                                </div>
                                <h3 style={{ fontSize: '1rem' }}>{event.event}</h3>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>{event.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Bottom spacer for CardNav */}
                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
    return (
        <div className="glass info-card" style={{ alignItems: 'center', textAlign: 'center' }}>
            <div style={{ color, marginBottom: '4px' }}>{icon}</div>
            <div className="stat-value" style={{ background: 'none', WebkitTextFillColor: color, fontSize: '1.5rem' }}>{value}</div>
            <span className="stat-label">{label}</span>
        </div>
    )
}
