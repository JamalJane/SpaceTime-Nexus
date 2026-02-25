import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Gauge, Fuel, Info } from 'lucide-react'
import { estimateDeltaV, tsiolkovskyFuelCheck } from '../lib/orbital'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function InterceptPage() {
    // ── Delta-V Calculator state ──
    const [currentAlt, setCurrentAlt] = useState(400)
    const [targetAlt, setTargetAlt] = useState(800)

    // ── Fuel Check state ──
    const [craftMass, setCraftMass] = useState(2000)
    const [fuelMass, setFuelMass] = useState(500)
    const [isp, setIsp] = useState(320)

    // Live computation from orbital.ts
    const deltaV = useMemo(() => estimateDeltaV(currentAlt, targetAlt), [currentAlt, targetAlt])

    const fuelOk = useMemo(() => tsiolkovskyFuelCheck({
        deltaVMs: deltaV,
        crafMassKg: craftMass,
        fuelMassKg: fuelMass,
        ispSeconds: isp,
    }), [deltaV, craftMass, fuelMass, isp])

    // Show the math for the fuel check
    const G0 = 9.80665
    const mInitial = craftMass + fuelMass
    const maxDeltaV = isp * G0 * Math.log(mInitial / craftMass)

    // Transfer orbit period
    const MU = 3.986e14
    const r1 = (6371 + currentAlt) * 1000
    const r2 = (6371 + targetAlt) * 1000
    const aTransfer = (r1 + r2) / 2
    const transferTime = Math.PI * Math.sqrt(aTransfer ** 3 / MU) // half orbit in seconds
    const transferMinutes = (transferTime / 60).toFixed(1)

    return (
        <div className="page-section" style={{ paddingTop: '100px' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '900px', margin: '0 auto' }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>INTERCEPT PLANNER</div>
                    <h2>How Do You <span className="gradient-text">Reach</span> Something in Orbit?</h2>
                    <p style={{ maxWidth: '650px', margin: '12px auto 0', fontSize: '0.95rem' }}>
                        To move between orbits you need to change your velocity — that's called <strong>Delta-V (Δv)</strong>.
                        The tools below calculate exactly how much you need and whether your spacecraft has enough fuel.
                    </p>
                </motion.div>

                {/* What is a Hohmann Transfer? */}
                <motion.div variants={fadeUp} className="glass" style={{ padding: '24px 28px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <Info size={18} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>What is a Hohmann Transfer?</h3>
                            <p style={{ fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>
                                The most fuel-efficient way to move between two circular orbits. You fire your engines <strong>twice</strong>:
                            </p>
                            <ol style={{ fontSize: '0.85rem', lineHeight: 1.8, paddingLeft: '20px', marginTop: '8px' }}>
                                <li><strong>First burn</strong> — speeds you up to enter an elliptical transfer orbit</li>
                                <li><strong>Coast</strong> — you drift along the ellipse (no fuel needed)</li>
                                <li><strong>Second burn</strong> — circularizes your orbit at the target altitude</li>
                            </ol>
                            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '8px', color: 'var(--gold)' }}>
                                Total Δv = |v_transfer₁ − v_circular₁| + |v_circular₂ − v_transfer₂|
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Delta-V Calculator */}
                <motion.div variants={fadeUp} className="glass-warm" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <ArrowUpRight size={18} color="var(--coral)" />
                        <div className="section-label" style={{ marginBottom: 0 }}>DELTA-V CALCULATOR</div>
                    </div>

                    <p style={{ fontSize: '0.82rem', marginBottom: '20px', opacity: 0.7 }}>
                        Drag the sliders to set your starting orbit and target orbit. The calculator computes the exact Delta-V needed for a Hohmann transfer.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <SliderInput label="Starting Altitude" value={currentAlt} min={160} max={2000} step={10} onChange={setCurrentAlt} suffix=" km" />
                        <SliderInput label="Target Altitude" value={targetAlt} min={160} max={36000} step={50} onChange={setTargetAlt} suffix=" km" />
                    </div>

                    {/* Results */}
                    <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', textAlign: 'center' }}>
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                            <div className="stat-label">DELTA-V REQUIRED</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--coral)', marginTop: '4px' }}>
                                {deltaV.toFixed(1)}
                            </div>
                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>meters/second</div>
                        </div>
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                            <div className="stat-label">ALTITUDE CHANGE</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)', marginTop: '4px' }}>
                                {Math.abs(targetAlt - currentAlt).toLocaleString()}
                            </div>
                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>km {targetAlt > currentAlt ? 'higher' : 'lower'}</div>
                        </div>
                        <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
                            <div className="stat-label">TRANSFER TIME</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--green)', marginTop: '4px' }}>
                                {transferMinutes}
                            </div>
                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>minutes (coast)</div>
                        </div>
                    </div>
                </motion.div>

                {/* Fuel Check */}
                <motion.div variants={fadeUp} className="glass-warm" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <Fuel size={18} color="var(--gold)" />
                        <div className="section-label" style={{ marginBottom: 0 }}>DO I HAVE ENOUGH FUEL?</div>
                    </div>

                    {/* Explain */}
                    <div className="glass" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <Info size={16} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                                The <strong>Tsiolkovsky Rocket Equation</strong> tells us the maximum velocity change a spacecraft can achieve
                                based on its fuel, dry mass, and engine efficiency (Isp). If your max Δv ≥ the required Δv, the mission is a go.
                            </p>
                            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '8px', color: 'var(--gold)' }}>
                                Max Δv = Isp × 9.81 × ln(mass_wet / mass_dry)
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <SliderInput label="Spacecraft Mass (dry)" value={craftMass} min={500} max={20000} step={100} onChange={setCraftMass} suffix=" kg" />
                        <SliderInput label="Fuel Mass" value={fuelMass} min={50} max={10000} step={50} onChange={setFuelMass} suffix=" kg" />
                        <SliderInput label="Engine Isp" value={isp} min={100} max={500} step={10} onChange={setIsp} suffix=" sec" />
                    </div>

                    {/* Fuel math breakdown */}
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(64,64,64,0.3)' }}>
                            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>Wet mass (craft + fuel)</span>
                            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--signal)' }}>{mInitial.toLocaleString()} kg</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(64,64,64,0.3)' }}>
                            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>Max Δv your fuel provides</span>
                            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--green)' }}>{maxDeltaV.toFixed(1)} m/s</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(64,64,64,0.3)' }}>
                            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>Δv needed for this transfer</span>
                            <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--coral)' }}>{deltaV.toFixed(1)} m/s</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', alignItems: 'center' }}>
                            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--gray)' }}>Fuel margin</span>
                            <span className="mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: fuelOk ? 'var(--green)' : 'var(--red)' }}>
                                {fuelOk ? '+' : ''}{(maxDeltaV - deltaV).toFixed(1)} m/s
                            </span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <Gauge size={20} color={fuelOk ? 'var(--green)' : 'var(--red)'} />
                            <span className={`tag ${fuelOk ? 'green' : 'red'}`} style={{ fontSize: '0.7rem' }}>
                                {fuelOk ? '✓ GO FOR BURN — FUEL SUFFICIENT' : '✗ NO GO — NEED MORE FUEL OR LIGHTER CRAFT'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Reference */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">COMMON ORBITAL TRANSFERS</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '12px' }}>
                        {[
                            { from: 'ISS (400 km)', to: 'Hubble (547 km)', dv: estimateDeltaV(400, 547).toFixed(1), note: 'Short hop — Space Shuttle could do this' },
                            { from: 'LEO (400 km)', to: 'GPS (20,200 km)', dv: estimateDeltaV(400, 20200).toFixed(1), note: 'Major transfer — needs a big upper stage' },
                            { from: 'LEO (400 km)', to: 'GEO (35,786 km)', dv: estimateDeltaV(400, 35786).toFixed(1), note: 'The classic GTO — most commsats go here' },
                        ].map(ex => (
                            <div key={ex.to} className="glass info-card">
                                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--gray)' }}>{ex.from} → {ex.to}</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--coral)' }}>
                                    {ex.dv} m/s
                                </div>
                                <p style={{ fontSize: '0.75rem', margin: 0, opacity: 0.7 }}>{ex.note}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <div style={{ height: '80px' }} />
            </motion.div>
        </div>
    )
}

function SliderInput({ label, value, min, max, step, onChange, suffix = '' }: {
    label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; suffix?: string
}) {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label className="mono" style={{ fontSize: '0.63rem', color: 'var(--gray)', letterSpacing: '1px' }}>{label}</label>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--signal)' }}>{value.toLocaleString()}{suffix}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: '4px', borderRadius: '2px',
                    appearance: 'none', background: 'var(--gray-dim)',
                    cursor: 'pointer', outline: 'none',
                    accentColor: 'var(--coral)',
                }}
            />
        </div>
    )
}
