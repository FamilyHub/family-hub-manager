'use client';

import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { styles } from '../styles/landing.styles';
import { FEATURES } from '../constants/landing.constants';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

function FeatureCard({ feature }: { feature: typeof FEATURES[0] }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for 3D effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring animations for smooth movement
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]));
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]));

  // Handle mouse move
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((event.clientX - centerX) / rect.width);
    y.set((event.clientY - centerY) / rect.height);
  };

  // Reset position when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      className="relative h-[400px] perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden"
          style={{ rotateY: 0 }}
        >
          <div className="relative h-full group">
            {/* Glowing effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-2xl 
              ${isHovered ? 'blur-2xl' : 'blur-xl'} transition-all duration-300`} />
            
            {/* Card content */}
            <div className="relative p-8 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 h-full">
              {/* Icon */}
              <div className="relative w-16 h-16 mb-6">
                <div className={`absolute inset-0 bg-purple-500/20 rounded-xl transform transition-transform duration-300
                  ${isHovered ? 'rotate-12 scale-110' : 'rotate-6'}`} />
                <div className="relative flex items-center justify-center w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                  {feature.icon && (
                    <feature.icon className="w-8 h-8 text-white" aria-hidden="true" />
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-purple-200 mb-6 group-hover:text-white transition-colors">
                {feature.description}
              </p>

              <div className="absolute bottom-4 right-4 text-purple-300">
                Click to see features →
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute w-full h-full backface-hidden"
          style={{ rotateY: 180 }}
        >
          <div className="relative h-full group">
            <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl 
              ${isHovered ? 'blur-2xl' : 'blur-xl'} transition-all duration-300`} />
            
            <div className="relative p-8 rounded-2xl backdrop-blur-md border border-white/10 bg-white/5 h-full">
              <h4 className="text-xl font-semibold text-white mb-6">Features</h4>
              
              <div className="space-y-4">
                {feature.features.map((item, index) => (
                  <div key={index} className="flex items-start text-purple-200 group-hover:text-white transition-colors">
                    <CheckCircleIcon className="w-5 h-5 mr-2 mt-1 text-purple-400 group-hover:text-purple-300 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-4 right-4 text-purple-300">
                ← Click to flip back
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`${styles.title} text-white mb-4`}>
            Smart Family Management
          </h2>
          <p className={`${styles.subtitle} text-purple-200`}>
            Track finances, health, and daily routines—all in one place.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}