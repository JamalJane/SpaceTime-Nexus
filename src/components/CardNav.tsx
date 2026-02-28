import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, BookOpen, Pickaxe, Rocket, Compass, Crosshair, Menu, X } from 'lucide-react'
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
    { id: 'HOME', label: 'HOME', icon: <Globe size={14} />, description: 'Welcome — explore the cosmos' },
    { id: 'GRAVEYARD', label: 'GRAVEYARD', icon: <Compass size={14} />, description: 'Space debris field statistics' },
    { id: 'MISSION_PROFILE', label: 'MISSION', icon: <BookOpen size={14} />, description: 'Knowledge base & glossary' },
    { id: 'SALVAGE', label: 'SALVAGE', icon: <Pickaxe size={14} />, description: 'Orbital resource recovery' },
    { id: 'INTERCEPT', label: 'INTERCEPT', icon: <Rocket size={14} />, description: 'Orbital transfer planner' },
    { id: 'STAR_LOCK', label: 'STAR-LOCK', icon: <Compass size={14} />, description: 'Celestial navigation & impact' },
    { id: 'SIMULATION', label: 'SIMULATE', icon: <Crosshair size={14} />, description: 'Run a satellite recovery mission' },
]

export default function CardNav() {
    const { page, setPage } = useNavStore()
    const [hovered, setHovered] = useState<Page | null>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleClick = (id: Page) => {
        if (page === id) return
        audio.click()
        setPage(id)
        setMobileOpen(false)
    }

    return (
        <>
            {/* Mobile toggle (FAB) — shown on ≤480px via CSS */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="mobile-nav-toggle"
                style={{
                    position: 'fixed',
                    bottom: 'var(--hud-margin)',
                    right: 'var(--hud-margin)',
                    zIndex: 35,
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px solid var(--gold)',
                    background: 'rgba(13,13,13,0.9)',
                    color: 'var(--gold)',
                    cursor: 'pointer',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            {/* Mobile slide-up drawer — shown on ≤480px when open */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}
                        style={{
                            position: 'fixed',
                            bottom: '68px',
                            left: 'var(--hud-margin)',
                            right: 'var(--hud-margin)',
                            zIndex: 34,
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '12px',
                            background: 'rgba(13,13,13,0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(64,64,64,0.5)',
                            borderRadius: '16px',
                            pointerEvents: 'all',
                        }}
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = page === item.id

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                                        borderRadius: '12px',
                                        background: isActive ? 'rgba(255,215,0,0.08)' : 'transparent',
                                        color: isActive ? 'var(--gold)' : 'var(--signal)',
                                        fontFamily: 'var(--font-ui)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        letterSpacing: '1.2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        width: '100%',
                                    }}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    <span style={{
                                        marginLeft: 'auto',
                                        fontSize: '0.55rem',
                                        color: 'var(--gray)',
                                        fontWeight: 400,
                                        letterSpacing: '0.5px',
                                    }}>
                                        {item.description}
                                    </span>
                                </button>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop/Tablet nav bar — uses .card-nav-bar CSS class */}
            <div className="card-nav-bar">
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
                                            fontSize: '0.55rem',
                                            letterSpacing: '1.5px',
                                            color: 'var(--gray)',
                                            textTransform: 'uppercase',
                                            padding: '5px 10px',
                                            background: 'rgba(5,5,5,0.95)',
                                            border: '1px solid var(--gray)',
                                            borderRadius: '6px',
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
                                        gap: '5px',
                                        padding: '7px 10px',
                                        border: isActive ? '1px solid var(--gold)' : '1px solid transparent',
                                        borderRadius: '20px',
                                        background: isActive ? 'rgba(255,215,0,0.08)' : 'transparent',
                                        color: isActive ? 'var(--gold)' : 'var(--signal)',
                                        fontFamily: 'var(--font-ui)',
                                        fontSize: '0.58rem',
                                        fontWeight: 600,
                                        letterSpacing: '1.2px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: isActive ? '0 0 12px rgba(255,215,0,0.25)' : 'none',
                                        position: 'relative',
                                    }}
                                >
                                    {item.icon}
                                    <span className="card-nav-label">{item.label}</span>
                                </motion.button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
