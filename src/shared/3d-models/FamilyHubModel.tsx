'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

export default function FamilyHubModel() {
  const mainSphereRef = useRef<THREE.Mesh>(null!);
  const particleRefs = useRef<THREE.Mesh[]>([]);
  
  // Create particles
  const particles = Array.from({ length: 8 }, (_, i) => ({
    position: [
      Math.cos(i * Math.PI / 4) * 2,
      Math.sin(i * Math.PI / 4) * 2,
      0
    ],
    scale: 0.3 + Math.random() * 0.2
  }));

  useFrame((state, delta) => {
    if (mainSphereRef.current) {
      mainSphereRef.current.rotation.y += delta * 0.5;
      mainSphereRef.current.rotation.z += delta * 0.2;
    }

    // Animate particles
    particleRefs.current.forEach((particle, i) => {
      if (particle) {
        const time = state.clock.getElapsedTime();
        particle.position.x = Math.cos(time + i * Math.PI / 4) * 2;
        particle.position.y = Math.sin(time + i * Math.PI / 4) * 2;
        particle.rotation.z += delta * 0.5;
      }
    });
  });

  return (
    <group>
      {/* Main sphere */}
      <mesh ref={mainSphereRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          color="#7c3aed"
          emissive="#7c3aed"
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Orbiting particles with trails */}
      {particles.map((particle, i) => (
        <group key={i}>
          <Trail
            width={0.1}
            length={4}
            color="#8b5cf6"
            attenuation={(t) => t * t}
          >
            <mesh
              ref={(el) => {
                if (el) particleRefs.current[i] = el;
              }}
              position={particle.position as [number, number, number]}
            >
              <sphereGeometry args={[particle.scale, 16, 16]} />
              <meshPhongMaterial
                color="#8b5cf6"
                emissive="#8b5cf6"
                emissiveIntensity={0.5}
                transparent
                opacity={0.8}
              />
            </mesh>
          </Trail>
        </group>
      ))}

      {/* Inner glow */}
      <Sphere args={[0.9, 32, 32]}>
        <meshBasicMaterial
          color="#c4b5fd"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Outer glow */}
      <Sphere args={[1.2, 32, 32]}>
        <meshBasicMaterial
          color="#7c3aed"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
}