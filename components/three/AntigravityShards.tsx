import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const COUNT = 2000;
const RADIUS = 3.5;

export default function AntigravityShards() {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { positions, scales } = useMemo(() => {
    const positions: [number, number, number][] = [];
    const scales: number[] = [];
    for (let i = 0; i < COUNT; i++) {
      const r = RADIUS + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ]);
      scales.push(0.002 + Math.random() * 0.008);
    }
    return { positions, scales };
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * 0.02;
    for (let i = 0; i < COUNT; i++) {
      const [x, y, z] = positions[i];
      const s = scales[i];
      const drift = 0.02;
      const nx = x + Math.sin(t + i * 0.001) * drift;
      const ny = y + Math.cos(t * 0.7 + i * 0.002) * drift;
      const nz = z + Math.sin(t * 0.5 + i * 0.001) * drift;
      dummy.position.set(nx, ny, nz);
      dummy.scale.setScalar(s);
      dummy.rotation.y = t * 0.1 + i * 0.0001;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <coneGeometry args={[0.5, 1, 3]} />
      <meshBasicMaterial color="#F2F2F2" transparent opacity={0.6} />
    </instancedMesh>
  );
}
