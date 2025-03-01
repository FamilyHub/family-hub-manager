'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { random } from 'maath';

function BackgroundScene() {
  const ref = useRef<THREE.Points>(null!);
  const torusRef = useRef<THREE.Mesh>(null!);
  const octahedronRef = useRef<THREE.Mesh>(null!);
  
  // Generate random points for the galaxy effect
  const count = 5000;
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    random.inSphere(positions, { radius: 20 });
    return positions;
  }, []);

  // Animate the points and shapes
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x += delta / 2;
      torusRef.current.rotation.y += delta / 4;
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.x -= delta / 3;
      octahedronRef.current.rotation.z += delta / 5;
    }
  });

  return (
    <group>
      {/* Animated galaxy points */}
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.02}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Glowing orbs */}
      <mesh position={[5, 3, -10]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#4c1d95" transparent opacity={0.5} />
      </mesh>
      <mesh position={[-5, -3, -8]}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial color="#7e22ce" transparent opacity={0.5} />
      </mesh>

      {/* Abstract geometric shapes */}
      <mesh ref={torusRef} position={[3, -2, -6]} rotation={[0.5, 0.5, 0]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshPhongMaterial 
          color="#2563eb" 
          transparent 
          opacity={0.6}
          emissive="#2563eb"
          emissiveIntensity={0.5}
        />
      </mesh>
      <mesh ref={octahedronRef} position={[-3, 2, -5]} rotation={[0.2, 0.4, 0.1]}>
        <octahedronGeometry args={[1]} />
        <meshPhongMaterial 
          color="#7c3aed" 
          transparent 
          opacity={0.7}
          emissive="#7c3aed"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#4c1d95" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7e22ce" />
      
      {/* Additional atmospheric effects */}
      <fog attach="fog" args={['#1e1b4b', 5, 25]} />
    </group>
  );
}

export default BackgroundScene;
