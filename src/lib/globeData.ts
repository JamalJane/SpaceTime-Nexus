// ─── Globe Markers & Connections ─────────────────────────────
// Used by InteractiveGlobe to render 3D points and animated arcs.

export interface GlobeMarker {
    id: string
    name: string
    lat: number
    lng: number
    color: string
}

export interface GlobeConnection {
    startLat: number
    startLng: number
    endLat: number
    endLng: number
    color: string
}

export const DEFAULT_MARKERS: GlobeMarker[] = [
    { id: 'ksc', name: 'Kennedy Space Center', lat: 28.5721, lng: -80.6480, color: '#E8845C' },
    { id: 'baikonur', name: 'Baikonur Cosmodrome', lat: 45.9650, lng: 63.3050, color: '#E8845C' },
    { id: 'kourou', name: 'Guiana Space Centre', lat: 5.2360, lng: -52.7690, color: '#FFD700' },
    { id: 'jiuquan', name: 'Jiuquan Satellite Center', lat: 40.9581, lng: 100.2914, color: '#00FF41' },
    { id: 'tanegashi', name: 'Tanegashima', lat: 30.4000, lng: 131.0000, color: '#FFD700' },
    { id: 'sriharik', name: 'Satish Dhawan', lat: 13.7199, lng: 80.2304, color: '#00FF41' },
    { id: 'vandenberg', name: 'Vandenberg SFB', lat: 34.7420, lng: -120.5724, color: '#8B5CF6' },
    { id: 'plesetsk', name: 'Plesetsk Cosmodrome', lat: 62.9271, lng: 40.5777, color: '#8B5CF6' },
]

export const DEFAULT_CONNECTIONS: GlobeConnection[] = [
    { startLat: 28.5721, startLng: -80.6480, endLat: 45.9650, endLng: 63.3050, color: '#E8845C' },  // KSC → Baikonur
    { startLat: 28.5721, startLng: -80.6480, endLat: 5.2360, endLng: -52.7690, color: '#FFD700' },  // KSC → Kourou
    { startLat: 45.9650, startLng: 63.3050, endLat: 40.9581, endLng: 100.2914, color: '#00FF41' },  // Baikonur → Jiuquan
    { startLat: 40.9581, startLng: 100.2914, endLat: 30.4000, endLng: 131.0000, color: '#FFD700' },  // Jiuquan → Tanegashima
    { startLat: 13.7199, startLng: 80.2304, endLat: 30.4000, endLng: 131.0000, color: '#00FF41' },  // Satish Dhawan → Tanegashima
    { startLat: 34.7420, startLng: -120.5724, endLat: 62.9271, endLng: 40.5777, color: '#8B5CF6' },  // Vandenberg → Plesetsk
]
