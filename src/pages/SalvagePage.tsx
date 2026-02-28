import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, Info } from 'lucide-react'
import { SAMPLE_SATELLITES } from '../lib/sampleData'
import { calcNRV } from '../lib/orbital'
import GlossaryLink from '../components/GlossaryLink'

const stagger = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const METAL_PRICES = {
    aluminum: 2.65,
    titanium: 11.50,
    gold: 62000,
    copper: 9.80,
}

const MATERIAL_INFO = [
    { name: 'Aluminum', pct: 0.6, price: 2.65, unit: '$/kg', color: 'var(--signal)', desc: 'Structural frames, solar panel substrates — the bulk of any satellite.' },
    { name: 'Titanium', pct: 0.25, price: 11.50, unit: '$/kg', color: 'var(--coral)', desc: 'Engine bells, thrusters, high-stress structural parts.' },
    { name: 'Gold', pct: 0.08, price: 62000, unit: '$/kg', color: 'var(--gold)', desc: 'Thermal insulation, connectors, radiation-hardened electronics.' },
    { name: 'Copper', pct: 0.07, price: 9.80, unit: '$/kg', color: 'var(--green)', desc: 'Power wiring, antenna feeds, telecom waveguides.' },
]

export default function SalvagePage() {
    const [mass, setMass] = useState(5000)
    const [flightDays, setFlightDays] = useState(3)
    const [deltaV, setDeltaV] = useState(1200)

    // Live NRV calculation using orbital.ts
    const nrv = useMemo(() => calcNRV({
        dryMassKg: mass,
        materialProfile: { aluminum: 0.6, titanium: 0.25, gold: 0.08, copper: 0.07 },
        prices: METAL_PRICES,
        deltaVMs: deltaV,
        flightDays,
    }), [mass, flightDays, deltaV])

    // Break down so user can see the math
    const materialValue = useMemo(() =>
        mass * 0.6 * 2.65 + mass * 0.25 * 11.50 + mass * 0.08 * 62000 + mass * 0.07 * 9.80
        , [mass])
    const fuelCost = deltaV * 1200
    const overheadCost = flightDays * 4500

    return (
        <div className="page-section" style={{ paddingTop: '100px' }}>
            <motion.div
                className="section-inner"
                variants={stagger}
                initial="hidden"
                animate="show"
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
            >
                {/* Header */}
                <motion.div variants={fadeUp} style={{ textAlign: 'center' }}>
                    <div className="section-label" style={{ textAlign: 'center' }}>SALVAGE OPERATIONS</div>
                    <h2>Can We <span className="gradient-text">Profit</span> From Space Junk?</h2>
                    <p style={{ maxWidth: '650px', margin: '12px auto 0', fontSize: '0.95rem' }}>
                        Every satellite in orbit is made of valuable metals already past the $20,000/kg launch barrier.
                        But is it worth going up to get them? Use the calculator below to find out.
                    </p>
                </motion.div>

                {/* What's in a satellite */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">WHAT'S INSIDE A SATELLITE?</div>
                    <p style={{ fontSize: '0.85rem', marginBottom: '16px', opacity: 0.7 }}>
                        Satellites are built from high-value metals. Here's the typical breakdown and what each material is worth:
                    </p>
                    <div className="card-grid">
                        {MATERIAL_INFO.map(mat => (
                            <div key={mat.name} className="glass info-card">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1rem', color: mat.color }}>{mat.name}</h3>
                                    <span className="tag" style={{ color: mat.color, borderColor: mat.color }}>{(mat.pct * 100).toFixed(0)}%</span>
                                </div>
                                <p style={{ fontSize: '0.8rem', margin: 0 }}>{mat.desc}</p>
                                <div className="mono" style={{ fontSize: '0.75rem', color: mat.color }}>
                                    Market price: ${mat.price.toLocaleString()}{mat.unit.replace('$', '')}/kg
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* NRV Calculator */}
                <motion.div variants={fadeUp} className="glass-warm" style={{ padding: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <DollarSign size={18} color="var(--gold)" />
                        <div className="section-label" style={{ marginBottom: 0 }}>NET RESOURCE VALUE (NRV) CALCULATOR</div>
                    </div>

                    {/* Explain the formula */}
                    <div className="glass" style={{ padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <Info size={16} color="var(--coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div>
                            <p style={{ fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>
                                <strong>How it works:</strong> <GlossaryLink term="NRV">NRV</GlossaryLink> tells you if recovering a piece of space debris is profitable.
                                We take the <span style={{ color: 'var(--green)' }}>total value of metals inside</span>, then subtract
                                the <span style={{ color: 'var(--red)' }}>fuel cost</span> (based on how much velocity change is needed)
                                and <span style={{ color: 'var(--red)' }}>daily mission overhead</span>.
                            </p>
                            <p className="mono" style={{ fontSize: '0.7rem', marginTop: '8px', color: 'var(--gold)' }}>
                                <GlossaryLink term="NRV">NRV</GlossaryLink> = (Material Value) − (ΔV × $1,200/m·s⁻¹) − (Days × $4,500/day)
                            </p>
                        </div>
                    </div>

                    {/* Sliders */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <SliderInput label="Satellite Mass" value={mass} min={100} max={50000} step={100} onChange={setMass} suffix=" kg" />
                        <SliderInput label="Delta-V Required" value={deltaV} min={100} max={5000} step={50} onChange={setDeltaV} suffix=" m/s" />
                        <SliderInput label="Mission Duration" value={flightDays} min={1} max={30} step={1} onChange={setFlightDays} suffix=" days" />
                    </div>

                    {/* Show the math */}
                    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="math-row">
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>Metal value ({mass.toLocaleString()} kg of mixed metals)</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--green)' }}>+${materialValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="math-row">
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>Fuel cost ({deltaV.toLocaleString()} m/s × $1,200)</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--red)' }}>−${fuelCost.toLocaleString()}</span>
                        </div>
                        <div className="math-row">
                            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>Overhead ({flightDays} days × $4,500)</span>
                            <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--red)' }}>−${overheadCost.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', alignItems: 'center' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Net Resource Value</span>
                            <span style={{
                                fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700,
                                color: nrv > 0 ? 'var(--gold)' : 'var(--red)',
                            }}>
                                {nrv > 0 ? '+' : ''}${nrv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span className={`tag ${nrv > 0 ? 'green' : 'red'}`}>
                                {nrv > 0 ? '✓ MISSION PROFITABLE' : '✗ NOT WORTH RECOVERING'}
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* Real satellite examples */}
                <motion.div variants={fadeUp}>
                    <div className="section-label">REAL SATELLITE EXAMPLES</div>
                    <p style={{ fontSize: '0.82rem', marginBottom: '12px', opacity: 0.7 }}>
                        Here are real-world satellites with their estimated NRV. Green = profitable to recover, Red = costs more than it's worth.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {SAMPLE_SATELLITES.map(sat => {
                            const satNrv = calcNRV({
                                dryMassKg: sat.dryMassKg,
                                materialProfile: sat.materialProfile,
                                prices: METAL_PRICES,
                                deltaVMs: 1200,
                                flightDays: 3,
                            })
                            return (
                                <div key={sat.id} className="glass" style={{
                                    padding: '14px 20px',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    gap: '16px', flexWrap: 'wrap',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '200px' }}>
                                        <span style={{
                                            width: '8px', height: '8px', borderRadius: '50%',
                                            background: satNrv > 0 ? 'var(--green)' : 'var(--red)',
                                        }} />
                                        <div>
                                            <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{sat.name}</div>
                                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>
                                                {sat.altitudeKm.toLocaleString()} km · {sat.dryMassKg.toLocaleString()} kg · {sat.objectType}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span className="mono" style={{
                                            fontSize: '0.9rem', fontWeight: 600,
                                            color: satNrv > 0 ? 'var(--gold)' : 'var(--red)',
                                        }}>
                                            {satNrv > 0 ? '+' : ''}${satNrv.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                        </span>
                                        <span className={`tag ${satNrv > 0 ? 'green' : 'red'}`} style={{ fontSize: '0.5rem' }}>
                                            {satNrv > 0 ? 'VIABLE' : 'NOT VIABLE'}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
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
                <label className="mono" style={{ fontSize: '0.65rem', color: 'rgba(242, 242, 242, 0.7)', letterSpacing: '1px' }}>{label}</label>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--signal)' }}>{value.toLocaleString()}{suffix}</span>
            </div>
            <input
                type="range" min={min} max={max} step={step} value={value}
                onChange={e => onChange(Number(e.target.value))}
                style={{
                    width: '100%', height: '4px', borderRadius: '2px',
                    appearance: 'none', background: 'var(--gray-dim)',
                    cursor: 'pointer', outline: 'none',
                    accentColor: 'var(--gold)',
                }}
            />
        </div>
    )
}
