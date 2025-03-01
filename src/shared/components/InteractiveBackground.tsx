'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue } from 'framer-motion';

const PARTICLE_COUNT = 50;
const PARTICLE_SIZE = 2;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: PARTICLE_SIZE + Math.random() * 2,
    velocity: {
      x: (Math.random() - 0.5) * 0.2,
      y: (Math.random() - 0.5) * 0.2,
    },
  }));
}

export default function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const particles = useRef(generateParticles());
  const animationRef = useRef<number>();
  const controls = useAnimation();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      mouseX.set(x);
      mouseY.set(y);

      // Animate gradient
      controls.start({
        background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,51,102,0.15), rgba(59,130,246,0.1), transparent)`,
        transition: { duration: 0.5 },
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, controls]);

  useEffect(() => {
    const updateParticles = () => {
      particles.current = particles.current.map(particle => {
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= 100) particle.velocity.x *= -1;
        if (particle.y <= 0 || particle.y >= 100) particle.velocity.y *= -1;

        // Mouse interaction
        const mouseXVal = mouseX.get();
        const mouseYVal = mouseY.get();
        const dx = mouseXVal - particle.x;
        const dy = mouseYVal - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 20) {
          const angle = Math.atan2(dy, dx);
          particle.velocity.x -= Math.cos(angle) * 0.02;
          particle.velocity.y -= Math.sin(angle) * 0.02;
        }

        return particle;
      });

      if (containerRef.current) {
        containerRef.current.style.setProperty(
          '--particles',
          particles.current
            .map(
              p =>
                `radial-gradient(circle at ${p.x}% ${p.y}%, rgba(255,255,255,0.5) 0%, transparent ${p.size}px)`
            )
            .join(',')
        );
      }

      animationRef.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-[#2B0B3F] via-[#571945] to-[#2B0B3F]"
      animate={controls}
      style={{
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'var(--particles)',
        },
      }}
    >
      {/* Animated gradient overlays */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#FF3366]/10 blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#3B82F6]/10 blur-[100px] animate-pulse" />
      </div>

      {/* Interactive particles */}
      <style jsx>{`
        div::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: var(--particles);
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
}
