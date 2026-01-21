
import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useTime, useMotionValue, MotionValue, AnimatePresence, useInView, useMotionTemplate } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useKinetic, useRelativeMotion } from '../context/KineticContext.tsx';
import { Magnetic } from './Magnetic.tsx';

// --- COMPONENT: AnamorphicStreak ---
const AnamorphicStreak = () => {
  const { mouseX } = useKinetic();
  const xTransform = useTransform(mouseX, [0, window.innerWidth], ["-20%", "20%"]);
  const springX = useSpring(xTransform, { stiffness: 40, damping: 20 });

  return (
    <motion.div 
      style={{ x: springX } as any}
      className="absolute top-1/2 left-0 w-[200%] h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent -translate-y-1/2 pointer-events-none blur-[2px] z-[1]"
    />
  );
};

// --- COMPONENT: SentinelRing (Orbital 3D Engine) ---
const SentinelRing = React.memo(({ 
  index, 
  relX, 
  relY, 
  isMobile,
  totalRings
}: { 
  index: number; 
  relX: MotionValue<number>; 
  relY: MotionValue<number>;
  isMobile: boolean;
  totalRings: number;
}) => {
  // GEOMETRIC STACKING
  const baseDepth = isMobile ? 14 : 28;
  const baseSize = isMobile ? 38 : 68;
  const sizeStep = isMobile ? 24 : 42;
  
  // DEPTH: Linear stagger along Z axis (creates the cone "body")
  const zDepth = index * -baseDepth;

  // PHYSICS: Ultra-smooth inertial tracking
  const springConfig = useMemo(() => ({ 
    stiffness: 110 - (index * 4.5), 
    damping: 38 + (index * 1.6),   
    mass: 0.7 + (index * 0.1),    
    restDelta: 0.0001,
  }), [index]);

  const ringSpringX = useSpring(relX, springConfig);
  const ringSpringY = useSpring(relY, springConfig);
  
  // THE ORBITAL TILT: 
  // We calculate rotation based on the cursor position. 
  // Outer rings (higher index) tilt significantly more than inner rings.
  const rotationIntensity = 45 + (index * 12); 
  const rX = useTransform(ringSpringY, [0, 1], [rotationIntensity, -rotationIntensity]);
  const rY = useTransform(ringSpringX, [0, 1], [-rotationIntensity, rotationIntensity]);
  
  // THE SPATIAL FOLLOW:
  // Rings track the cursor, but displacement decreases with depth to maintain cone focus.
  const followIntensity = useTransform(useMotionValue(index), (i) => 
    Math.max(0.15, 1 - (i / totalRings) * 0.9)
  );
  
  const moveRange = isMobile ? 35 : 75;
  const tx = useTransform([ringSpringX, followIntensity], ([x, intensity]) => 
    ((x as number) - 0.5) * moveRange * (intensity as number)
  );
  const ty = useTransform([ringSpringY, followIntensity], ([y, intensity]) => 
    ((y as number) - 0.5) * moveRange * (intensity as number)
  );

  // OPTICAL DEPTH: Atmospheric falloff
  const opacity = useTransform(useMotionValue(index), (i) => 
    isMobile ? 0.95 - (i / totalRings) * 0.85 : 0.9 - (i / totalRings) * 0.7
  );

  return (
    <motion.div
      style={{
        width: `${baseSize + index * sizeStep}px`,
        height: `${baseSize + index * sizeStep}px`,
        rotateX: rX,
        rotateY: rY,
        x: tx,
        y: ty,
        translateZ: zDepth,
        opacity,
        transformStyle: "preserve-3d",
        perspective: "2500px" // Internal perspective for the ring border thickness feel
      } as any}
      className="absolute flex items-center justify-center will-change-transform"
    >
      <div 
        className="w-full h-full rounded-full border border-accent/10 relative"
        style={{
          boxShadow: `0 0 40px rgba(var(--accent-rgb), 0.02)`,
          background: `radial-gradient(circle at center, transparent 97%, rgba(var(--accent-rgb), 0.08) 100%)`
        }}
      >
        <motion.div 
          className="w-full h-full rounded-full animate-spin"
          style={{
            animationDuration: `${35 + index * 12}s`,
            animationDirection: index % 2 === 0 ? 'normal' : 'reverse',
            animationTimingFunction: 'linear',
            boxShadow: `inset 0 0 0 1px rgba(var(--accent-rgb), 0.15)`,
          }}
        />
      </div>
    </motion.div>
  );
});

// --- COMPONENT: SentinelAssembly ---
const SentinelAssembly: React.FC<{
  relX: MotionValue<number>;
  relY: MotionValue<number>;
  isMobile: boolean;
  time: MotionValue<number>;
}> = ({ relX, relY, isMobile, time }) => {
  const ringCount = isMobile ? 8 : 14;
  const rings = useMemo(() => Array.from({ length: ringCount }), [ringCount]);

  return (
    <motion.div 
      style={{ transformStyle: "preserve-3d" } as any} 
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Background Ambience Layer */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div 
            key={i}
            className="absolute h-full w-[1px] bg-accent"
            style={{ left: `${(i + 1) * 5.5}%` } as any}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 6, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>

      {/* The Kinetic Orbital assembly */}
      {rings.map((_, i) => (
        <SentinelRing 
          key={`ring-${i}`} 
          index={i} 
          relX={relX} 
          relY={relY} 
          isMobile={isMobile}
          totalRings={ringCount}
        />
      ))}
      
      {/* Core Orb (Cone Apex) */}
      <motion.div 
        style={{ 
          translateZ: isMobile ? 30 : 100, 
          x: useTransform(relX, [0, 1], [-45, 45]),
          y: useTransform(relY, [0, 1], [-45, 45]),
          transformStyle: "preserve-3d"
        } as any} 
        className="relative z-50"
      >
        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-full bg-accent flex items-center justify-center shadow-[0_0_120px_rgba(var(--accent-rgb),0.8)]">
          <motion.div 
            style={{ 
              scale: useTransform(time, (t: number) => 0.25 + Math.sin(t / 800) * 0.05),
              opacity: useTransform(time, (t: number) => 0.7 + Math.sin(t / 800) * 0.3)
            } as any} 
            className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-background" 
          />
        </div>
        
        {/* Volumetric Radial Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.05, 0.3] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute inset-0 -m-12 lg:-m-20 bg-accent/35 blur-3xl rounded-full -z-10" 
        />
      </motion.div>
    </motion.div>
  );
};

// --- COMPONENT: SentinelCore ---
const SentinelCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const isInView = useInView(containerRef, { margin: "200px" });
  
  const { isMobile } = useKinetic();
  const time = useTime();
  const { relX, relY } = useRelativeMotion(cardId, containerRef);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full min-h-[520px] lg:min-h-0 aspect-square lg:aspect-auto relative group flex items-center justify-center perspective-[4000px] overflow-hidden rounded-[72px] lg:rounded-[120px] bg-accent/[0.003] border border-accent/5 transition-all duration-1000 hover:border-accent/15"
    >
      {isInView && (
        <SentinelAssembly 
          relX={relX}
          relY={relY}
          isMobile={isMobile}
          time={time}
        />
      )}
      
      {/* HUD UI Elements */}
      <div className="absolute inset-0 z-[60] p-14 lg:p-24 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start opacity-15">
          <div className="space-y-1 lg:space-y-2">
            <p className="text-[6px] lg:text-nano uppercase tracking-widest-3x font-black text-accent italic">ORBIT_CORE_V7.2</p>
            <p className="text-[5px] lg:text-[9px] font-mono text-accent/40 uppercase">SPATIAL_SYNC_ENABLED</p>
          </div>
          <div className="text-[6px] lg:text-[9px] font-mono text-accent text-right uppercase tracking-widest tabular-nums font-black">LATENCY: NULL</div>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="bg-accent/[0.005] backdrop-blur-3xl border border-accent/5 px-10 py-6 lg:px-16 lg:py-14 rounded-[60px] relative transition-all hover:bg-accent/[0.03] hover:border-accent/15">
            <p className="text-[6px] lg:text-nano uppercase tracking-widest-2x text-accent/10 mb-4 font-black">SENTINEL_VII</p>
            <h3 className="text-accent font-display text-xl lg:text-5xl font-medium tracking-tighter uppercase leading-none">ORBITAL</h3>
          </div>
          <div className="flex gap-4 items-end h-12 lg:h-20">
            {Array.from({ length: 16 }).map((_, i) => (
              <motion.div key={i} animate={{ height: [4, 50, 4] }} transition={{ repeat: Infinity, duration: 0.7 + i * 0.05, ease: "easeInOut" }} className="w-[1px] lg:w-[1.5px] bg-accent/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- COMPONENT: Hero ---
const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  
  const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };
  const variant = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 lg:pt-32 overflow-hidden bg-background">
       <div className="absolute inset-0 w-full h-full pointer-events-none">
          <AnamorphicStreak />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-accent/[0.005] blur-[220px] rounded-full" />
       </div>

       <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10 lg:h-[880px] gap-12 lg:gap-0">
          
          <div className="lg:col-span-5 flex flex-col justify-center text-left py-4 lg:py-0 h-full lg:pr-32">
            <div className="relative mb-6 lg:mb-18 min-h-[30px] lg:min-h-[40px]">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={language} 
                  {...variant} 
                  transition={transition}
                >
                  <div className="inline-flex items-center gap-6 px-10 py-4.5 rounded-full border border-accent/10 bg-accent/[0.04] backdrop-blur-2xl self-start">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_20px_white]" />
                    <span className="text-[9px] lg:text-nano font-black uppercase tracking-widest-3x text-accent/90">
                      {t('hero.tag')}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="relative mb-12 lg:mb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <h1 className="font-display text-h1-fluid font-medium leading-[0.82] tracking-tighter text-text">
                    <span className="block pb-3">{t('hero.title1')}</span>
                    <span className="block text-secondary/10 italic pb-3">{t('hero.title2')}</span>
                    <span className="block">{t('hero.title3')}</span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mb-20 lg:mb-28 min-h-[4.5em]">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={language} 
                  {...variant} 
                  transition={transition}
                  className="text-body-fluid text-secondary max-w-sm leading-relaxed opacity-35 font-light italic"
                >
                  {t('hero.desc')}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-6 lg:gap-16">
              <Magnetic strength={0.18} radius={280}>
                <motion.a 
                  href="#work" 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative bg-accent text-accent-contrast px-18 lg:px-24 py-6 lg:py-9 rounded-full font-bold text-[10px] lg:text-label-fluid uppercase tracking-widest-2x transition-all duration-700 shadow-2xl hover:shadow-accent/5 flex items-center justify-center w-full sm:w-auto overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={language} 
                      {...variant} 
                      transition={transition}
                      className="relative z-10 block"
                    >
                      {t('hero.btn')}
                    </motion.span>
                  </AnimatePresence>
                </motion.a>
              </Magnetic>

              <Magnetic strength={0.1} radius={240}>
                <motion.button 
                  whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.02)' }}
                  className="px-14 lg:px-20 py-6 lg:py-9 rounded-full font-bold text-[10px] lg:text-label-fluid uppercase tracking-widest-2x text-text border border-white/5 transition-all duration-700 flex items-center gap-10 group w-full sm:w-auto justify-center"
                >
                  <span className="material-icons-outlined text-2xl lg:text-3xl group-hover:rotate-[15deg] transition-transform duration-1000 ease-out">play_circle</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={language} 
                      {...variant} 
                      transition={transition}
                      className="block"
                    >
                      {t('hero.reel')}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </Magnetic>
            </div>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.85, x: 120 }}
             whileInView={{ opacity: 1, scale: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 2.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
             className="lg:col-span-7 relative h-auto lg:h-full flex items-center justify-center lg:justify-start"
          >
             <SentinelCore />
          </motion.div>
       </div>
    </section>
  );
};

export default Hero;
