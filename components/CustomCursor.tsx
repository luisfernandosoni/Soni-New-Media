import React from 'react';
import { motion, useMotionValue, useSpring, useVelocity, useTransform, useAnimationFrame } from 'framer-motion';

/**
 * CustomCursor V5 (Luminance-Locked)
 * Maps directly to the theme's --accent variable for perfect visibility.
 * Retains the kinetic stretching and squashing physics.
 */
export const CustomCursor: React.FC = () => {
  // Bypassing React renders for high-frequency updates
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const xVelocity = useVelocity(x);
  const yVelocity = useVelocity(y);

  // Kinetic Physics (Stretching)
  const speed = useTransform([xVelocity, yVelocity], ([vx, vy]) => 
    Math.sqrt(Math.pow(vx as number, 2) + Math.pow(vy as number, 2))
  );

  const stretch = useTransform(speed, [0, 3000], [1, 1.8]);
  const squash = useTransform(speed, [0, 3000], [1, 0.6]);
  
  const angle = useTransform([xVelocity, yVelocity], ([vx, vy]) => 
    Math.atan2(vy as number, vx as number) * (180 / Math.PI)
  );

  // Elastic physics for the trailing aura
  const springConfig = { damping: 35, stiffness: 400, mass: 0.3 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useAnimationFrame(() => {
    const root = document.documentElement;
    const mx = parseFloat(root.style.getPropertyValue('--mouse-x'));
    const my = parseFloat(root.style.getPropertyValue('--mouse-y'));
    if (!isNaN(mx)) {
      x.set(mx);
      y.set(my);
    }
  });

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
      {/* Precision Core: Mapped to Theme Accent (Solid Black in Light, Solid White in Dark) */}
      <motion.div
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: 'var(--accent)',
        }}
        className="w-1.5 h-1.5 rounded-full shadow-sm"
      />

      {/* Trailing Aura: Mapped to Theme Accent Border */}
      <motion.div
        id="custom-cursor-aura"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          rotate: angle,
          scaleX: stretch,
          scaleY: squash,
          borderColor: 'var(--accent)',
          borderWidth: 'var(--cursor-aura-weight)',
        }}
        className="w-10 h-10 border rounded-full backdrop-blur-[1.5px] opacity-80 transition-[transform,background,border-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      />
    </div>
  );
};