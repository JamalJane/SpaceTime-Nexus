import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Satellite, Zap, Clock } from 'lucide-react'
import { useTargetStore, useNavStore } from '../store'
import { calcNRV } from '../lib/orbital'
import { useMarketStore } from '../store'

function UtcClock() {
    const [time, setTime] = useState(new Date())
    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])
    return (
        <span className="mono" style={{ color: 'var(--green)' }}>
            {time.toISOString().slice(0, 19).replace('T', ' ')} UTC
        </span>
    )
}

export default function HudOverlay() {
    const { selectedTarget } = useTargetStore()
    const { page } = useNavStore()
    const { prices } = useMarketStore()

    const nrv = selectedTarget
        ? calcNRV({
            dryMassKg: selectedTarget.dryMassKg,
            materialProfile: selectedTarget.materialProfile,
            prices,
            deltaVMs: 1200,
            flightDays: 3,
        })
        : null

    if (page === 'SPLASH') return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="hud-frame"
            style={{ pointerEvents: 'none' }}
        >
            {/* ── Top Header ── */}
            <header
                style={{
                    gridColumn: '1 / -1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid var(--gray)',
                    pointerEvents: 'none',
                }}
            >
                {/* Left: Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Satellite size={18} color="var(--gold)" />
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '4px', color: 'var(--signal)' }}>
                            NEXUS
                        </div>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '2px' }}>
                            ORBITAL SALVAGE COMMAND
                        </div>
                    </div>
                </div>

                {/* Center: Telemetry */}
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1px' }}>OBJECTS TRACKED</div>
                        <div className="mono" style={{ fontSize: '0.9rem', color: 'var(--signal)' }}>27,000+</div>
                    </div>
                    <div style={{ width: '1px', height: '28px', background: 'var(--gray)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1px' }}>SYSTEM TIME</div>
                        <UtcClock />
                    </div>
                    <div style={{ width: '1px', height: '28px', background: 'var(--gray)' }} />
                    <div style={{ textAlign: 'center' }}>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1px' }}>CONN STATUS</div>
                        <div className="mono anim-blink" style={{ fontSize: '0.8rem', color: 'var(--green)' }}>NOMINAL</div>
                    </div>
                </div>

                {/* Right: Fuel */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={13} color="var(--green)" />
                    <div>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1px' }}>SCAVENGER FUEL</div>
                        <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginTop: '2px' }}>
                            {[...Array(10)].map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '8px', height: '8px', borderRadius: '1px',
                                        background: i < 7 ? 'var(--green)' : 'var(--gray)',
                                    }}
                                />
                            ))}
                            <span className="mono" style={{ marginLeft: '6px', fontSize: '0.7rem', color: 'var(--green)' }}>70%</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Bounty Sidebar ── */}
            {selectedTarget && (
                <motion.aside
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="glass"
                    style={{
                        gridColumn: 2,
                        gridRow: '2 / 4',
                        marginTop: '12px',
                        padding: '16px',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        pointerEvents: 'all',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '2px' }}>TARGET LOCKED</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', marginTop: '2px' }}>
                                {selectedTarget.name}
                            </div>
                        </div>
                        <span className={`tag ${selectedTarget.decayStatus ? 'red' : 'green'}`}>
                            {selectedTarget.decayStatus ? 'DECAY' : 'STABLE'}
                        </span>
                    </div>

                    <div className="divider" />

                    <Row label="NORAD ID" value={`#${selectedTarget.noradId}`} />
                    <Row label="ALTITUDE" value={`${selectedTarget.altitudeKm.toLocaleString()} km`} />
                    <Row label="DRY MASS" value={`${selectedTarget.dryMassKg.toLocaleString()} kg`} />
                    <Row label="TYPE" value={selectedTarget.objectType} />

                    <div className="divider" />

                    <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '2px' }}>MATERIAL COMPOSITION</div>
                    {Object.entries(selectedTarget.materialProfile).map(([mat, pct]) => (
                        <div key={mat} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--signal)', textTransform: 'uppercase' }}>{mat}</span>
                                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--gold)' }}>{(pct * 100).toFixed(0)}%</span>
                            </div>
                            <div style={{ height: '2px', background: 'var(--gray)', borderRadius: '1px' }}>
                                <div style={{ width: `${pct * 100}%`, height: '100%', background: 'var(--gold)', borderRadius: '1px' }} />
                            </div>
                        </div>
                    ))}

                    <div className="divider" />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '2px' }}>EST. BOUNTY (NRV)</div>
                            <div style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1.4rem',
                                fontWeight: 600,
                                color: nrv && nrv > 0 ? 'var(--gold)' : 'var(--red)',
                                letterSpacing: '1px',
                            }}>
                                {nrv !== null ? `$${Math.abs(nrv).toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—'}
                            </div>
                        </div>
                        <Clock size={13} color="var(--gray)" />
                    </div>
                </motion.aside>
            )}
        </motion.div>
    )
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '1.5px' }}>{label}</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--signal)' }}>{value}</span>
        </div>
    )
}
