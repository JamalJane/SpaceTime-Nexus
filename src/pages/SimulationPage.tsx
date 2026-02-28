import { useState, useMemo, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Rocket, Fuel, DollarSign, AlertTriangle, CheckCircle, ArrowRight, RotateCcw, ChevronDown, Compass } from 'lucide-react'
import { SAMPLE_SATELLITES } from '../lib/sampleData'
import GlossaryLink from '../components/GlossaryLink'
import { estimateDeltaV, tsiolkovskyFuelCheck, calcNRV } from '../lib/orbital'
import { audio } from '../lib/audio'
import { useNavStore } from '../store'

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

type MissionPhase = 'SELECT' | 'CONFIGURE' | 'RUNNING' | 'COMPLETE'

interface MissionLog {
    time: string
    text: string | React.ReactNode
    status: 'info' | 'warn' | 'ok' | 'error'
}

const METAL_PRICES = { aluminum: 2.65, titanium: 11.50, gold: 62000, copper: 9.80 }
const EARTH_R = 6371

export default function SimulationPage() {
    const { setPage } = useNavStore()
    const [phase, setPhase] = useState<MissionPhase>('SELECT')
    const [targetIdx, setTargetIdx] = useState<number | null>(null)
    const [craftMass, setCraftMass] = useState(2000)
    const [fuelMass, setFuelMass] = useState(800)
    const [isp, setIsp] = useState(320)
    const [startAlt, setStartAlt] = useState(400)
    const [logs, setLogs] = useState<MissionLog[]>([])
    const [missionProgress, setMissionProgress] = useState(0)
    const [missionResult, setMissionResult] = useState<'success' | 'fail' | null>(null)
    const logRef = useRef<HTMLDivElement>(null)

    const target = targetIdx !== null ? SAMPLE_SATELLITES[targetIdx] : null

    // Live calculations
    const deltaV = useMemo(() => target ? estimateDeltaV(startAlt, target.altitudeKm) : 0, [startAlt, target])

    const G0 = 9.80665
    const maxDeltaV = isp * G0 * Math.log((craftMass + fuelMass) / craftMass)

    const fuelOk = useMemo(() => target ? tsiolkovskyFuelCheck({
        deltaVMs: deltaV,
        crafMassKg: craftMass,
        fuelMassKg: fuelMass,
        ispSeconds: isp,
    }) : false, [deltaV, craftMass, fuelMass, isp, target])

    const transferTime = useMemo(() => {
        if (!target) return 0
        const r1 = (EARTH_R + startAlt) * 1000
        const r2 = (EARTH_R + target.altitudeKm) * 1000
        const a = (r1 + r2) / 2
        return Math.PI * Math.sqrt(a ** 3 / 3.986e14)
    }, [startAlt, target])

    const nrv = useMemo(() => target ? calcNRV({
        dryMassKg: target.dryMassKg,
        materialProfile: target.materialProfile,
        prices: METAL_PRICES,
        deltaVMs: deltaV,
        flightDays: Math.ceil(transferTime / 86400) || 1,
    }) : 0, [target, deltaV, transferTime])

    // Auto-scroll logs
    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
    }, [logs])

    const addLog = (text: string | React.ReactNode, status: MissionLog['status'] = 'info') => {
        const t = new Date().toISOString().slice(11, 19)
        setLogs(prev => [...prev, { time: t, text, status }])
    }

    // ── Run mission simulation ──
    const runMission = async () => {
        if (!target) return
        setPhase('RUNNING')
        setLogs([])
        setMissionProgress(0)
        setMissionResult(null)
        audio.click()

        const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

        // Phase 1: Pre-launch checks
        addLog('Initializing mission computer...', 'info')
        await delay(800)
        setMissionProgress(5)

        addLog(<span>Target acquired: <strong>{target.name}</strong></span>, 'info')
        await delay(600)
        addLog(`Target altitude: ${target.altitudeKm.toLocaleString()} km`, 'info')
        await delay(400)
        addLog(`Target mass: ${target.dryMassKg.toLocaleString()} kg`, 'info')
        await delay(600)
        setMissionProgress(10)

        addLog('Running pre-flight diagnostics...', 'info')
        await delay(700)
        addLog(`Spacecraft dry mass: ${craftMass.toLocaleString()} kg ✓`, 'ok')
        await delay(400)
        addLog(`Fuel loaded: ${fuelMass.toLocaleString()} kg ✓`, 'ok')
        await delay(400)
        addLog(`Engine Isp: ${isp} seconds ✓`, 'ok')
        await delay(500)
        setMissionProgress(15)

        // Phase 2: Delta-V calculation
        addLog(<span>Computing <GlossaryLink term="Hohmann Transfer">Hohmann transfer</GlossaryLink> orbit...</span>, 'info')
        await delay(900)
        addLog(`Starting orbit: ${startAlt} km`, 'info')
        await delay(300)
        addLog(`Transfer orbit semi-major axis: ${((EARTH_R + startAlt + EARTH_R + target.altitudeKm) / 2).toFixed(0)} km`, 'info')
        await delay(500)
        addLog(`Required Δv: ${deltaV.toFixed(1)} m/s`, 'info')
        await delay(400)
        addLog(`Max available Δv: ${maxDeltaV.toFixed(1)} m/s`, fuelOk ? 'ok' : 'error')
        setMissionProgress(25)

        if (!fuelOk) {
            await delay(600)
            addLog(<span>⚠ ABORT: Insufficient fuel! Need {deltaV.toFixed(1)} m/s but only have {maxDeltaV.toFixed(1)} m/s</span>, 'error')
            addLog('Mission terminated — increase fuel or reduce spacecraft mass.', 'error')
            setMissionResult('fail')
            setPhase('COMPLETE')
            audio.error()
            return
        }

        addLog('Fuel check PASSED ✓', 'ok')
        await delay(600)

        // Phase 3: Launch
        addLog('━━━ LAUNCH SEQUENCE INITIATED ━━━', 'warn')
        setMissionProgress(30)
        await delay(500)
        for (let i = 5; i >= 1; i--) {
            addLog(`T-${i}...`, 'warn')
            await delay(400)
        }
        addLog('IGNITION — First burn!', 'ok')
        audio.click()
        setMissionProgress(40)
        await delay(800)

        addLog(`Δv applied: ${(deltaV * 0.55).toFixed(1)} m/s (burn 1 of 2)`, 'info')
        await delay(600)
        addLog('Entering transfer orbit...', 'info')
        setMissionProgress(50)

        // Phase 4: Coast
        const coastMinutes = (transferTime / 60).toFixed(1)
        addLog(<span>Coasting on <GlossaryLink term="Hohmann Transfer">Hohmann ellipse</GlossaryLink> — estimated {coastMinutes} minutes</span>, 'info')
        await delay(1200)
        setMissionProgress(60)
        addLog('Passing through Van Allen radiation belt...', 'warn')
        await delay(800)
        addLog('Shield integrity: nominal ✓', 'ok')
        setMissionProgress(70)
        await delay(600)
        addLog('Approaching target orbital altitude...', 'info')
        await delay(500)

        // Phase 5: Circularization burn
        addLog('━━━ CIRCULARIZATION BURN ━━━', 'warn')
        setMissionProgress(80)
        await delay(600)
        addLog(`Δv applied: ${(deltaV * 0.45).toFixed(1)} m/s (burn 2 of 2)`, 'info')
        await delay(500)
        addLog(`Orbit circularized at ${target.altitudeKm.toLocaleString()} km ✓`, 'ok')
        audio.click()
        setMissionProgress(85)

        // Phase 6: Intercept + Capture
        await delay(700)
        addLog(<span>Radar lock on <strong>{target.name}</strong> — range: 2.4 km</span>, 'info')
        await delay(600)
        addLog('Closing at 12 m/s relative velocity...', 'info')
        setMissionProgress(90)
        await delay(500)
        addLog('Range: 800m... 200m... 50m...', 'info')
        await delay(600)
        addLog('Deploying capture net...', 'warn')
        await delay(800)

        // Random chance based on decay status
        const captureChance = target.decayStatus ? 0.7 : 0.9
        const success = Math.random() < captureChance

        if (success) {
            addLog('TARGET CAPTURED ✓', 'ok')
            audio.click()
            setMissionProgress(95)
            await delay(500)

            // Phase 7: Salvage analysis
            addLog('Running material analysis scan...', 'info')
            await delay(600)
            addLog(`Aluminum: ${(target.materialProfile.aluminum * 100).toFixed(0)}% — ${(target.dryMassKg * target.materialProfile.aluminum).toFixed(0)} kg`, 'info')
            await delay(300)
            addLog(`Titanium: ${(target.materialProfile.titanium * 100).toFixed(0)}% — ${(target.dryMassKg * target.materialProfile.titanium).toFixed(0)} kg`, 'info')
            await delay(300)
            addLog(`Gold: ${(target.materialProfile.gold * 100).toFixed(0)}% — ${(target.dryMassKg * target.materialProfile.gold).toFixed(0)} kg`, 'info')
            await delay(300)
            addLog(`Copper: ${(target.materialProfile.copper * 100).toFixed(0)}% — ${(target.dryMassKg * target.materialProfile.copper).toFixed(0)} kg`, 'info')
            await delay(500)

            addLog(<span>━━━ <GlossaryLink term="NRV">NET RESOURCE VALUE</GlossaryLink>: ${nrv.toLocaleString('en-US', { maximumFractionDigits: 0 })} ━━━</span>, nrv > 0 ? 'ok' : 'warn')
            setMissionProgress(100)
            setMissionResult('success')
        } else {
            addLog('Capture net MISSED — target tumble rate too high!', 'error')
            audio.error()
            await delay(500)
            addLog('Target spinning beyond capture tolerance.', 'error')
            addLog(<span><strong>{target.name}</strong> is in {target.decayStatus ? 'uncontrolled decay' : 'stable orbit'} — retrieval failed.</span>, 'error')
            setMissionProgress(95)
            setMissionResult('fail')
        }

        await delay(400)
        addLog('━━━ MISSION COMPLETE ━━━', 'info')
        setPhase('COMPLETE')
    }

    const resetMission = () => {
        setPhase('SELECT')
        setTargetIdx(null)
        setLogs([])
        setMissionProgress(0)
        setMissionResult(null)
    }

    return (
        <div className="page-section" style={{ paddingTop: '80px' }}>
            <motion.div
                className="section-inner"
                initial="hidden"
                animate="show"
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px', margin: '0 auto' }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>MISSION SIMULATION</div>
                    <h2>Intercept &amp; <span className="gradient-text">Recover</span></h2>
                    <p style={{ maxWidth: '600px', margin: '8px auto 0', fontSize: '0.9rem' }}>
                        Select a target satellite, configure your spacecraft, and run a real-time
                        simulation of an orbital intercept and salvage mission.
                    </p>
                </motion.div>

                {/* Progress bar */}
                {(phase === 'RUNNING' || phase === 'COMPLETE') && (
                    <motion.div variants={fadeUp}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '1px' }}>MISSION PROGRESS</span>
                            <span className="mono" style={{ fontSize: '0.7rem', color: missionResult === 'fail' ? 'var(--red)' : 'var(--gold)' }}>{missionProgress}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', borderRadius: '3px', background: 'var(--gray-dim)', overflow: 'hidden' }}>
                            <motion.div
                                animate={{ width: `${missionProgress}%` }}
                                transition={{ duration: 0.4 }}
                                style={{
                                    height: '100%', borderRadius: '3px',
                                    background: missionResult === 'fail'
                                        ? 'var(--red)'
                                        : 'linear-gradient(90deg, var(--coral), var(--gold))',
                                }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* ── PHASE 1: Target Selection ── */}
                {phase === 'SELECT' && (
                    <motion.div variants={fadeUp}>
                        <div className="section-label">
                            <Target size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                            STEP 1 — SELECT TARGET
                        </div>
                        <p style={{ fontSize: '0.82rem', marginBottom: '12px', opacity: 0.7 }}>
                            Choose a satellite or debris object from the orbital catalog to intercept.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {SAMPLE_SATELLITES.map((sat, i) => (
                                <button
                                    key={sat.id}
                                    onClick={() => { setTargetIdx(i); audio.click() }}
                                    onMouseEnter={() => audio.hover()}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '14px 20px', gap: '16px', flexWrap: 'wrap',
                                        background: targetIdx === i ? 'rgba(232,132,92,0.1)' : 'rgba(13,13,13,0.75)',
                                        border: targetIdx === i ? '1px solid var(--coral)' : '1px solid rgba(64,64,64,0.5)',
                                        borderRadius: '12px', cursor: 'pointer', color: 'var(--signal)',
                                        transition: 'all 0.2s', textAlign: 'left',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            width: '10px', height: '10px', borderRadius: '50%',
                                            background: sat.objectType === 'DEBRIS' ? 'var(--red)' : 'var(--green)',
                                            flexShrink: 0,
                                        }} />
                                        <div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{sat.name}</div>
                                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>
                                                NORAD {sat.noradId} · {sat.objectType} · {sat.altitudeKm.toLocaleString()} km · {sat.dryMassKg.toLocaleString()} kg
                                            </div>
                                        </div>
                                    </div>
                                    {sat.decayStatus && <span className="tag red" style={{ fontSize: '0.5rem' }}>DECAYING</span>}
                                </button>
                            ))}
                        </div>
                        {targetIdx !== null && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '16px', textAlign: 'center' }}>
                                <button className="btn btn-coral" onClick={() => { setPhase('CONFIGURE'); audio.click() }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                    Configure Mission <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* ── PHASE 2: Configure Spacecraft ── */}
                {phase === 'CONFIGURE' && target && (
                    <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Target summary */}
                        <div className="glass" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                                <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '1px' }}>TARGET</span>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{target.name}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="mono" style={{ fontSize: '1rem', color: 'var(--coral)' }}>{target.altitudeKm.toLocaleString()}</div>
                                    <div className="stat-label">ALT (KM)</div>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <div className="mono" style={{ fontSize: '1rem', color: 'var(--gold)' }}>{target.dryMassKg.toLocaleString()}</div>
                                    <div className="stat-label">MASS (KG)</div>
                                </div>
                            </div>
                        </div>

                        {/* Spacecraft config */}
                        <div className="glass-warm" style={{ padding: '28px' }}>
                            <div className="section-label">
                                <Rocket size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                                STEP 2 — CONFIGURE SPACECRAFT
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '16px' }}>
                                <SliderInput label="Starting Altitude" value={startAlt} min={160} max={2000} step={10} onChange={setStartAlt} suffix=" km" />
                                <SliderInput label="Spacecraft Mass (dry)" value={craftMass} min={500} max={20000} step={100} onChange={setCraftMass} suffix=" kg" />
                                <SliderInput label="Fuel Mass" value={fuelMass} min={50} max={10000} step={50} onChange={setFuelMass} suffix=" kg" />
                                <SliderInput label="Engine Isp" value={isp} min={100} max={500} step={10} onChange={setIsp} suffix=" sec" />
                            </div>
                        </div>

                        {/* Pre-flight readout */}
                        <div className="glass" style={{ padding: '20px 24px' }}>
                            <div className="section-label">PRE-FLIGHT READOUT</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '8px' }}>
                                <ReadoutItem icon={<ArrowRight size={14} />} label={<span>Required <GlossaryLink term="Delta-V">Δv</GlossaryLink></span>} value={`${deltaV.toFixed(1)} m/s`} color="var(--coral)" />
                                <ReadoutItem icon={<Fuel size={14} />} label={<span>Max Available <GlossaryLink term="Delta-V">Δv</GlossaryLink></span>} value={`${maxDeltaV.toFixed(1)} m/s`} color={fuelOk ? 'var(--green)' : 'var(--red)'} />
                                <ReadoutItem icon={<Rocket size={14} />} label={<span>Transfer Time</span>} value={`${(transferTime / 60).toFixed(1)} min`} color="var(--gold)" />
                                <ReadoutItem icon={<DollarSign size={14} />} label={<span>Estimated <GlossaryLink term="NRV">NRV</GlossaryLink></span>} value={`$${nrv.toLocaleString('en-US', { maximumFractionDigits: 0 })}`} color={nrv > 0 ? 'var(--gold)' : 'var(--red)'} />
                            </div>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                {fuelOk ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--green)', fontSize: '0.8rem' }}>
                                        <CheckCircle size={16} /> All systems GO
                                    </span>
                                ) : (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--red)', fontSize: '0.8rem' }}>
                                        <AlertTriangle size={16} /> Insufficient fuel — mission will abort
                                    </span>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button className="btn" onClick={() => { setPhase('SELECT'); audio.click() }}>
                                ← Back
                            </button>
                            <button className="btn btn-coral" onClick={runMission} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Rocket size={14} /> Launch Mission
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ── PHASE 3 & 4: Mission Log ── */}
                {(phase === 'RUNNING' || phase === 'COMPLETE') && (
                    <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Log terminal */}
                        <div
                            ref={logRef}
                            style={{
                                background: 'rgba(5,5,5,0.95)',
                                border: '1px solid rgba(64,64,64,0.5)',
                                borderRadius: '12px',
                                padding: '16px',
                                maxHeight: '400px',
                                overflowY: 'auto',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.72rem',
                                lineHeight: 1.8,
                            }}
                        >
                            <div style={{ color: 'var(--gray)', marginBottom: '8px' }}>
                                ┌─ NEXUS MISSION COMPUTER v2.1 ──────────────────
                            </div>
                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                        color: log.status === 'ok' ? 'var(--green)'
                                            : log.status === 'warn' ? 'var(--gold)'
                                                : log.status === 'error' ? 'var(--red)'
                                                    : 'var(--signal)',
                                    }}
                                >
                                    <span style={{ color: 'var(--gray)' }}>[{log.time}]</span> {log.text}
                                </motion.div>
                            ))}
                            {phase === 'RUNNING' && (
                                <motion.span
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.8, repeat: Infinity }}
                                    style={{ color: 'var(--gold)' }}
                                >
                                    █
                                </motion.span>
                            )}
                        </div>

                        {/* Result card */}
                        <AnimatePresence>
                            {phase === 'COMPLETE' && target && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={missionResult === 'success' ? 'glass-warm' : 'glass'}
                                    style={{
                                        padding: '28px', textAlign: 'center',
                                        border: missionResult === 'success' ? '1px solid var(--gold)' : '1px solid var(--red)',
                                    }}
                                >
                                    {missionResult === 'success' ? (
                                        <>
                                            <CheckCircle size={36} color="var(--gold)" style={{ marginBottom: '12px' }} />
                                            <h3 style={{ color: 'var(--gold)', marginBottom: '8px' }}>MISSION SUCCESS</h3>
                                            <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                                                {target.name} has been captured and analyzed.
                                            </p>
                                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: nrv > 0 ? 'var(--gold)' : 'var(--red)' }}>
                                                {nrv > 0 ? '+' : ''}${nrv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                            </div>
                                            <div className="stat-label">
                                                <GlossaryLink term="NRV">NET RESOURCE VALUE</GlossaryLink>
                                            </div>
                                            <div style={{ marginTop: '8px' }}>
                                                <span className={`tag ${nrv > 0 ? 'green' : 'red'}`}>
                                                    {nrv > 0 ? 'PROFITABLE RECOVERY' : 'COST EXCEEDS VALUE'}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <AlertTriangle size={36} color="var(--red)" style={{ marginBottom: '12px' }} />
                                            <h3 style={{ color: 'var(--red)', marginBottom: '8px' }}>MISSION FAILED</h3>
                                            <p style={{ fontSize: '0.85rem', margin: 0 }}>
                                                {fuelOk
                                                    ? `Could not capture ${target.name}. Target tumble rate exceeded safety limits.`
                                                    : `Insufficient fuel to complete the transfer orbit to ${target.name}.`}
                                            </p>
                                        </>
                                    )}

                                    <button
                                        className="btn btn-coral"
                                        onClick={() => { resetMission(); audio.click() }}
                                        style={{ marginTop: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                                    >
                                        <RotateCcw size={14} /> New Mission
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}

                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}

function SliderInput({ label, value, min, max, step, onChange, suffix = '' }: {
    label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void, suffix?: string
}) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="mono" style={{ fontSize: '0.63rem', color: 'rgba(242, 242, 242, 0.7)', letterSpacing: '1px' }}>{label}</label>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--signal)' }}>{value.toLocaleString()}{suffix}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: '4px', borderRadius: '2px',
                    appearance: 'none', background: 'var(--gray-dim)',
                    cursor: 'pointer', outline: 'none', accentColor: 'var(--gold)',
                }}
            />
        </div>
    )
}

function ReadoutItem({ icon, label, value, color }: { icon: React.ReactNode, label: React.ReactNode, value: string, color: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0' }}>
            <div style={{ color }}>{icon}</div>
            <div>
                <div className="stat-label">{label}</div>
                <div className="mono" style={{ fontSize: '0.9rem', fontWeight: 600, color }}>{value}</div>
            </div>
        </div>
    )
}
