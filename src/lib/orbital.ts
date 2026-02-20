// NRV = Net Resource Value
// (Σ Mass_i × Price_i) - (ΔV × CostPerDeltaV) - (OverheadCost × FlightDays)

const FUEL_COST_PER_MS = 1200      // USD per m/s of delta-v
const OVERHEAD_PER_DAY = 4500      // USD per day of mission time

export interface NRVInput {
    dryMassKg: number
    materialProfile: {
        aluminum: number  // 0-1 fraction
        titanium: number
        gold: number
        copper: number
    }
    prices: {
        aluminum: number  // USD/kg
        titanium: number
        gold: number
        copper: number
    }
    deltaVMs: number    // m/s
    flightDays: number
}

export function calcNRV(input: NRVInput): number {
    const { dryMassKg, materialProfile, prices, deltaVMs, flightDays } = input

    const materialValue =
        dryMassKg * materialProfile.aluminum * prices.aluminum +
        dryMassKg * materialProfile.titanium * prices.titanium +
        dryMassKg * materialProfile.gold * prices.gold +
        dryMassKg * materialProfile.copper * prices.copper

    const fuelCost = deltaVMs * FUEL_COST_PER_MS
    const overheadCost = flightDays * OVERHEAD_PER_DAY

    return materialValue - fuelCost - overheadCost
}

// Tsiolkovsky — check if mission is feasible
// Δv = Isp × g0 × ln(m_initial / m_final)
export function tsiolkovskyFuelCheck(params: {
    deltaVMs: number
    crafMassKg: number
    fuelMassKg: number
    ispSeconds: number
}): boolean {
    const { deltaVMs, crafMassKg, fuelMassKg, ispSeconds } = params
    const G0 = 9.80665
    const mInitial = crafMassKg + fuelMassKg
    const mFinal = crafMassKg

    const maxDeltaV = ispSeconds * G0 * Math.log(mInitial / mFinal)
    return deltaVMs <= maxDeltaV
}

// Simple Lambert approx: estimates Δv for a Hohmann-style transfer
// For a rough intercept estimate given altitude difference
export function estimateDeltaV(
    currentAltKm: number,
    targetAltKm: number,
    earthRadiusKm = 6371,
    mu = 3.986e14 // Earth's gravitational parameter m³/s²
): number {
    const r1 = (earthRadiusKm + currentAltKm) * 1000  // m
    const r2 = (earthRadiusKm + targetAltKm) * 1000   // m
    const a_transfer = (r1 + r2) / 2

    const v1 = Math.sqrt(mu / r1)
    const v2 = Math.sqrt(mu / r2)
    const vt1 = Math.sqrt(mu * (2 / r1 - 1 / a_transfer))
    const vt2 = Math.sqrt(mu * (2 / r2 - 1 / a_transfer))

    return Math.abs(vt1 - v1) + Math.abs(v2 - vt2)  // total Δv in m/s
}
