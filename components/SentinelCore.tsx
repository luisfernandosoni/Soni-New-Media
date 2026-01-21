
/* 
 * ARCHITECTURAL RULE: This component is a "Black Box". 
 * SYSTEM_CORE_V16_UNIVERSE_SYNC: Multi-planar Parallax + Gaze Logic + Pro Mist.
 * High-visibility technical architecture that simulates infinite spatial depth.
 */

import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useTime, useMotionValue, MotionValue, useInView, useMotionTemplate } from 'motion/react';
import { useKinetic, useRelativeMotion } from '../context/KineticContext.tsx';

// --- SUB-COMPONENT: TechnicalFilters (PRO_MIST_EDITION) ---
const TechnicalFilters = () => (
  <svg style={{ visibility: 'hidden', position: 'absolute' }} width="0" height="0">
    <defs>
      {/* Precision Edge Glow */}
      <filter id="core-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -10" result="glow" />
        <feBlend in="SourceGraphic" in2="glow" mode="screen" />
      </filter>
      
      {/* Cinematic Pro Mist Diffusion */}
      <filter id="pro-mist" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="diffusion" />
        <feColorMatrix in="diffusion" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.45 0" />
        <feBlend in="SourceGraphic" mode="screen" />
      </filter>
    </defs>
  </svg>
);

// --- SUB-COMPONENT: SpatialNodes ---
const SpatialNodes = React.memo(({ relX, relY }: { relX: MotionValue<number>, relY: MotionValue<number> }) => {
  const nodes = useMemo(() => Array.from({ length: 180 }).map((_, i) => {
    const seed = Math.random();
    let z, opacity, size, blur;

    if (seed > 0.7) { 
      z = Math.random() * -350 - 150;
      opacity = Math.random() * 0.5 + 0.3;
      size = Math.random() * 1.5 + 1;
      blur = 0;
    } else if (seed > 0.3) { 
      z = Math.random() * -700 - 500;
      opacity = Math.random() * 0.3 + 0.15;
      size = Math.random() * 1.2 + 0.5;
      blur = 1;
    } else { 
      z = Math.random() * -1300 - 1200;
      opacity = Math.random() * 0.2 + 0.05;
      size = Math.random() * 0.8 + 0.3;
      blur = 2;
    }
    
    return {
      id: i,
      top: `${Math.random() * 160 - 30}%`, 
      left: `${Math.random() * 160 - 30}%`,
      z,
      opacity,
      size,
      blur
    };
  }), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
      {nodes.map((node) => {
        const depthFactor = Math.abs(node.z) / 180;
        const dividerX = 6.2 + depthFactor;
        const dividerY = 8.8 + depthFactor;

        return (
          <motion.div
            key={node.id}
            style={{
              top: node.top,
              left: node.left,
              translateZ: node.z,
              opacity: node.opacity,
              width: `${node.size}px`,
              height: `${node.size}px`,
              filter: node.blur > 0 ? `blur(${node.blur}px)` : 'none',
              x: useTransform(relX, [0, 1], [node.z / dividerX, -node.z / dividerX]),
              y: useTransform(relY, [0, 1], [node.z / dividerY, -node.z / dividerY]),
            } as any}
            className="absolute bg-white rounded-full"
          />
        );
      })}
    </div>
  );
});

// --- SUB-COMPONENT: SentinelRing ---
const SentinelRing = React.memo(({ 
  index, 
  relX, 
  relY, 
  isMobile,
  totalRings,
  time
}: { 
  index: number; 
  relX: MotionValue<number>; 
  relY: MotionValue<number>;
  isMobile: boolean;
  totalRings: number;
  time: MotionValue<number>;
}) => {
  const baseDepth = isMobile ? 12 : 26; 
  const baseSize = isMobile ? 85 : 130;
  const sizeStep = isMobile ? 8 : 12;
  const zDepth = index * -baseDepth;

  const springConfig = useMemo(() => ({ 
    stiffness: 160 - (index * 4.5), 
    damping: 32 + (index * 0.4),   
    mass: 0.6 + (index * 0.1),    
  }), [index]);

  const ringSpringX = useSpring(relX, springConfig);
  const ringSpringY = useSpring(relY, springConfig);
  
  const driftMultiplier = index * 24; 
  const tx = useTransform(ringSpringX, [0, 1], [-driftMultiplier, driftMultiplier]);
  const ty = useTransform(ringSpringY, [0, 1], [-driftMultiplier * 0.6, driftMultiplier * 0.6]);

  const wanderAmp = 5 + (index * 0.4);
  const wanderFreq = 3000 + (index * 200);
  const wanderX = useTransform(time, (t) => Math.sin(t / wanderFreq) * wanderAmp);
  const wanderY = useTransform(time, (t) => Math.cos(t / (wanderFreq * 1.1)) * wanderAmp);

  const edgeFactor = useTransform([relX, relY], ([x, y]) => {
    const dx = Math.abs((x as number) - 0.5);
    const dy = Math.abs((y as number) - 0.5);
    return Math.max(dx, dy) * 2; 
  });

  const targetRotateZ = useTransform(edgeFactor, [0, 1], [0, (index % 2 === 0 ? 1 : -1) * (index * 1.8)]);
  const rotateZ = useSpring(targetRotateZ, { stiffness: 45, damping: 24 });

  const opacity = useTransform(useMotionValue(index), (i) => 
    0.85 - (i / totalRings) * 0.65
  );

  return (
    <motion.div
      style={{
        width: `${baseSize + index * sizeStep}px`,
        height: `${baseSize + index * sizeStep}px`,
        x: useMotionTemplate`${tx}px`,
        y: useMotionTemplate`${ty}px`,
        translateX: wanderX,
        translateY: wanderY,
        translateZ: zDepth,
        rotateZ,
        opacity,
        transformStyle: "preserve-3d",
      } as any}
      className="absolute flex items-center justify-center will-change-transform"
    >
      <div className="w-full h-full rounded-full border-[1.25px] border-white/40 relative shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
    </motion.div>
  );
});

// --- SUB-COMPONENT: SentinelAssembly ---
const SentinelAssembly: React.FC<{
  relX: MotionValue<number>;
  relY: MotionValue<number>;
  isMobile: boolean;
  time: MotionValue<number>;
}> = ({ relX, relY, isMobile, time }) => {
  const ringCount = isMobile ? 12 : 24; 
  const rings = useMemo(() => Array.from({ length: ringCount }), [ringCount]);

  const rotateX = useTransform(relY, [0, 1], [55.0, -55.0]); 
  const rotateY = useTransform(relX, [0, 1], [-55.0, 55.0]); 
  
  const springRotateX = useSpring(rotateX, { stiffness: 110, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 110, damping: 30 });

  return (
    <motion.div 
      style={{ 
        transformStyle: "preserve-3d",
        rotateX: springRotateX,
        rotateY: springRotateY,
        filter: "url(#pro-mist)" 
      } as any} 
      className="relative w-full h-full flex items-center justify-center"
    >
      <SpatialNodes relX={relX} relY={relY} />
      
      {rings.map((_, i) => (
        <SentinelRing 
          key={`ring-${i}`} 
          index={i} 
          relX={relX} 
          relY={relY} 
          isMobile={isMobile}
          totalRings={ringCount}
          time={time}
        />
      ))}
      
      {/* Central Singularity with Halo */}
      <motion.div 
        style={{ 
          translateZ: isMobile ? 80 : 200, 
          x: useTransform(relX, [0, 1], [-45, 45]),
          y: useTransform(relY, [0, 1], [-30, 30]),
          transformStyle: "preserve-3d"
        } as any} 
        className="relative z-50"
      >
        <div className="w-12 h-12 lg:w-18 lg:h-18 rounded-full bg-white flex items-center justify-center shadow-[0_0_180px_rgba(255,255,255,0.9)] filter-blur-[1px]">
           <div className="w-6 h-6 lg:w-10 lg:h-10 rounded-full bg-white border border-black/10 flex items-center justify-center overflow-hidden">
              <motion.div 
                animate={{ 
                  scale: [0.4, 0.75, 0.4], 
                  opacity: [0.8, 1, 0.8],
                  rotate: [0, 360]
                }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                className="w-5 h-5 rounded-sm bg-black" 
              />
           </div>
        </div>
        <div className="absolute inset-[-120%] rounded-full bg-white/10 blur-3xl -z-10" />
      </motion.div>
    </motion.div>
  );
};

// --- EXPORTED COMPONENT: SentinelCore ---
export const SentinelCore: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const isInView = useInView(containerRef, { margin: "200px" });
  const { isMobile, velX, velY } = useKinetic();
  const time = useTime();
  const { relX, relY } = useRelativeMotion(cardId, containerRef);

  const speed = useTransform([velX, velY], ([vx, vy]) => 
    Math.min(100, Math.sqrt(Math.pow(vx as number, 2) + Math.pow(vy as number, 2)) / 50)
  );

  // Universe Movement Logic: Far grid moves slower/inverse to gazer
  const masterGridX = useTransform(relX, [0, 1], [40, -40]);
  const masterGridY = useTransform(relY, [0, 1], [40, -40]);
  const detailGridX = useTransform(relX, [0, 1], [80, -80]);
  const detailGridY = useTransform(relY, [0, 1], [80, -80]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative group flex items-center justify-center perspective-[4500px] overflow-hidden bg-[#020202] border border-white/10 rounded-[40px] shadow-2xl"
    >
      <TechnicalFilters />
      
      {/* UNIVERSE LAYER 1: Master Grid Underlay (Distal Parallax) */}
      <motion.div 
        style={{
          x: useSpring(masterGridX, { stiffness: 80, damping: 25 }),
          y: useSpring(masterGridY, { stiffness: 80, damping: 25 }),
          opacity: 0.3,
          scale: 1.15
        } as any}
        className="absolute inset-0 pointer-events-none"
      >
         <div className="w-full h-full" style={{ 
           backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.25) 1.5px, transparent 1.5px), linear-gradient(to bottom, rgba(255,255,255,0.25) 1.5px, transparent 1.5px)',
           backgroundSize: '100px 100px'
         }} />
      </motion.div>

      {/* UNIVERSE LAYER 2: Depth Detail Grid (Proximal Parallax) + Scanline */}
      <motion.div 
        style={{
          translateZ: -180,
          x: useSpring(detailGridX, { stiffness: 120, damping: 30 }),
          y: useSpring(detailGridY, { stiffness: 120, damping: 30 }),
          rotateX: useTransform(relY, [0, 1], [15.0, -15.0]), 
          rotateY: useTransform(relX, [0, 1], [-15.0, 15.0]),
          opacity: 0.25,
          scale: 1.25,
          maskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 95%)'
        } as any}
        className="absolute inset-[-60%] pointer-events-none"
      >
         <div className="w-full h-full" style={{ 
           backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)',
           backgroundSize: '40px 40px'
         }} />
         
         {/* Dynamic Scanline Animation Synchronized to Detail Plane */}
         <motion.div 
            animate={{ top: ['-10%', '110%'] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 right-0 h-[4px] bg-white/40 blur-[5px] shadow-[0_0_25px_rgba(255,255,255,0.4)] mix-blend-screen"
         />
      </motion.div>

      {isInView && (
        <SentinelAssembly 
          relX={relX}
          relY={relY}
          isMobile={isMobile}
          time={time}
        />
      )}
      
      {/* HUD Telemetry Overlay */}
      <div className="absolute inset-0 z-[60] p-10 lg:p-14 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black uppercase tracking-widest-3x text-white/90">SYSTEM_CORE_V16</h4>
            <p className="text-[6px] font-mono text-white/50 uppercase tracking-widest pl-0.5">UNIVERSE_PARALLAX_SYNC_ACTIVE</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-[8px] font-mono text-white/50 text-right uppercase tracking-widest tabular-nums font-bold">SPATIAL_SYNC: ENABLED</div>
             <motion.div 
               animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
               className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_15px_white]" 
             />
          </div>
        </div>
        
        <div className="w-full flex justify-between items-end">
          <div className="bg-white/[0.05] border border-white/15 px-10 py-5 rounded-[24px] backdrop-blur-3xl shadow-2xl">
            <span className="text-[7px] font-mono text-white/40 uppercase tracking-widest block mb-1.5">MULTI_PLANAR_SYNC</span>
            <h3 className="text-white font-mono text-[10px] font-black tracking-widest-2x uppercase leading-none">SENTINEL_26_V16_UNIVERSE</h3>
          </div>
          
          <div className="flex gap-2 items-end h-12 pr-6 opacity-30">
            {Array.from({ length: 24 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ height: [2, Math.random() * 32 + 2, 2] }} 
                style={{ 
                   height: useTransform(speed, [0, 100], [2, 45])
                } as any}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.7 + Math.random(), 
                  ease: "easeInOut",
                  delay: i * 0.015 
                }} 
                className="w-[1.2px] bg-white" 
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.96)_100%)]" />
    </div>
  );
};
