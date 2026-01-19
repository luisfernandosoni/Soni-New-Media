import React, { useRef, useMemo } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // How much the element pulls (default: 0.3)
  radius?: number;   // Detection radius in pixels (default: 150)
  className?: string;
}

/**
 * Magnetic Engine (2026 SV Standard)
 * Bypasses React state to track global CSS pointer variables and calculate 
 * real-time vector attraction for UI elements.
 */
export const Magnetic: React.FC<MagneticProps> = ({ 
  children, 
  strength = 0.35, 
  radius = 180,
  className = "" 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  
  // High-performance MotionValues
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Elastic spring config for "Ive-approved" physical feedback
  const springConfig = { damping: 25, stiffness: 200, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useAnimationFrame(() => {
    if (!ref.current) return;

    // Get element bounds
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Read global cursor from Aether Layer (index.html)
    const root = document.documentElement;
    const mx = parseFloat(root.style.getPropertyValue('--mouse-x'));
    const my = parseFloat(root.style.getPropertyValue('--mouse-y'));

    if (isNaN(mx) || isNaN(my)) return;

    // Distance Calculation
    const deltaX = mx - centerX;
    const deltaY = my - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Apply Inverse Attraction Logic
    if (distance < radius) {
      // Elements "look" and "pull" towards the cursor
      // Power curve ensures subtle movement at edge, intense at center
      const power = (1 - distance / radius);
      x.set(deltaX * strength * power);
      y.set(deltaY * strength * power);
    } else {
      // Elastic snap back to origin
      x.set(0);
      y.set(0);
    }
  });

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};