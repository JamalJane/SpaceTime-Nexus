import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import AntigravityShards from './three/AntigravityShards';
import EarthGlobe from './three/EarthGlobe';
import DebrisField from './three/DebrisField';

export default function Scene3D() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onError={(error) => {
          console.error('Three.js error:', error);
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <AntigravityShards />
          <EarthGlobe />
          <DebrisField />
        </Suspense>
      </Canvas>
    </div>
  );
}
