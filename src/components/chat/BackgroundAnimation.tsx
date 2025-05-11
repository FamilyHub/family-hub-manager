'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Sphere } from '@react-three/drei';

function ChainLink({ position, rotation }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <torusGeometry args={[0.2, 0.06, 16, 32]} />
      <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
        clearcoat={1}
          reflectivity={1}
      />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <cylinderGeometry args={[0.06, 0.06, 0.12, 16]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.2}
          clearcoat={0.8}
        />
      </mesh>
    </group>
  );
}

function RotatingChain() {
  const chainRef = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (chainRef.current) {
      chainRef.current.rotation.z = time * 0.5; // Rotate the chain
    }
  });

  const numLinks = 24;
  const radius = 4;

  return (
    <group ref={chainRef}>
      {Array.from({ length: numLinks }).map((_, i) => {
        const angle = (i / numLinks) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const rotation = [0, 0, angle + Math.PI / 2];
        
        return (
          <ChainLink
            key={i}
            position={[x, y, 0]}
            rotation={rotation}
          />
        );
      })}
    </group>
  );
}

function Ball({ position, index, totalBalls }) {
  const meshRef = useRef();
  const stringRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const swingDuration = 2.5;
    const maxAngle = Math.PI / 6;
    const delay = 0.1;
    
    let phase = time / swingDuration;
    
    if (index === 0) {
      const angle = Math.sin(phase * Math.PI * 2) * maxAngle;
      meshRef.current.position.x = position[0] + Math.sin(angle) * 1.5;
      meshRef.current.position.y = position[1] - (Math.cos(angle) * 1.5 - 1.5);
    } else if (index === totalBalls - 1) {
      const impactPhase = (phase + delay * (totalBalls - 1)) % 1;
      if (impactPhase > 0.5) {
        const swingPhase = (impactPhase - 0.5) * 2;
        const angle = Math.sin(swingPhase * Math.PI) * maxAngle;
        meshRef.current.position.x = position[0] + Math.sin(angle) * 1.5;
        meshRef.current.position.y = position[1] - (Math.cos(angle) * 1.5 - 1.5);
      }
    }
    
    if (stringRef.current) {
      const ballPos = meshRef.current.position;
      stringRef.current.geometry.attributes.position.array[3] = ballPos.x;
      stringRef.current.geometry.attributes.position.array[4] = ballPos.y;
      stringRef.current.geometry.attributes.position.array[5] = ballPos.z;
      stringRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <line ref={stringRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              position[0], position[1] + 1.5, position[2],
              position[0], position[1], position[2]
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#FFD700" linewidth={1} />
      </line>
      
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={1}
          transmission={0.1}
          ior={2}
          thickness={0.5}
        />
      </mesh>
    </group>
  );
}

function NewtonsCradle() {
  const { camera, size } = useThree();
  const numBalls = 5;
  const spacing = 0.8;
  
  useEffect(() => {
    const aspect = size.width / size.height;
    if (aspect > 1) {
      camera.position.set(0, 0, 8);
    } else {
      camera.position.set(0, 0, 12);
    }
    camera.lookAt(0, 0, 0);
  }, [camera, size]);

  return (
    <>
      {/* Environment lighting for metallic effect */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#FFFFFF" />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#FFD700" />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#FFFFFF" />
      <pointLight position={[0, -5, 0]} intensity={0.4} color="#FFD700" />
      
      <RotatingChain />

      {/* Support Frame */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[numBalls * spacing * 1.4, 0.1, 0.1]} />
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={1}
          roughness={0.1}
          clearcoat={1}
          reflectivity={1}
        />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[numBalls * spacing * 1.4, 0.2, 1]} />
        <meshPhysicalMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.2}
          clearcoat={0.8}
          reflectivity={0.8}
        />
      </mesh>

      {/* Balls */}
      {Array.from({ length: numBalls }).map((_, i) => (
        <Ball
          key={i}
          position={[
            (i - (numBalls - 1) / 2) * spacing,
            0,
            0
          ]}
          index={i}
          totalBalls={numBalls}
        />
      ))}
    </>
  );
}

export function BackgroundAnimation() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <div className="w-full h-full max-w-3xl mx-auto">
        <Canvas
          style={{
            background: 'transparent',
            width: '100%',
            height: '100%',
            opacity: 0.3
          }}
          camera={{ fov: 50, near: 0.1, far: 1000 }}
        >
          <NewtonsCradle />
      </Canvas>
      </div>
    </div>
  );
} 