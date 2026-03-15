import { useRef, useEffect } from 'react'

/**
 * Animated orbital rings + particle field rendered on a 2D canvas.
 * Replaces the removed Spline 3D scene with a lightweight, visually rich alternative.
 */
export default function OrbitalCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animId: number

        // Particle system
        const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number }[] = []
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random(),
                y: Math.random(),
                vx: (Math.random() - 0.5) * 0.0004,
                vy: (Math.random() - 0.5) * 0.0004,
                size: 0.5 + Math.random() * 1.5,
                opacity: 0.15 + Math.random() * 0.4,
                hue: 30 + Math.random() * 20, // warm gold range
            })
        }

        const resize = () => {
            const dpr = window.devicePixelRatio || 1
            const rect = canvas.getBoundingClientRect()
            canvas.width = rect.width * dpr
            canvas.height = rect.height * dpr
            ctx.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', resize)

        const draw = (time: number) => {
            const rect = canvas.getBoundingClientRect()
            const w = rect.width
            const h = rect.height
            const cx = w * 0.5
            const cy = h * 0.5

            ctx.clearRect(0, 0, w, h)

            // Draw orbital rings
            const rings = [
                { rx: w * 0.28, ry: w * 0.10, rotation: -25, speed: 0.00012, color: 'rgba(232, 132, 92, 0.15)', width: 1 },
                { rx: w * 0.35, ry: w * 0.13, rotation: 15, speed: 0.00009, color: 'rgba(255, 215, 0, 0.1)', width: 0.8 },
                { rx: w * 0.42, ry: w * 0.08, rotation: -55, speed: 0.00015, color: 'rgba(139, 92, 246, 0.08)', width: 0.6 },
                { rx: w * 0.22, ry: w * 0.18, rotation: 40, speed: -0.0001, color: 'rgba(255, 176, 136, 0.12)', width: 0.7 },
            ]

            for (const ring of rings) {
                ctx.save()
                ctx.translate(cx, cy)
                ctx.rotate((ring.rotation + time * ring.speed * 57.3) * Math.PI / 180)
                ctx.beginPath()
                ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2)
                ctx.strokeStyle = ring.color
                ctx.lineWidth = ring.width
                ctx.stroke()

                // Small orbiting dot on each ring
                const dotAngle = time * ring.speed * 3
                const dotX = ring.rx * Math.cos(dotAngle)
                const dotY = ring.ry * Math.sin(dotAngle)
                ctx.beginPath()
                ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
                ctx.fillStyle = ring.color.replace(/[\d.]+\)$/, '0.7)')
                ctx.fill()

                ctx.restore()
            }

            // Central glow
            const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.15)
            gradient.addColorStop(0, 'rgba(232, 132, 92, 0.06)')
            gradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.02)')
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(cx, cy, w * 0.15, 0, Math.PI * 2)
            ctx.fill()

            // Central bright dot
            ctx.beginPath()
            ctx.arc(cx, cy, 3, 0, Math.PI * 2)
            ctx.fillStyle = 'rgba(255, 215, 0, 0.5)'
            ctx.fill()

            // Draw floating particles
            for (const p of particles) {
                p.x += p.vx
                p.y += p.vy

                // Wrap around
                if (p.x < 0) p.x = 1
                if (p.x > 1) p.x = 0
                if (p.y < 0) p.y = 1
                if (p.y > 1) p.y = 0

                const flicker = 0.7 + 0.3 * Math.sin(time * 0.002 + p.x * 10)
                ctx.beginPath()
                ctx.arc(p.x * w, p.y * h, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `hsla(${p.hue}, 60%, 70%, ${p.opacity * flicker})`
                ctx.fill()
            }

            animId = requestAnimationFrame(draw)
        }

        animId = requestAnimationFrame(draw)

        return () => {
            cancelAnimationFrame(animId)
            window.removeEventListener('resize', resize)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'block',
            }}
        />
    )
}
