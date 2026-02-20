import { motion } from 'framer-motion'
import { useTargetStore } from '../store'
import { SAMPLE_SATELLITES } from '../lib/sampleData'

export default function GraveyardPage() {
    const { selectedTarget, setTarget } = useTargetStore()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'fixed',
                left: 'var(--hud-margin)',
                top: '80px',
                bottom: '80px',
                width: '260px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 20,
                overflowY: 'auto',
                pointerEvents: 'all',
            }}
        >
            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)', letterSpacing: '3px', marginBottom: '8px' }}>
                TRACKED OBJECTS — SELECT TARGET
            </div>

            {SAMPLE_SATELLITES.map((sat, i) => {
                const isSelected = selectedTarget?.id === sat.id
                return (
                    <motion.div
                        key={sat.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setTarget(isSelected ? null : sat)}
                        className="glass"
                        style={{
                            padding: '10px 14px',
                            cursor: 'pointer',
                            borderColor: isSelected ? 'var(--gold)' : 'var(--gray)',
                            boxShadow: isSelected ? '0 0 12px rgba(255,215,0,0.2)' : 'none',
                            transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{
                                fontSize: '0.7rem', fontWeight: 600,
                                letterSpacing: '0.5px',
                                color: isSelected ? 'var(--gold)' : 'var(--signal)',
                                maxWidth: '160px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}>
                                {sat.name}
                            </span>
                            <span className={`tag ${sat.decayStatus ? 'red' : sat.objectType === 'DEBRIS' ? 'gray' : 'green'}`} style={{ fontSize: '0.55rem' }}>
                                {sat.decayStatus ? '⚠ DECAY' : sat.objectType}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '5px' }}>
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>
                                ALT: <span style={{ color: 'var(--signal)' }}>{sat.altitudeKm.toLocaleString()} km</span>
                            </span>
                            <span className="mono" style={{ fontSize: '0.6rem', color: 'var(--gray)' }}>
                                {sat.dryMassKg.toLocaleString()} kg
                            </span>
                        </div>
                    </motion.div>
                )
            })}

            <div className="mono" style={{ fontSize: '0.55rem', color: 'var(--gray)', textAlign: 'center', marginTop: '8px', letterSpacing: '1px' }}>
                DEMO MODE — 6 / 27,000+ OBJECTS
            </div>
        </motion.div>
    )
}
