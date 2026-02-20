import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, BookOpen, DollarSign, Target, Star, FileText } from 'lucide-react'
import { useNavStore, type Page } from '../store'
import { audio } from '../lib/audio'
import type { ReactNode } from 'react'

interface NavItem {
    id: Page
    label: string
    icon: ReactNode
    description: string
}

const NAV_ITEMS: NavItem[] = [
    { id: 'GRAVEYARD', label: 'GRAVEYARD', icon: <Globe size={14} />, description: 'Global debris field — 3D orbit view' },
    { id: 'SALVAGE_OPS', label: 'SALVAGE', icon: <DollarSign size={14} />, description: 'Bounty engine & NRV calculator' },
    { id: 'INTERCEPT_PLANNER', label: 'INTERCEPT', icon: <Target size={14} />, description: 'Lambert solver & transfer planner' },
    { id: 'STAR_LOCK', label: 'STAR-LOCK', icon: <Star size={14} />, description: 'AI celestial navigation terminal' },
    { id: 'RECOVERY_LEDGER', label: 'LEDGER', icon: <FileText size={14} />, description: 'Mission recovery & stats' },
]

export default function CardNav() {
    const { page, setPage } = useNavStore()
    const [hovered, setHovered] = useState<Page | null>(null)
    const [expanded, setExpanded] = useState<Page | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleClick = (id: Page) => {
        if (page === id) return
        audio.click()
        setExpanded(expanded === id ? null : id)
        setPage(id)
    }

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                bottom: 'var(--hud-margin)',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 30,
                display: 'flex',
                gap: '10px',
                padding: '8px 12px',
                background: 'rgba(13,13,13,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--gray)',
                borderRadius: '40px',
                pointerEvents: 'all',
            }}
        >
            {NAV_ITEMS.map((item) => {
                const isActive = page === item.id
                const isHovered = hovered === item.id

                return (
                    <div key={item.id} style={{ position: 'relative' }}>
                        {/* Tooltip */}
                        <AnimatePresence>
                            {isHovered && !isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 6 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                        position: 'absolute',
                                        bottom: 'calc(100% + 10px)',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        whiteSpace: 'nowrap',
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.6rem',
                                        letterSpacing: '1.5px',
                                        color: 'var(--gray)',
                                        textTransform: 'uppercase',
                                        padding: '4px 8px',
                                        background: 'var(--void)',
                                        border: '1px solid var(--gray)',
                                        borderRadius: '2px',
                                    }}
                                >
                                    {item.description}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* SVG Border Draw on hover */}
                        <div style={{ position: 'relative' }}>
                            {isHovered && (
                                <motion.svg
                                    style={{
                                        position: 'absolute', inset: -2, width: 'calc(100% + 4px)', height: 'calc(100% + 4px)',
                                        overflow: 'visible', pointerEvents: 'none',
                                    }}
                                    viewBox="0 0 100 36"
                                    preserveAspectRatio="none"
                                >
                                    <motion.rect
                                        x="1" y="1" width="98" height="34" rx="20"
                                        fill="none"
                                        stroke="#FFD700"
                                        strokeWidth="1.5"
                                        initial={{ pathLength: 0, opacity: 0 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </motion.svg>
                            )}

                            <motion.button
                                onClick={() => handleClick(item.id)}
                                onHoverStart={() => {
                                    setHovered(item.id)
                                    audio.hover()
                                }}
                                onHoverEnd={() => setHovered(null)}
                                whileTap={{ scale: 0.94 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 14px',
                                    border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                                    borderRadius: '20px',
                                    background: isActive ? 'rgba(255,215,0,0.08)' : 'transparent',
                                    color: isActive ? 'var(--gold)' : 'var(--signal)',
                                    fontFamily: 'var(--font-ui)',
                                    fontSize: '0.68rem',
                                    fontWeight: 600,
                                    letterSpacing: '1.5px',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    boxShadow: isActive ? '0 0 12px rgba(255,215,0,0.25)' : 'none',
                                    position: 'relative',
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </motion.button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
