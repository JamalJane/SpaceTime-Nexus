import { useState, useEffect } from 'react'

const FONT_MONO = '"IBM Plex Mono", "JetBrains Mono", monospace'
const YELLOW_400 = '#FACC15'
const YELLOW_600 = '#CA8A04'

interface MissionOverlayProps {
    logs: string[]
    started: boolean
    finished: boolean
    onStart: () => void
    onEnterNexus: () => void
    onMission: () => void
}

export default function MissionOverlay({
    logs,
    started,
    finished,
    onStart,
    onEnterNexus,
    onMission,
}: MissionOverlayProps) {
    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
                pointerEvents: 'none',
                fontFamily: FONT_MONO,
            }}
        >
            {/* ── Top-left: NEXUS branding ── */}
            <div
                style={{
                    position: 'absolute',
                    top: 24,
                    left: 28,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                }}
            >
                <span
                    className="hud-pulse"
                    style={{ fontSize: 9, color: YELLOW_400 }}
                >
                    ●
                </span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase' as const,
                        color: YELLOW_400,
                    }}
                >
                    NEXUS COMMAND
                </span>
                <span
                    style={{
                        fontSize: 9,
                        color: YELLOW_600,
                        opacity: 0.6,
                    }}
                >
                    / OPS-FEED-01
                </span>
            </div>

            {/* ── Top-right: mission ID ── */}
            <div
                style={{
                    position: 'absolute',
                    top: 24,
                    right: 28,
                    textAlign: 'right' as const,
                    color: YELLOW_600,
                    fontSize: 9,
                    opacity: 0.55,
                    lineHeight: 1.8,
                }}
            >
                <div>MISSION: STN-2025-094</div>
                <div>EPOCH: 2025-312.4471 UTC</div>
                <div>STATUS: {finished ? 'COMPLETE' : started ? 'ACTIVE' : 'STANDBY'}</div>
            </div>

            {/* ── Center-left: live log feed ── */}
            <div
                style={{
                    position: 'absolute',
                    left: 28,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: 4,
                }}
            >
                {logs.map((line, i) => (
                    <LogLine key={i} text={line} />
                ))}
            </div>

            {/* ── Bottom-right: static telemetry HUD ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 32,
                    right: 28,
                    textAlign: 'right' as const,
                    color: YELLOW_600,
                    fontSize: 9,
                    opacity: 0.5,
                    lineHeight: 2,
                }}
            >
                <div>ALT: 412 km LEO</div>
                <div>INC: 51.6°</div>
                <div>ΔV BUDGET: 0.34 km/s</div>
                <div>RADAR XSECT: 0.8 m²</div>
                <div>DRAG COEFF: 2.23</div>
            </div>

            {/* ── Bottom-left: scan line indicator ── */}
            <div
                style={{
                    position: 'absolute',
                    bottom: 32,
                    left: 28,
                    color: YELLOW_600,
                    fontSize: 9,
                    opacity: 0.45,
                }}
            >
                <div>LIDAR: ACTIVE</div>
                <div>RF LINK: 437.525 MHz</div>
                <div>PING: 1.37ms</div>
            </div>

            {/* ── Corner brackets — frame effect ── */}
            <CornerBrackets />

            {/* ── Start Salvage Button ── */}
            {!started && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'auto',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column' as const,
                            alignItems: 'center',
                            gap: 24,
                        }}
                    >
                        <div
                            style={{
                                color: YELLOW_400,
                                letterSpacing: '0.5em',
                                textTransform: 'uppercase' as const,
                                textAlign: 'center' as const,
                                fontSize: 11,
                                opacity: 0.7,
                            }}
                        >
                            DEBRIS RECOVERY SYSTEM ONLINE
                        </div>
                        <button
                            onClick={onStart}
                            style={{
                                fontFamily: FONT_MONO,
                                fontSize: 12,
                                fontWeight: 700,
                                letterSpacing: '0.25em',
                                textTransform: 'uppercase' as const,
                                border: `1px solid ${YELLOW_400}`,
                                color: YELLOW_400,
                                background: 'transparent',
                                padding: '12px 40px',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                pointerEvents: 'auto',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = YELLOW_400
                                e.currentTarget.style.color = '#000'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent'
                                e.currentTarget.style.color = YELLOW_400
                            }}
                        >
                            INITIATE SALVAGE
                        </button>
                        <div
                            style={{
                                color: YELLOW_600,
                                textAlign: 'center' as const,
                                fontSize: 9,
                                opacity: 0.4,
                                maxWidth: 280,
                                lineHeight: 1.8,
                            }}
                        >
                            AUTONOMOUS INTERCEPT PROTOCOL v4.2
                            <br />
                            LOW-EARTH ORBIT CLEARANCE INITIATIVE
                        </div>
                    </div>
                </div>
            )}

            {/* ── Completion CTA ── */}
            {finished && <CompletionCTA onEnterNexus={onEnterNexus} onMission={onMission} />}
        </div>
    )
}

// ── Typewriter log line ──────────────────────────────
function LogLine({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState('')

    useEffect(() => {
        let i = 0
        const interval = setInterval(() => {
            setDisplayed(text.slice(0, i + 1))
            i++
            if (i >= text.length) clearInterval(interval)
        }, 28)
        return () => clearInterval(interval)
    }, [text])

    return (
        <div
            style={{
                color: YELLOW_400,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 11,
                opacity: 0.9,
                letterSpacing: '0.1em',
            }}
        >
            <span style={{ color: YELLOW_600, opacity: 0.6 }}>{'>'}</span>
            <span>{displayed}</span>
            {displayed.length < text.length && (
                <span className="hud-pulse" style={{ color: YELLOW_400 }}>_</span>
            )}
        </div>
    )
}

// ── Corner bracket decorators ────────────────────────
function CornerBrackets() {
    const lineColor = YELLOW_400

    const Corner = ({
        top,
        left,
        right,
        bottom,
        flipX,
    }: {
        top?: number
        left?: number
        right?: number
        bottom?: number
        flipX?: boolean
        flipY?: boolean
    }) => (
        <div
            style={{
                position: 'absolute',
                width: 20,
                height: 20,
                opacity: 0.3,
                top,
                left,
                right,
                bottom,
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    background: lineColor,
                    top: 0,
                    left: flipX ? undefined : 0,
                    right: flipX ? 0 : undefined,
                    width: 2,
                    height: 14,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    background: lineColor,
                    top: 0,
                    left: flipX ? undefined : 0,
                    right: flipX ? 0 : undefined,
                    width: 14,
                    height: 2,
                }}
            />
        </div>
    )

    return (
        <>
            <Corner top={16} left={16} />
            <Corner top={16} right={16} flipX />
            <Corner bottom={16} left={16} />
            <Corner bottom={16} right={16} flipX />
        </>
    )
}

// ── Completion CTA ───────────────────────────────────
function CompletionCTA({ onEnterNexus, onMission }: { onEnterNexus: () => void; onMission: () => void }) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 400)
        return () => clearTimeout(t)
    }, [])

    return (
        <div
            style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: visible ? 1 : 0,
                transition: 'opacity 1s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    alignItems: 'center',
                    gap: 20,
                    textAlign: 'center' as const,
                }}
            >
                <div
                    style={{
                        color: YELLOW_400,
                        letterSpacing: '0.4em',
                        textTransform: 'uppercase' as const,
                        fontSize: 10,
                        opacity: 0.6,
                    }}
                >
                    ORBIT SECURED
                </div>
                <h1
                    style={{
                        fontFamily: FONT_MONO,
                        fontSize: 'clamp(28px, 5vw, 56px)',
                        fontWeight: 700,
                        letterSpacing: '0.15em',
                        lineHeight: 1.1,
                        color: YELLOW_400,
                        textTransform: 'uppercase' as const,
                        margin: 0,
                    }}
                >
                    SPACETIME
                    <br />
                    NEXUS
                </h1>
                <p
                    style={{
                        fontFamily: FONT_MONO,
                        fontSize: 11,
                        opacity: 0.65,
                        maxWidth: 320,
                        letterSpacing: '0.08em',
                        lineHeight: 1.9,
                        color: YELLOW_600,
                        margin: 0,
                    }}
                >
                    Autonomous orbital debris recovery.
                    <br />
                    Securing the commons of low-earth orbit.
                </p>
                <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                    <button
                        onClick={onEnterNexus}
                        style={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const,
                            border: `1px solid ${YELLOW_400}`,
                            color: YELLOW_400,
                            background: 'transparent',
                            padding: '12px 32px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textDecoration: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = YELLOW_400
                            e.currentTarget.style.color = '#000'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent'
                            e.currentTarget.style.color = YELLOW_400
                        }}
                    >
                        ENTER NEXUS
                    </button>
                    <button
                        onClick={onMission}
                        style={{
                            fontFamily: FONT_MONO,
                            fontSize: 11,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const,
                            color: YELLOW_600,
                            padding: '12px 32px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = YELLOW_400
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = YELLOW_600
                        }}
                    >
                        OUR MISSION →
                    </button>
                </div>
            </div>
        </div>
    )
}
