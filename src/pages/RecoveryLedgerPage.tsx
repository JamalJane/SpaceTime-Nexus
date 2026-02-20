import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { useTargetStore, useMissionStore, useNavStore, useMarketStore } from '../store'
import { calcNRV } from '../lib/orbital'
import { audio } from '../lib/audio'

export default function RecoveryLedgerPage() {
    const { selectedTarget, setTarget } = useTargetStore()
    const { deltaV, orientationQuaternion, reset } = useMissionStore()
    const { setPage } = useNavStore()
    const { prices } = useMarketStore()
    const titleRef = useRef<HTMLDivElement>(null)

    const nrv = selectedTarget
        ? calcNRV({
            dryMassKg: selectedTarget.dryMassKg,
            materialProfile: selectedTarget.materialProfile,
            prices,
            deltaVMs: deltaV ?? 1200,
            flightDays: 3,
        })
        : 0

    const carbonSaved = selectedTarget ? (selectedTarget.dryMassKg * 0.043).toFixed(1) : '0'
    const lifetimeMass = selectedTarget ? selectedTarget.dryMassKg.toLocaleString() : '0'

    useEffect(() => {
        if (!titleRef.current) return
        gsap.from(titleRef.current, {
            y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        })
    }, [])

    const handleReset = () => {
        audio.click()
        reset()
        setTarget(null)
        setPage('GRAVEYARD')
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
                position: 'fixed', inset: 0, zIndex: 25,
                background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.04) 0%, var(--void) 60%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'all',
                overflowY: 'auto', padding: '40px 0',
            }}
        >
            <div style={{
                width: 'min(580px, 90vw)',
                display: 'flex', flexDirection: 'column', gap: '16px',
            }}>
                {/* Title */}
                <div ref={titleRef} style={{ textAlign: 'center', marginBottom: '8px' }}>
                    <div style={{
                        fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                        color: 'var(--gold)', letterSpacing: '4px', marginBottom: '6px',
                    }}>
                        ✓ OPERATION COMPLETE
                    </div>
                    <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', letterSpacing: '3px', color: 'var(--signal)' }}>
                        MANIFEST SECURED
                    </h1>
                    <div style={{ width: '80px', height: '2px', background: 'var(--gold)', margin: '12px auto 0' }} />
                </div>

                {/* Mission Summary */}
                <div className="glass" style={{ padding: '20px 24px' }}>
                    <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '14px' }}>
                        MISSION REPORT
                    </div>
                    <LedgerRow label="RECOVERED OBJECT" value={selectedTarget?.name ?? 'UNKNOWN'} />
                    <LedgerRow label="OBJECT CLASS" value={selectedTarget?.objectType ?? '—'} />
                    <LedgerRow label="ORBIT ALT." value={`${selectedTarget?.altitudeKm?.toLocaleString() ?? '—'} km`} />
                    <LedgerRow label="TOTAL Δv EXPENDED" value={deltaV ? `${deltaV.toFixed(1)} m/s` : '—'} />
                    <div style={{ height: '1px', background: 'var(--gray)', opacity: 0.3, margin: '10px 0' }} />
                    <LedgerRow label="ORIENTATION Q"
                        value={orientationQuaternion
                            ? orientationQuaternion.map(v => v.toFixed(3)).join(', ')
                            : '1.000, 0.000, 0.000, 0.000'}
                        mono
                    />
                </div>

                {/* Financial */}
                <div className="glass" style={{ padding: '20px 24px' }}>
                    <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '14px' }}>
                        NET RESOURCE VALUE
                    </div>
                    {selectedTarget && Object.entries(selectedTarget.materialProfile).map(([mat, pct]) => {
                        const massKg = selectedTarget.dryMassKg * pct
                        const priceKey = mat as keyof typeof prices
                        return (
                            <LedgerRow
                                key={mat}
                                label={`${mat.toUpperCase()} (${(pct * 100).toFixed(0)}%)`}
                                value={`$${(massKg * (prices[priceKey] as number)).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                            />
                        )
                    })}
                    <div style={{ height: '1px', background: 'var(--gold)', opacity: 0.3, margin: '10px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--gray)', letterSpacing: '2px' }}>TOTAL NRV</span>
                        <span style={{
                            fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 600,
                            color: nrv > 0 ? 'var(--gold)' : 'var(--red)',
                            animation: 'gold-pulse 2s ease-in-out infinite',
                        }}>
                            ${Math.abs(nrv).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                </div>

                {/* Impact Stats */}
                <div className="glass" style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-around' }}>
                    {[
                        { label: 'SALVAGE MASS', value: `${lifetimeMass} kg`, color: 'var(--signal)' },
                        { label: 'CARBON PREVENTED', value: `${carbonSaved} tCO₂`, color: 'var(--green)' },
                        { label: 'DEBRIS REDUCED', value: '1 OBJECT', color: 'var(--gold)' },
                    ].map((stat) => (
                        <div key={stat.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, color: stat.color }}>
                                {stat.value}
                            </div>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1.5px', marginTop: '4px' }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn" onClick={handleReset} onMouseEnter={() => audio.hover()} style={{ width: '100%', marginTop: '4px' }}>
                    ← RETURN TO HUB
                </button>
            </div>
        </motion.div>
    )
}

function LedgerRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '5px 0' }}>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '1.5px' }}>{label}</span>
            <span className="mono" style={{
                fontSize: mono ? '0.6rem' : '0.72rem',
                color: 'var(--signal)',
                textAlign: 'right',
                maxWidth: '60%',
                wordBreak: 'break-all',
            }}>
                {value}
            </span>
        </div>
    )
}
