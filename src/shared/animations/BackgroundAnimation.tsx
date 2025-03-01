'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  radius: number;
  dx: number;
  dy: number;
  color: string;
  alpha: number;
  growing: boolean;
  pulseSpeed: number;
  trail: { x: number; y: number }[];
}

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    
    const colors = [
      { start: '#C4B5FD', end: '#8B5CF6' },
      { start: '#A78BFA', end: '#7C3AED' },
      { start: '#DDD6FE', end: '#6D28D9' },
      { start: '#93C5FD', end: '#3B82F6' }
    ];
    
    const particleCount = 40;
    const maxTrailLength = 10;

    // Set canvas size with device pixel ratio
    const setCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Create gradient for a particle
    const createGradient = (particle: Particle) => {
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.radius
      );
      const colorPair = colors[Math.floor(Math.random() * colors.length)];
      gradient.addColorStop(0, colorPair.start);
      gradient.addColorStop(1, colorPair.end);
      return gradient;
    };

    // Create particles
    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 3 + 2;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius,
          dx: (Math.random() - 0.5) * 0.7,
          dy: (Math.random() - 0.5) * 0.7,
          color: colors[Math.floor(Math.random() * colors.length)].start,
          alpha: Math.random() * 0.5 + 0.5,
          growing: Math.random() > 0.5,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          trail: []
        });
      }
    };

    // Draw background pattern
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#F3F4F6');
      gradient.addColorStop(1, '#EDE9FE');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 30;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Draw particles and effects
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBackground();

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Update position
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

        // Pulse effect
        if (particle.growing) {
          particle.radius += particle.pulseSpeed;
          if (particle.radius > 5) particle.growing = false;
        } else {
          particle.radius -= particle.pulseSpeed;
          if (particle.radius < 2) particle.growing = true;
        }

        // Update trail
        particle.trail.unshift({ x: particle.x, y: particle.y });
        if (particle.trail.length > maxTrailLength) {
          particle.trail.pop();
        }

        // Draw trail
        ctx.beginPath();
        ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
        particle.trail.forEach((point, index) => {
          ctx.lineTo(point.x, point.y);
        });
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * particle.alpha})`;
        ctx.lineWidth = particle.radius * 0.5;
        ctx.stroke();

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = createGradient(particle);
        ctx.fill();

        // Interactive connections
        const mouseDistance = Math.hypot(mouseRef.current.x - particle.x, mouseRef.current.y - particle.y);
        if (mouseDistance < 150) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${(150 - mouseDistance) / 150 * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Particle connections
        particles.forEach((otherParticle, j) => {
          if (i === j) return;
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            const gradient = ctx.createLinearGradient(
              particle.x, particle.y,
              otherParticle.x, otherParticle.y
            );
            gradient.addColorStop(0, `rgba(139, 92, 246, ${(150 - distance) / 150 * 0.2})`);
            gradient.addColorStop(1, `rgba(59, 130, 246, ${(150 - distance) / 150 * 0.2})`);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    // Initialize
    setCanvasSize();
    createParticles();
    draw();

    // Event listeners
    window.addEventListener('resize', () => {
      setCanvasSize();
      createParticles();
    });
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
} 