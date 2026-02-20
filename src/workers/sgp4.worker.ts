// SGP4 Physics Web Worker
// Receives TLE data, returns ECI (Earth Centered Inertial) XYZ coordinates
// Runs off the main thread to preserve UI smoothness

import * as satellite from 'satellite.js'

export interface WorkerInput {
    id: string
    name: string
    tleLine1: string
    tleLine2: string
}

export interface WorkerOutput {
    id: string
    x: number
    y: number
    z: number
    valid: boolean
}

self.onmessage = (e: MessageEvent<{ satellites: WorkerInput[] }>) => {
    const { satellites } = e.data
    const now = new Date()

    const results: WorkerOutput[] = satellites.map((sat) => {
        try {
            const satrec = satellite.twoline2satrec(sat.tleLine1, sat.tleLine2)
            const posVel = satellite.propagate(satrec, now)

            if (!posVel.position || typeof posVel.position === 'boolean') {
                return { id: sat.id, x: 0, y: 0, z: 0, valid: false }
            }

            const pos = posVel.position as satellite.EciVec3<number>

            // Scale from km to Three.js scene units (Earth radius = 1)
            const EARTH_RADIUS_KM = 6371
            const scale = 1 / EARTH_RADIUS_KM

            return {
                id: sat.id,
                x: pos.x * scale,
                y: pos.z * scale, // swap z/y: ECI z is "up", Three.js y is "up"
                z: pos.y * scale,
                valid: true,
            }
        } catch {
            return { id: sat.id, x: 0, y: 0, z: 0, valid: false }
        }
    })

    self.postMessage({ results })
}
