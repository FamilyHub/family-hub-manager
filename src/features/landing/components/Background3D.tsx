'use client';

import { Canvas } from '@react-three/fiber';
import { Stars, Cloud } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import { MotionConfig } from 'framer-motion';

export default function Background3D() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#2B0B3F']} />
        
        {/* Stars */}
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        {/* Clouds */}
        <group position={[0, 0, 0]}>
          <Cloud
            opacity={0.5}
            speed={0.4}
            width={10}
            depth={1.5}
            segments={20}
            color="#FF3366"
          />
          <Cloud
            opacity={0.3}
            speed={0.3}
            width={10}
            depth={2}
            segments={20}
            color="#3B82F6"
          />
        </group>

        {/* Ambient Light */}
        <ambientLight intensity={0.4} />

        {/* Point Lights */}
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#FF3366" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
      </Canvas>
    </div>
  );
}
