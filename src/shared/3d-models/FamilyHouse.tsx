'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

function FamilyAvatar({ position, color }: { position: [number, number, number], color: string }) {
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={position}
    >
      <group>
        {/* Head */}
        <mesh>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshPhongMaterial color={color} />
        </mesh>
        {/* Body */}
        <mesh position={[0, -0.3, 0]}>
          <capsuleGeometry args={[0.15, 0.3, 8, 16]} />
          <meshPhongMaterial color={color} />
        </mesh>
      </group>
    </Float>
  );
}

export default function FamilyHouse({ scrollProgress = 0 }) {
  const houseRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (houseRef.current) {
      // Rotate based on scroll
      houseRef.current.rotation.y = THREE.MathUtils.lerp(
        houseRef.current.rotation.y,
        Math.PI * 2 * scrollProgress + state.clock.getElapsedTime() * 0.1,
        0.05
      );
      
      // Gentle floating motion
      houseRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  const familyMembers = [
    { position: [2, 0, 2], color: '#f472b6' },   // Pink
    { position: [-2, 1, -2], color: '#818cf8' }, // Blue
    { position: [2, -1, -2], color: '#34d399' }, // Green
    { position: [-2, 0.5, 2], color: '#fbbf24' }, // Yellow
  ];

  return (
    <group ref={houseRef}>
      {/* Main house structure */}
      <group position={[0, 0, 0]}>
        {/* Base */}
        <mesh position={[0, -0.5, 0]}>
          <boxGeometry args={[2, 1, 2]} />
          <meshPhongMaterial 
            color="#8b5cf6"
            transparent
            opacity={0.9}
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Roof */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[1.5, 1.5, 4]} />
          <meshPhongMaterial 
            color="#7c3aed"
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Windows */}
        {[[-0.5, -0.3, 1.01], [0.5, -0.3, 1.01]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]}>
            <planeGeometry args={[0.4, 0.4]} />
            <meshPhongMaterial 
              color="#c4b5fd"
              emissive="#c4b5fd"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}

        {/* Door */}
        <mesh position={[0, -0.7, 1.01]}>
          <planeGeometry args={[0.4, 0.6]} />
          <meshPhongMaterial 
            color="#4c1d95"
            emissive="#4c1d95"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Glowing orb inside */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshPhongMaterial
            color="#c4b5fd"
            emissive="#c4b5fd"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>

      {/* Floating family members */}
      {familyMembers.map((member, index) => (
        <FamilyAvatar
          key={index}
          position={member.position}
          color={member.color}
        />
      ))}

      {/* Connecting lines (family bonds) */}
      {familyMembers.map((member, i) => (
        familyMembers.slice(i + 1).map((otherMember, j) => (
          <mesh key={`line-${i}-${j}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...member.position,
                  ...otherMember.position
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#c4b5fd" transparent opacity={0.2} />
          </mesh>
        ))
      ))}
    </group>
  );
}
