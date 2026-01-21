
import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useTime, useMotionValue, MotionValue, AnimatePresence, useInView, useMotionTemplate } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useKinetic, useRelativeMotion } from '../context/KineticContext.tsx';
import { Magnetic } from './Magnetic.tsx';

// --- COMPONENT: AnamorphicStreak ---
const AnamorphicStreak = () => {
  const { mouseX } = useKinetic();
  const xTransform = useTransform(mouseX, [0, window.innerWidth], ["-10%", "10%"]);
  const springX = useSpring(xTransform, { stiffness: 40, damping: 20 });

  return (
    <motion.div 
      style={{ x: springX } as any}
      className="absolute top-1/2 left-0 w-[120%] h-[1px] bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-y-1/2 pointer-events-none blur-[1px] z-[1]"
    />
  );
};

// --- COMPONENT: SentinelRing (Advanced 3D Lateral Engine) ---
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
  // Scaling re-calibrated for big screens
  const baseDepth = isMobile ? 12 : 35; 
  const baseSize = isMobile ? 40 : 120;
  const sizeStep = isMobile ? 12 : 45;
  
  const zDepth = index * -baseDepth;

  // PHYSICS: Lag and Follower logic to create the "side view" trail
  const springConfig = useMemo(() => ({ 
    stiffness: 120 - (index * 4), 
    damping: 40 + (index * 2),   
    mass: 1 + (index * 0.1),    
  }), [index]);

  const ringSpringX = useSpring(relX, springConfig);
  const ringSpringY = useSpring(relY, springConfig);
  
  // LATERAL PERSPECTIVE: Multiplier increases with depth (outer rings follow more)
  const driftMultiplier = index * 40;
  
  const tx = useTransform(ringSpringX, [0, 1], [-driftMultiplier, driftMultiplier]);
  const ty = useTransform(ringSpringY, [0, 1], [-driftMultiplier * 0.5, driftMultiplier * 0.5]);

  // ROTATION: Correcting the ring angle to look "at" the focus point
  const rotateIntensity = 35 + (index * 4);
  const rX = useTransform(ringSpringY, [0, 1], [rotateIntensity, -rotateIntensity]);
  const rY = useTransform(ringSpringX, [0, 1], [-rotateIntensity, rotateIntensity]);

  const opacity = useTransform(useMotionValue(index), (i) => 
    0.7 - (i / totalRings) * 0.6
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
      } as any}
      className="absolute flex items-center justify-center will-change-transform"
    >
      <div 
        className="w-full h-full rounded-full border border-white/5 relative"
        style={{
          boxShadow: `0 0 100px rgba(255, 255, 255, 0.01)`,
        }}
      >
        <motion.div 
          className="w-full h-full rounded-full"
          style={{
            boxShadow: `inset 0 0 0 1px rgba(255, 255, 255, ${0.12 - (index * 0.004)})`,
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
  const ringCount = isMobile ? 10 : 22; 
  const rings = useMemo(() => Array.from({ length: ringCount }), [ringCount]);

  // Dynamic Perspective Origin shift for lateral feel
  const perspectiveX = useTransform(relX, [0, 1], ["40%", "60%"]);
  const perspectiveY = useTransform(relY, [0, 1], ["40%", "60%"]);
  const perspectiveOrigin = useMotionTemplate`${perspectiveX} ${perspectiveY}`;

  return (
    <motion.div 
      style={{ 
        transformStyle: "preserve-3d",
        perspectiveOrigin: perspectiveOrigin
      } as any} 
      className="relative w-full h-full flex items-center justify-center"
    >
      {/* Background Neural Lines */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute h-full w-[1px] bg-white" style={{ left: `${(i + 1) * 3.33}%` }} />
        ))}
      </div>

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
      
      {/* Core Focal Orb - Higher contrast and perspective response */}
      <motion.div 
        style={{ 
          translateZ: isMobile ? 50 : 180, 
          x: useTransform(relX, [0, 1], [-120, 120]),
          y: useTransform(relY, [0, 1], [-80, 80]),
          transformStyle: "preserve-3d"
        } as any} 
        className="relative z-50 scale-[1.5]"
      >
        <div className="w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white flex items-center justify-center shadow-[0_0_120px_rgba(255,255,255,0.7)]">
          <motion.div 
            style={{ 
              scale: useTransform(time, (t: number) => 0.25 + Math.sin(t / 800) * 0.08),
              opacity: useTransform(time, (t: number) => 0.7 + Math.sin(t / 800) * 0.3)
            } as any} 
            className="w-4 h-4 rounded-full bg-background" 
          />
        </div>
        
        <motion.div 
          animate={{ opacity: [0.3, 0.1, 0.3] }} 
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute inset-0 -m-16 lg:-m-24 bg-white/20 blur-[80px] rounded-full -z-10" 
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
      className="w-full h-full min-h-[600px] lg:min-h-0 aspect-square lg:aspect-auto relative group flex items-center justify-center perspective-[2500px] overflow-hidden rounded-[80px] bg-black border border-white/5 transition-all duration-1000"
    >
      {isInView && (
        <SentinelAssembly 
          relX={relX}
          relY={relY}
          isMobile={isMobile}
          time={time}
        />
      )}
      
      {/* HUD UI - Enhanced visibility and sizing */}
      <div className="absolute inset-0 z-[60] p-12 lg:p-20 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-[9px] lg:text-nano uppercase tracking-widest-3x font-black text-white">SYSTEM_CORE_V3</p>
            <p className="text-[7px] lg:text-[10px] font-mono text-white/30 uppercase tracking-widest">PERSPECTIVE_MATRIX_ENGAGED</p>
          </div>
          <div className="text-[9px] lg:text-nano font-mono text-white/40 text-right uppercase tracking-widest tabular-nums font-bold">FPS: 120.0</div>
        </div>
        
        <div className="w-full flex justify-between items-end">
          <div className="bg-[#0A0A0A]/80 backdrop-blur-md border border-white/10 px-10 py-8 rounded-3xl shadow-2xl">
            <p className="text-[8px] lg:text-[10px] uppercase tracking-widest-3x text-white/30 mb-2 font-black">SENTINEL</p>
            <h3 className="text-white font-mono text-base lg:text-xl font-black tracking-[0.2em] uppercase leading-none">SYNK_ORBIT_A1</h3>
          </div>
          <div className="flex gap-2 items-end h-10 lg:h-16 opacity-50 pr-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} animate={{ height: [4, 24, 4] }} transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: "easeInOut" }} className="w-[2px] bg-white" />
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
    <section className="relative w-full min-h-screen flex items-center justify-center pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-background">
       <div className="absolute inset-0 w-full h-full pointer-events-none">
          <AnamorphicStreak />
       </div>

       {/* max-w-8xl for expansive feel on wide screens */}
       <div className="max-w-8xl w-full mx-auto px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 items-center relative z-10 gap-20 lg:gap-16">
          
          <div className="lg:col-span-5 flex flex-col justify-center text-left py-4 lg:py-0 h-full lg:pr-10">
            {/* Tag Card */}
            <div className="relative mb-10 lg:mb-16">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={language} 
                  {...variant} 
                  transition={transition}
                >
                  <div className="inline-flex items-center gap-6 px-8 py-3 rounded-full bg-[#121212] border border-white/10 self-start">
                    <span className="text-[10px] lg:text-nano font-black uppercase tracking-widest-3x text-white">
                      {t('hero.tag')}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Headline with aggressive typography */}
            <div className="relative mb-12 lg:mb-20">
              <AnimatePresence mode="wait">
                <motion.div
                  key={language}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
                >
                  <h1 className="font-display text-h1-fluid font-medium leading-[0.88] tracking-tighter text-text">
                    <span className="block">{t('hero.title1')}</span>
                    <span className="block text-secondary italic mb-2">{t('hero.title2')}</span>
                    <span className="block">{t('hero.title3')}</span>
                  </h1>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative mb-16 lg:mb-24 min-h-[4em]">
              <AnimatePresence mode="wait">
                <motion.p 
                  key={language} 
                  {...variant} 
                  transition={transition}
                  className="text-body-fluid text-secondary max-w-lg leading-relaxed opacity-70 font-light"
                >
                  {t('hero.desc')}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex flex-wrap items-center gap-10">
              <Magnetic strength={0.15} radius={250}>
                <motion.a 
                  href="#work" 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative bg-white text-black px-16 lg:px-20 py-6 lg:py-8 rounded-full font-black text-[11px] lg:text-label-fluid uppercase tracking-widest-3x transition-all duration-700 flex items-center justify-center w-full sm:w-auto overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:shadow-[0_30px_80px_rgba(255,255,255,0.2)]"
                >
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

              <Magnetic strength={0.08} radius={200}>
                <motion.button 
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  className="px-14 lg:px-16 py-6 lg:py-8 rounded-full font-black text-[11px] lg:text-label-fluid uppercase tracking-widest-3x text-text border border-white/20 transition-all duration-700 flex items-center gap-8 group w-full sm:w-auto justify-center"
                >
                  <span className="material-icons-outlined text-2xl opacity-60 group-hover:opacity-100 transition-opacity">play_circle</span>
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
             initial={{ opacity: 0, scale: 0.9, x: 50 }}
             animate={{ opacity: 1, scale: 1, x: 0 }}
             transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const }}
             className="lg:col-span-7 relative flex items-center justify-center w-full h-[600px] lg:h-[800px]"
          >
             <SentinelCore />
          </motion.div>
       </div>
    </section>
  );
};

export default Hero;
