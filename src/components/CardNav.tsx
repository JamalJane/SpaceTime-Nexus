import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Globe, BookOpen, Pickaxe, Rocket, Compass, Crosshair, Menu, X } from 'lucide-react'
import { useNavStore, type Page } from '../store'
import { audio } from '../lib/audio'
import type { LucideIcon } from 'lucide-react'

interface NavItem {
    id: Page
    label: string
    icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
    { id: 'HOME', label: 'Home', icon: Globe },
    { id: 'GRAVEYARD', label: 'Graveyard', icon: Compass },
    { id: 'MISSION_PROFILE', label: 'Mission', icon: BookOpen },
    { id: 'SALVAGE', label: 'Salvage', icon: Pickaxe },
    { id: 'INTERCEPT', label: 'Intercept', icon: Rocket },
    { id: 'STAR_LOCK', label: 'Star-Lock', icon: Compass },
    { id: 'SIMULATION', label: 'Simulate', icon: Crosshair },
]

// Spring transition for expandable tabs
const springTransition = { delay: 0.05, type: 'spring' as const, bounce: 0, duration: 0.5 }

const buttonVariants = {
    initial: { gap: 0, paddingLeft: '0.5rem', paddingRight: '0.5rem' },
    animate: (isActive: boolean) => ({
        gap: isActive ? '0.4rem' : 0,
        paddingLeft: isActive ? '0.75rem' : '0.5rem',
        paddingRight: isActive ? '0.75rem' : '0.5rem',
    }),
}

const labelVariants = {
    initial: { width: 0, opacity: 0 },
    animate: { width: 'auto', opacity: 1 },
    exit: { width: 0, opacity: 0 },
}

export default function CardNav() {
    const { page, setPage } = useNavStore()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 480)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

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
                    width: '44px',
                    height: '44px',
                    borderRadius: '4px',
                    border: '1px solid #222',
                    background: '#0a0a0a',
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
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 60 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={`mobile-nav-drawer ${mobileOpen ? 'open' : ''}`}
                        style={{
                            position: 'fixed',
                            bottom: '68px',
                            left: 'var(--hud-margin)',
                            right: 'var(--hud-margin)',
                            zIndex: 34,
                            flexDirection: 'column',
                            gap: '2px',
                            padding: '8px',
                            background: '#0a0a0a',
                            border: '1px solid #1a1a1a',
                            borderRadius: '6px',
                            pointerEvents: 'all',
                        }}
                    >
                        {NAV_ITEMS.map((item) => {
                            const isActive = page === item.id
                            const Icon = item.icon
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => handleClick(item.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px 14px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        background: isActive ? 'rgba(255,215,0,0.06)' : 'transparent',
                                        color: isActive ? 'var(--gold)' : '#888',
                                        fontFamily: 'var(--font-ui)',
                                        fontSize: '0.72rem',
                                        fontWeight: 600,
                                        letterSpacing: '1px',
                                        textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s',
                                        width: '100%',
                                    }}
                                >
                                    <Icon size={16} strokeWidth={2} />
                                    <span>{item.label}</span>
                                </button>
                            )
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop/Tablet: Combined tubelight + expandable tabs nav */}
            <div className="card-nav-bar">
                <div className="card-nav-inner">
                    {NAV_ITEMS.map((item) => {
                        const isActive = page === item.id
                        const Icon = item.icon

                        return (
                            <motion.button
                                key={item.id}
                                variants={buttonVariants}
                                initial={false}
                                animate="animate"
                                custom={isActive}
                                onClick={() => handleClick(item.id)}
                                transition={springTransition}
                                className={`card-nav-btn ${isActive ? 'active' : ''}`}
                            >
                                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                                <AnimatePresence initial={false}>
                                    {isActive && (
                                        <motion.span
                                            variants={labelVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            transition={springTransition}
                                            className="card-nav-expanded-label"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {/* Tubelight glow */}
                                {isActive && (
                                    <motion.div
                                        layoutId="tubelight"
                                        className="card-nav-glow"
                                        initial={false}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    >
                                        <div className="card-nav-glow-bar" />
                                        <div className="card-nav-glow-blur" />
                                    </motion.div>
                                )}
                            </motion.button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
