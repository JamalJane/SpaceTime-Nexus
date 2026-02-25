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
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                style={{
                    position: 'fixed',
                    bottom: 'var(--hud-margin)',
                    right: 'var(--hud-margin)',
                    zIndex: 35,
                    display: 'none',
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
                className="mobile-nav-toggle"
            >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>

            <div
                style={{
                    position: 'fixed',
                    bottom: 'var(--hud-margin)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 30,
                    display: 'flex',
                    gap: '4px',
                    padding: '8px 12px',
                    background: 'rgba(13,13,13,0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(64,64,64,0.5)',
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
                                    {item.label}
                                </motion.button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </>
    )
}
