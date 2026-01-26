
import React, { useContext } from 'react';
import { motion, useTransform } from 'motion/react';
import { KineticSurfaceContext } from './KineticSurface.tsx';

interface KineticLayerProps {
  children: React.ReactNode;
  depth: number; 
  className?: string;
}

/**
 * KINETIC LAYER V4 (2026) - Spatial Integrity
 * Balanced leverage multiplier (0.18) to prevent "leaking" outside parent bounds.
 */
export const KineticLayer: React.FC<KineticLayerProps> = ({ children, depth, className = "" }) => {
  const context = useContext(KineticSurfaceContext);
  
  if (!context) {
    console.warn("KineticLayer must be used within a KineticSurface");
    return <>{children}</>;
  }

  const { smoothX, smoothY } = context;

  // Reduced leverage to keep elements inside the surgical clipping plane
  const x = useTransform(smoothX, [0, 1], [depth * 0.18, -depth * 0.18]);
  const y = useTransform(smoothY, [0, 1], [depth * 0.18, -depth * 0.18]);

  return (
    <motion.div
      style={{ 
        x, 
        y, 
        translateZ: depth,
        transformStyle: 'preserve-3d'
      } as any}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};
