
import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useMotionTemplate, MotionValue } from 'motion/react';
import { useRelativeMotion } from '../../context/KineticContext.tsx';

interface KineticSurfaceProps {
  children: React.ReactNode;
  strength?: number;
  shineIntensity?: number;
  className?: string;
  id?: string;
}

/**
 * KINETIC SURFACE V3 (2026) - Restoration of Fidelity
 * Decreased perspective to 1200 for a more striking tilt.
 */
export const KineticSurface: React.FC<KineticSurfaceProps> = ({ 
  children, 
  strength = 16, 
  shineIntensity = 0.15,
  className = "",
  id: providedId 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalId = useId();
  const cardId = providedId || internalId;
  const { relX, relY, isOver } = useRelativeMotion(cardId, containerRef);

  // High-fidelity spring with slightly more momentum
  const springConfig = useMemo(() => ({ 
    stiffness: 150, 
    damping: 20, // More fluid momentum
    mass: 1.2 
  }), []);

  // Fix: Explicitly casting smoothX and smoothY to MotionValue<number> to avoid inference pollution and resolve overload mismatches.
  // We use the composition variant of useTransform to check if the cursor is over the element before applying relative coordinates.
  const smoothX = useSpring(useTransform([isOver, relX], ([over, rX]: any[]) => (over === 1 ? (rX as number) : 0.5)), springConfig) as MotionValue<number>;
  const smoothY = useSpring(useTransform([isOver, relY], ([over, rY]: any[]) => (over === 1 ? (rY as number) : 0.5)), springConfig) as MotionValue<number>;

  const rotateX = useTransform(smoothY, [0, 1], [strength, -strength]);
  const rotateY = useTransform(smoothX, [0, 1], [-strength, strength]);
  
  const mouseXPercent = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const mouseYPercent = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  return (
    <motion.div
      ref={containerRef}
      style={{ 
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1200, // Dramatically more striking tilt
        "--mx": mouseXPercent,
        "--my": mouseYPercent
      } as any}
      className={`relative group will-change-transform ${className}`}
    >
      {/* Precision Lumina Glow */}
      <motion.div 
        style={{ 
          opacity: useTransform(isOver, (over: number) => over === 1 ? 1 : 0),
          background: useMotionTemplate`radial-gradient(1000px circle at var(--mx) var(--my), rgba(255,255,255,${shineIntensity}), transparent 60%)`,
          transform: 'translateZ(2px)',
        } as any}
        className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-700 rounded-[inherit]"
      />

      <KineticSurfaceContext.Provider value={{ smoothX, smoothY }}>
        {children}
      </KineticSurfaceContext.Provider>
    </motion.div>
  );
};

export const KineticSurfaceContext = React.createContext<{
  smoothX: any;
  smoothY: any;
} | null>(null);
