'use client';

import Navbar from '../shared/layouts/Navbar';
import HeroSection from '../features/landing/components/HeroSection';
import FeaturesSection from '../features/landing/components/FeaturesSection';
import Background3D from '../features/landing/components/Background3D';
import InteractiveBackground from '@/shared/components/InteractiveBackground';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Interactive Background */}
      <InteractiveBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <FeaturesSection />
      </div>
    </main>
  );
}
