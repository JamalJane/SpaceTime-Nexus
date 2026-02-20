import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useTargetStore, useMissionStore, useNavStore } from '../store'
import { estimateDeltaV, tsiolkovskyFuelCheck } from '../lib/orbital'
import { audio } from '../lib/audio'

const CRAFT_MASS_KG = 8000
const FUEL_MASS_KG = 4000
const ISP_SECONDS = 311  // standard RP-1 engine
const CURRENT_ALT_KM = 400  // scavenger craft LEO orbit

export default function InterceptPlannerPage() {
    const { selectedTarget } = useTargetStore()
    const { timeOfFlight, setTimeOfFlight, deltaV, setDeltaV, setFuelOk, setStatus, fuelOk } = useMissionStore()
    const { setPage } = useNavStore()
    const [shaking, setShaking] = useState(false)

    const handleSlider = useCallback((val: number) => {
        setTimeOfFlight(val)
        if (!selectedTarget) return

        const dv = estimateDeltaV(CURRENT_ALT_KM, selectedTarget.altitudeKm)
        // Scale ΔV inversely with time (more time = more efficient trajectory)
        const scaledDv = dv * (1 + (5 / val) * 0.3)
        setDeltaV(scaledDv)

        const ok = tsiolkovskyFuelCheck({
            deltaVMs: scaledDv,
            crafMassKg: CRAFT_MASS_KG,
            fuelMassKg: FUEL_MASS_KG,
            ispSeconds: ISP_SECONDS,
        })
        setFuelOk(ok)

        // Haptic shake on calc complete
        setShaking(true)
        setTimeout(() => setShaking(false), 200)
    }, [selectedTarget, setDeltaV, setFuelOk, setTimeOfFlight])

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'fixed', left: '50%', top: '80px',
                transform: 'translateX(-50%)',
                width: 'min(600px, 88vw)',
                maxHeight: 'calc(100vh - 160px)',
                overflowY: 'auto',
                zIndex: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                pointerEvents: 'all',
            }}
        >
            {!selectedTarget ? (
                <div className="glass" style={{ padding: '32px', textAlign: 'center' }}>
                    <p className="mono" style={{ color: 'var(--gray)', fontSize: '0.75rem', letterSpacing: '2px' }}>
                        NO TARGET SELECTED — GO TO SALVAGE OPS
                    </p>
                </div>
            ) : (
                <>
                    {/* Target info */}
                    <div className="glass" style={{ padding: '14px 18px' }}>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '6px' }}>TARGET</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '1px' }}>{selectedTarget.name}</div>
                        <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--gray)', marginTop: '2px' }}>
                            ORBIT: {selectedTarget.altitudeKm.toLocaleString()} km · ORIGIN: {CURRENT_ALT_KM} km
                        </div>
                    </div>

                    {/* Time-of-Flight Slider */}
                    <div className={`glass ${shaking ? 'anim-shake' : ''}`} style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px' }}>TIME OF FLIGHT</div>
                            <div className="mono" style={{ fontSize: '0.85rem', color: 'var(--signal)' }}>{timeOfFlight.toFixed(1)} DAYS</div>
                        </div>
                        <input
                            type="range" min={0.5} max={14} step={0.5}
                            value={timeOfFlight}
                            onChange={(e) => {
                                handleSlider(parseFloat(e.target.value))
                                if (Math.random() > 0.7) audio.hover()
                            }}
                            style={{
                                width: '100%', cursor: 'pointer',
                                accentColor: 'var(--gold)',
                                height: '3px',
                            }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                            <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)' }}>0.5d (FAST)</span>
                            <span className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)' }}>14d (EFFICIENT)</span>
                        </div>
                    </div>

                    {/* ΔV Readout */}
                    <div className="glass" style={{ padding: '18px 24px' }}>
                        <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '12px' }}>
                            LAMBERT SOLVER — TRANSFER ANALYSIS
                        </div>
                        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-end' }}>
                            {/* ΔV Bar */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', letterSpacing: '1px' }}>Δv GAUGE</div>
                                <div style={{
                                    width: '24px', height: '120px',
                                    background: 'var(--gray-dim)',
                                    border: '1px solid var(--gray)',
                                    borderRadius: '2px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}>
                                    <motion.div
                                        style={{
                                            position: 'absolute', bottom: 0, width: '100%',
                                            background: fuelOk ? 'var(--green)' : 'var(--red)',
                                        }}
                                        animate={{ height: `${Math.min((deltaV ?? 0) / 4000 * 100, 100)}%` }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <DataRow label="REQUIRED Δv" value={deltaV ? `${deltaV.toFixed(1)} m/s` : '—'} />
                                <DataRow label="CLOSEST APPROACH" value="~2.3 km" />
                                <DataRow label="REL. VELOCITY" value="7.8 km/s" />
                                <DataRow label="TRANSFER TYPE" value="Hohmann" />
                                <DataRow
                                    label="FUEL STATUS"
                                    value={fuelOk ? '✓ GO' : '✗ INSUFFICIENT'}
                                    valueColor={fuelOk ? 'var(--green)' : 'var(--red)'}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Confirm */}
                    <button
                        className="btn"
                        disabled={!fuelOk || !deltaV}
                        onClick={() => {
                            audio.click()
                            setStatus('LOCKED')
                            setPage('STAR_LOCK')
                        }}
                        onMouseEnter={() => audio.hover()}
                        style={{ width: '100%' }}
                    >
                        {fuelOk ? 'CONFIRM TRAJECTORY — PROCEED TO STAR-LOCK ▶' : '⛽ FUEL WARNING — MANEUVER IMPOSSIBLE'}
                    </button>
                </>
            )}
        </motion.div>
    )
}

function DataRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '1.5px' }}>{label}</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: valueColor || 'var(--signal)', fontWeight: 600 }}>{value}</span>
        </div>
    )
}
