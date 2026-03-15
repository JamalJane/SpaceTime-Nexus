'use client'

import OrbitalCanvas from './OrbitalCanvas'
import { useNavStore } from '../../store'

export function SplineHero() {
  const enableHud = useNavStore((s) => s.enableHud)
  const setPage = useNavStore((s) => s.setPage)

  const handleOurMission = () => {
    enableHud()
    setPage('MISSION_PROFILE')
  }

  const handleEnterNexus = () => {
    enableHud()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 20,
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
        display: 'flex',
      }}
    >
      {/* Left — text content */}
      <div
        style={{
          flex: 1,
          padding: '40px',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.65rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: '16px',
            color: '#FACC15',
            fontFamily: '"IBM Plex Mono", monospace',
            opacity: 0.7,
          }}
        >
          Orbital Debris Recovery
        </p>
        <h1
          style={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: 'clamp(2.5rem, 5vw, 3.8rem)',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            background: 'linear-gradient(to bottom, #FACC15, #92400e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Spacetime<br />Nexus
        </h1>
        <p
          style={{
            marginTop: '20px',
            maxWidth: '380px',
            lineHeight: 1.7,
            color: '#a3783a',
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.78rem',
          }}
        >
          Autonomous low-earth orbit clearance. Real-time debris intercept,
          stabilization, and recovery across the orbital commons.
        </p>
        <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
          <button
            type="button"
            onClick={handleOurMission}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              border: '1px solid #FACC15',
              color: '#FACC15',
              background: 'transparent',
              padding: '12px 28px',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FACC15'
              e.currentTarget.style.color = '#000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#FACC15'
            }}
          >
            Our Mission
          </button>
          <button
            type="button"
            onClick={handleEnterNexus}
            style={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.68rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#a3783a',
              padding: '12px 28px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FACC15'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#a3783a'
            }}
          >
            Enter Nexus →
          </button>
        </div>
      </div>

      {/* Right — Animated orbital visual */}
      <div style={{ flex: 1, position: 'relative' }}>
        <OrbitalCanvas />
      </div>
    </div>
  )
}
