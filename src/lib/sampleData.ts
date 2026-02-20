// Seeded sample TLE data for demo satellites when API is unavailable
// Real-world TLEs from public catalog sources (CelesTrak)

export const SAMPLE_SATELLITES = [
    {
        id: 'sat-25544',
        noradId: 25544,
        name: 'ISS (ZARYA)',
        objectType: 'PAYLOAD' as const,
        tleLine1: '1 25544U 98067A   24059.50937500  .00012126  00000-0  22218-3 0  9997',
        tleLine2: '2 25544  51.6413 124.3271 0003417 253.8107 256.0707 15.49601748441768',
        altitudeKm: 420,
        decayStatus: false,
        dryMassKg: 419725,
        materialProfile: { aluminum: 0.6, titanium: 0.3, gold: 0.05, copper: 0.05 },
    },
    {
        id: 'sat-20580',
        noradId: 20580,
        name: 'HUBBLE SPACE TELESCOPE',
        objectType: 'PAYLOAD' as const,
        tleLine1: '1 20580U 90037B   24059.50000000  .00001234  00000-0  63450-4 0  9992',
        tleLine2: '2 20580  28.4697 309.2340 0002561 332.8040  27.2703 15.09299864789623',
        altitudeKm: 547,
        decayStatus: false,
        dryMassKg: 11110,
        materialProfile: { aluminum: 0.55, titanium: 0.35, gold: 0.08, copper: 0.02 },
    },
    {
        id: 'sat-00005',
        noradId: 5,
        name: 'VANGUARD 1',
        objectType: 'PAYLOAD' as const,
        tleLine1: '1 00005U 58002B   24059.50000000  .00000023  00000-0  71530-4 0  9997',
        tleLine2: '2 00005  34.2503 166.9601 1847032 153.0584 222.2913 10.84707618302839',
        altitudeKm: 3840,
        decayStatus: false,
        dryMassKg: 1.47,
        materialProfile: { aluminum: 0.4, titanium: 0.1, gold: 0.45, copper: 0.05 },
    },
    {
        id: 'sat-debris-1',
        noradId: 28884,
        name: 'ZENIT-2 R/B DEBRIS',
        objectType: 'DEBRIS' as const,
        tleLine1: '1 28884U 05042B   24059.38229252  .00018012  00000-0  11748-2 0  9997',
        tleLine2: '2 28884  98.6123 123.0456 0012560 234.5678  45.6789 14.42600000123456',
        altitudeKm: 245,
        decayStatus: true,
        dryMassKg: 8500,
        materialProfile: { aluminum: 0.7, titanium: 0.2, gold: 0.02, copper: 0.08 },
    },
    {
        id: 'sat-debris-2',
        noradId: 39452,
        name: 'SL-8 R/B FRAGMENT',
        objectType: 'DEBRIS' as const,
        tleLine1: '1 39452U 13079B   24059.50000000  .00008765  00000-0  52345-3 0  9993',
        tleLine2: '2 39452  82.5012 267.1234 0019876 156.7890  43.2100 14.78500000234567',
        altitudeKm: 380,
        decayStatus: false,
        dryMassKg: 1450,
        materialProfile: { aluminum: 0.65, titanium: 0.25, gold: 0.03, copper: 0.07 },
    },
    {
        id: 'sat-debris-3',
        noradId: 42017,
        name: 'COSMOS 1408 DEBRIS',
        objectType: 'DEBRIS' as const,
        tleLine1: '1 42017U 17009A   24059.44312500  .00022133  00000-0  14876-2 0  9994',
        tleLine2: '2 42017  82.9012 198.4567 0003210 45.6789 314.4123 15.18200000456789',
        altitudeKm: 320,
        decayStatus: true,
        dryMassKg: 760,
        materialProfile: { aluminum: 0.75, titanium: 0.15, gold: 0.01, copper: 0.09 },
    },
]

// Generate a large set of fake debris for the point cloud visualization
export function generateDebrisCloud(count: number) {
    const debris = []
    for (let i = 0; i < count; i++) {
        const altitude = 200 + Math.random() * 35000
        const inclination = Math.random() * 180 - 90
        const lon = Math.random() * 360

        // Convert to cartesian for quick 3D placement
        const R = 1 + altitude / 6371
        const theta = (inclination * Math.PI) / 180
        const phi = (lon * Math.PI) / 180

        debris.push({
            x: R * Math.cos(theta) * Math.cos(phi),
            y: R * Math.sin(theta),
            z: R * Math.cos(theta) * Math.sin(phi),
        })
    }
    return debris
}
