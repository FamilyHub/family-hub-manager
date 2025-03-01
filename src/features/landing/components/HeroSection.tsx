'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, useScroll, useTransform } from 'framer-motion';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { HERO_SECTION } from '../constants/landing.constants';
import FamilyHouse from '@/shared/3d-models/FamilyHouse';
import dynamic from 'next/dynamic';

// Dynamically import AuthModal with ssr disabled to prevent hydration issues
const AuthModal = dynamic(() => import('@/components/auth/AuthModal'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
});

function Scene({ scrollProgress }: { scrollProgress: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!);

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 2, 8]}
        fov={50}
      />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Suspense fallback={null}>
        <FamilyHouse scrollProgress={scrollProgress} />
      </Suspense>
    </>
  );
}

export default function HeroSection() {
  const { scrollYProgress } = useScroll();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const modelProgress = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const handleAuthClick = (mode: 'login' | 'signup') => (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-4 flex items-center">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Canvas>
          <Scene scrollProgress={modelProgress.get()} />
        </Canvas>
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 text-center px-4"
        style={{ y, opacity, scale }}
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {HERO_SECTION.DEFAULT_TITLE}
        </motion.h1>

        <motion.p 
          className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {HERO_SECTION.DEFAULT_SUBTITLE}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.button
            onClick={handleAuthClick('signup')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-[#FF3366] hover:bg-[#FF3366]/90 text-white rounded-full font-semibold transition-all cursor-pointer"
          >
            {HERO_SECTION.CTA_TEXT}
          </motion.button>
          <motion.button
            onClick={handleAuthClick('login')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all backdrop-blur-sm cursor-pointer"
          >
            {HERO_SECTION.SECONDARY_CTA_TEXT}
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#2B0B3F] to-transparent" />
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-[#FF3366]/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-[#3B82F6]/30 rounded-full blur-3xl" />
    </section>
  );
}