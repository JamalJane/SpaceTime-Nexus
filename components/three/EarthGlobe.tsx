import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial
        color="#0a0a12"
        emissive="#0a0a20"
        specular="#222"
        shininess={8}
        transparent
        opacity={0.95}
      />
    </mesh>
  );
}
