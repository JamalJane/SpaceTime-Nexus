import { motion, AnimatePresence } from 'framer-motion'
import { useTargetStore, useMissionStore, useMarketStore } from '../store'
import { calcNRV } from '../lib/orbital'
import { SAMPLE_SATELLITES } from '../lib/sampleData'
import { audio } from '../lib/audio'

const METAL_LABELS: Record<string, string> = {
    aluminum: 'AL — Aluminum',
    titanium: 'TI — Titanium',
    gold: 'AU — Gold',
    copper: 'CU — Copper',
}

const TICKER_SYMBOLS = [
    'AL $2.65/kg', 'TI $11.50/kg', 'AU $62,000/kg', 'CU $9.80/kg',
    'SPACE-AL $3.20/kg', 'SPACE-TI $14.00/kg', 'SPACE-AU $74,400/kg', 'SPACE-CU $11.76/kg',
]

export default function SalvageOpsPage() {
    const { selectedTarget, setTarget } = useTargetStore()
    const { setStatus } = useMissionStore()
    const { prices } = useMarketStore()

    const handleCommit = () => {
        if (!selectedTarget) return
        setStatus('PLOTTED')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.35 }}
            style={{
                position: 'fixed',
                // Pin to left edge, respect HUD margin; leave space for right sidebar (380px) + margin
                left: 'var(--hud-margin)',
                right: 'calc(var(--sidebar-w) + var(--hud-margin) * 2)',
                top: '72px',
                bottom: '72px',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                pointerEvents: 'all',
                minWidth: 0,
            }}
        >
            {/* Metal price ticker */}
            <div style={{
                overflow: 'hidden',
                borderBottom: '1px solid var(--gray)',
                paddingBottom: '8px',
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', animation: 'marquee 22s linear infinite', whiteSpace: 'nowrap' }}>
                    {[...TICKER_SYMBOLS, ...TICKER_SYMBOLS].map((s, i) => (
                        <span key={i} className="mono" style={{ fontSize: '0.6rem', color: 'var(--gold)', marginRight: '28px' }}>
                            ● {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* Two-column body: list + breakdown side-by-side */}
            <div style={{
                flex: 1,
                display: 'flex',
                gap: '12px',
                minHeight: 0,
                overflow: 'hidden',
            }}>
                {/* ── LEFT: Target list ── */}
                <div className="glass" style={{
                    flex: '0 0 auto',
                    width: selectedTarget ? '50%' : '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    transition: 'width 0.35s ease',
                }}>
                    <div className="mono" style={{
                        fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px',
                        padding: '12px 14px 6px',
                        flexShrink: 0,
                        borderBottom: '1px solid rgba(64,64,64,0.4)',
                    }}>
                        AVAILABLE TARGETS — SELECT TO ANALYZE
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {SAMPLE_SATELLITES.map((sat, i) => {
                            const nrv = calcNRV({
                                dryMassKg: sat.dryMassKg,
                                materialProfile: sat.materialProfile,
                                prices,
                                deltaVMs: 1200,
                                flightDays: 3,
                            })
                            const isSelected = selectedTarget?.id === sat.id

                            return (
                                <motion.div
                                    key={sat.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onClick={() => setTarget(isSelected ? null : sat)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        height: '58px',
                                        padding: '0 14px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(64,64,64,0.3)',
                                        background: isSelected ? 'rgba(255,215,0,0.07)' : 'transparent',
                                        borderLeft: isSelected ? '2px solid var(--gold)' : '2px solid transparent',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                                        <span style={{
                                            fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.5px',
                                            color: isSelected ? 'var(--gold)' : 'var(--signal)',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>
                                            {sat.name}
                                        </span>
                                        <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)' }}>
                                            {sat.altitudeKm.toLocaleString()} km · {sat.dryMassKg.toLocaleString()} kg
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                                        <span className={`tag ${sat.decayStatus ? 'red' : 'gray'}`} style={{ fontSize: '0.5rem' }}>
                                            {sat.decayStatus ? '⚠ PRIOR' : sat.objectType}
                                        </span>
                                        <span className="mono" style={{
                                            fontSize: '0.75rem', fontWeight: 600,
                                            color: nrv > 0 ? 'var(--gold)' : 'var(--red)',
                                        }}>
                                            {nrv > 0 ? '+' : ''}${Math.abs(nrv).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* ── RIGHT: Analyze breakdown (only when target selected) ── */}
                <AnimatePresence>
                    {selectedTarget && (
                        <motion.div
                            key="breakdown"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="glass"
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                minWidth: 0,
                            }}
                        >
                            {/* Header */}
                            <div style={{
                                padding: '10px 16px',
                                borderBottom: '1px solid rgba(64,64,64,0.4)',
                                flexShrink: 0,
                            }}>
                                <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--gold)', letterSpacing: '2px' }}>
                                    ANALYZING TARGET
                                </div>
                                <div style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {selectedTarget.name}
                                </div>
                            </div>

                            {/* Scrollable content */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                {/* Material bars */}
                                <div>
                                    <div className="mono" style={{ fontSize: '0.5rem', color: 'var(--gray)', letterSpacing: '2px', marginBottom: '10px' }}>
                                        MATERIAL COMPOSITION
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        {Object.entries(selectedTarget.materialProfile).map(([mat, pct]) => {
                                            const massKg = selectedTarget.dryMassKg * pct
                                            const priceKey = mat as keyof typeof prices
                                            const value = massKg * (prices[priceKey] as number)
                                            return (
                                                <div key={mat}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--signal)' }}>
                                                            {METAL_LABELS[mat] || mat}
                                                        </span>
                                                        <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gold)' }}>
                                                            {massKg.toFixed(1)} kg · ${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                        </span>
                                                    </div>
                                                    <div style={{ height: '3px', background: 'var(--gray)', borderRadius: '2px' }}>
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${pct * 100}%` }}
                                                            transition={{ duration: 0.5, ease: 'easeOut' }}
                                                            style={{ height: '100%', background: 'var(--gold)', borderRadius: '2px' }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Stats grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                    {[
                                        { label: 'NORAD ID', value: `#${selectedTarget.noradId}` },
                                        { label: 'ALTITUDE', value: `${selectedTarget.altitudeKm.toLocaleString()} km` },
                                        { label: 'DRY MASS', value: `${selectedTarget.dryMassKg.toLocaleString()} kg` },
                                        { label: 'DECAY', value: selectedTarget.decayStatus ? '⚠ IMMINENT' : 'STABLE' },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px' }}>
                                            <div className="mono" style={{ fontSize: '0.48rem', color: 'var(--gray)', letterSpacing: '1.5px' }}>{label}</div>
                                            <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--signal)', marginTop: '2px' }}>{value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* NRV Total */}
                                {(() => {
                                    const nrv = calcNRV({
                                        dryMassKg: selectedTarget.dryMassKg,
                                        materialProfile: selectedTarget.materialProfile,
                                        prices,
                                        deltaVMs: 1200,
                                        flightDays: 3,
                                    })
                                    return (
                                        <div style={{ padding: '10px 12px', border: `1px solid ${nrv > 0 ? 'var(--gold)' : 'var(--red)'}`, borderRadius: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                            <div>
                                                <div className="mono" style={{ fontSize: '0.48rem', color: 'var(--gray)', letterSpacing: '2px' }}>EST. BOUNTY (NRV)</div>
                                                <div style={{
                                                    fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700,
                                                    color: nrv > 0 ? 'var(--gold)' : 'var(--red)',
                                                }}>
                                                    {nrv > 0 ? '+' : ''}${Math.abs(nrv).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                                </div>
                                            </div>
                                            <span className="mono" style={{ fontSize: '0.5rem', color: 'var(--gray)' }}>
                                                after fuel & overhead
                                            </span>
                                        </div>
                                    )
                                })()}
                            </div>

                            {/* Commit button */}
                            <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(64,64,64,0.4)', flexShrink: 0 }}>
                                <button
                                    className="btn active"
                                    onClick={() => {
                                        audio.click()
                                        handleCommit()
                                    }}
                                    onMouseEnter={() => audio.hover()}
                                    style={{ width: '100%' }}
                                >
                                    COMMIT TO MISSION ▶
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}
