import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useMotionValue, MotionValue, useVelocity, useTransform, useSpring } from 'motion/react';
import { useMobileMagic } from '../hooks/useMobileMagic';

interface KineticContextType {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  velX: MotionValue<number>;
  velY: MotionValue<number>;
  isMobile: boolean;
}

const KineticContext = createContext<KineticContextType | undefined>(undefined);

export const KineticProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Magia Móvil (Hook externo)
  const { isMobile, virtualX, virtualY, requestGyroAccess } = useMobileMagic();

  // 2. Desktop Nativo (Inputs Crudos)
  const desktopX = useMotionValue(0);
  const desktopY = useMotionValue(0);

  // 3. Suavizado SELECTIVO (Solo para el Giroscopio)
  const gyroSpringConfig = { damping: 30, stiffness: 100, mass: 0.5 };
  const smoothVirtualX = useSpring(virtualX, gyroSpringConfig);
  const smoothVirtualY = useSpring(virtualY, gyroSpringConfig);

  // 4. EL BYPASS DE LATENCIA (La corrección #MCRD)
  // Desktop = Crudo (Cero Lag) | Móvil = Suave (Sin temblor)
  const finalX = isMobile ? smoothVirtualX : desktopX;
  const finalY = isMobile ? smoothVirtualY : desktopY;

  const velX = useVelocity(finalX);
  const velY = useVelocity(finalY);

  useEffect(() => {
    if (isMobile) {
      const unlockSensors = () => {
        requestGyroAccess();
        window.removeEventListener('click', unlockSensors);
        window.removeEventListener('touchstart', unlockSensors);
      };
      window.addEventListener('click', unlockSensors);
      window.addEventListener('touchstart', unlockSensors);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      desktopX.set(e.clientX);
      desktopY.set(e.clientY);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [isMobile, desktopX, desktopY, requestGyroAccess]);

  const value = useMemo(() => ({
    mouseX: finalX,
    mouseY: finalY,
    velX,
    velY,
    isMobile
  }), [finalX, finalY, velX, velY, isMobile]);

  return (
    <KineticContext.Provider value={value}>
      {children}
    </KineticContext.Provider>
  );
};

export const useKinetic = () => {
  const context = useContext(KineticContext);
  if (!context) throw new Error('useKinetic must be used within a KineticProvider');
  return context;
};

// Helper de movimiento relativo (Sin cambios)
export const useRelativeMotion = (ref: React.RefObject<HTMLElement | null>) => {
  const { mouseX, mouseY } = useKinetic();

  const relX = useTransform(mouseX, (x: number) => {
    if (!ref.current) return 0.5;
    const rect = ref.current.getBoundingClientRect();
    const val = (x - rect.left) / rect.width;
    return Math.max(0, Math.min(1, val));
  });

  const relY = useTransform(mouseY, (y: number) => {
    if (!ref.current) return 0.5;
    const rect = ref.current.getBoundingClientRect();
    const val = (y - rect.top) / rect.height;
    return Math.max(0, Math.min(1, val));
  });

  const isOver = useTransform([mouseX, mouseY], ([x, y]: number[]) => {
    if (!ref.current) return 0;
    const rect = ref.current.getBoundingClientRect();
    const over = (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
    return (over ? 1 : 0) as number;
  });

  return { relX, relY, isOver };
};