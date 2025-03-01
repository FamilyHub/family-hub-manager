'use client';

import { motion } from 'framer-motion';
import Sidebar from '@/components/home/Sidebar';
import TopBar from '@/components/home/TopBar';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1B0B41] via-[#111D4A] to-[#0A1128]">
      <Sidebar />
      <TopBar />
      
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="pl-[240px] pt-16"
      >
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </motion.main>

      {/* Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1B0B41]/50 to-[#0A1128]/80" />
        
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 -right-[10%] w-[1000px] h-[1000px] bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/30 rounded-full blur-3xl animate-float opacity-30" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[1000px] h-[1000px] bg-gradient-to-tr from-blue-500/30 via-indigo-500/20 to-violet-500/30 rounded-full blur-3xl animate-float animation-delay-2000 opacity-30" />
        <div className="absolute top-[30%] left-[20%] w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float animation-delay-4000 opacity-20" />

        {/* Glowing Accents */}
        <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-violet-400/60 rounded-full animate-glow" />
        <div className="absolute top-[60%] left-[70%] w-2 h-2 bg-fuchsia-400/60 rounded-full animate-glow animation-delay-2000" />
        <div className="absolute top-[80%] left-[20%] w-2 h-2 bg-indigo-400/60 rounded-full animate-glow animation-delay-4000" />

        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)]"
          style={{ backgroundSize: '50px 50px' }}
        />

        {/* Glass Effect Overlays */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-white/[0.07] to-transparent transform -skew-y-6" />
        <div className="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#0A1128] to-transparent" />
      </div>
    </div>
  );
}
