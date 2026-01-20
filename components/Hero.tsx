
import React, { useRef, useMemo } from 'react';
import { motion, useSpring, useTransform, useTime, MotionValue } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useKinetic } from '../context/KineticContext.tsx';
import { Magnetic } from './Magnetic.tsx';

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

const SentinelRing: React.FC<{ 
  index: number; 
  relX: MotionValue<number>; 
  relY: MotionValue<number>; 
}> = ({ index, relX, relY }) => {
  const zDepth = index * -30;
  const ringSpringX = useSpring(relX, { stiffness: 60 - index * 3, damping: 25 + index });
  const ringSpringY = useSpring(relY, { stiffness: 60 - index * 3, damping: 25 + index });
  const rX = useTransform(ringSpringY, [-1, 1], [45, -45]);
  const rY = useTransform(ringSpringX, [-1, 1], [-45, 45]);

  return (
    <motion.div
      style={{
        width: `${60 + index * 24}px`,
        height: `${60 + index * 24}px`,
        rotateX: rX,
        rotateY: rY,
        translateZ: zDepth,
        opacity: 0.9 - (index * 0.05),
      } as any}
      animate={{ rotate: 360 }}
      transition={{ duration: 25 + index * 3, repeat: Infinity, ease: "linear" }}
      className="absolute border border-accent/80 dark:border-accent/30 rounded-full"
    />
  );
};

const SentinelCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mouseX, mouseY, velX, velY } = useKinetic();
  const time = useTime();

  const relX = useTransform(mouseX, (x: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return (x - (rect.left + rect.width / 2)) / (rect.width / 2);
  });
  const relY = useTransform(mouseY, (y: number) => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    return (y - (rect.top + rect.height / 2)) / (rect.height / 2);
  });

  // FIX: Strictly typed array destructuring for speed calculation
  const speed = useTransform([velX, velY], ([vx, vy]: number[]) => 
    Math.min(Math.sqrt(Math.pow(Number(vx || 0), 2) + Math.pow(Number(vy || 0), 2)) / 15, 1)
  );

  const springX = useSpring(relX, { stiffness: 45, damping: 35 });
  const springY = useSpring(relY, { stiffness: 45, damping: 35 });

  const rings = useMemo(() => Array.from({ length: 12 }), []);
  const rotateX = useTransform(springY, [-1, 1], [35, -35]);
  const rotateY = useTransform(springX, [-1, 1], [-35, 35]);

  return (
    <div ref={containerRef} className="w-full h-full relative group flex items-center justify-center perspective-[2500px] overflow-hidden rounded-[48px] bg-accent/[0.04] dark:bg-black/20 border border-accent/10 transition-colors duration-500">
      <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.1] pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: "-20%" }}
            animate={{ y: "120%" }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            style={{ left: `${(i + 1) * 10}%`, width: '1px' } as any}
            className="absolute h-32 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        ))}
      </div>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" } as any} className="relative w-full h-full flex items-center justify-center">
        {rings.map((_, i) => (
          <SentinelRing key={i} index={i} relX={relX} relY={relY} />
        ))}
        <motion.div style={{ translateZ: 100, scale: useTransform(speed, [0, 1], [1, 0.85]), transformStyle: "preserve-3d" } as any} className="relative z-50">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-[0_0_60px_rgba(var(--accent-rgb),0.5)]">
            <motion.div style={{ scale: useTransform(time, (t: number) => 0.4 + Math.sin(t / 600) * 0.12) } as any} className="w-3.5 h-3.5 rounded-full bg-background" />
          </div>
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.1, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 -m-8 bg-accent/20 blur-2xl rounded-full -z-10" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 z-[60] p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start opacity-70">
          <div className="space-y-1.5">
            <p className="text-nano uppercase tracking-widest-2x font-semibold text-accent italic">Status // Operational</p>
            <p className="text-nano font-mono text-accent/90 uppercase">KINETIC_SYNC_v2</p>
          </div>
          <div className="text-nano font-mono text-accent text-right uppercase">LATENCY: 0.00ms</div>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="bg-accent/5 backdrop-blur-md border border-accent/10 px-6 py-4 rounded-xl overflow-hidden relative transition-colors hover:bg-accent/10">
            <p className="text-nano uppercase tracking-widest-2x text-accent/50 mb-1.5 font-bold">Kinetic_Drive</p>
            <h3 className="text-accent/95 font-display text-base font-medium tracking-tight uppercase">Sentinel_Sync</h3>
          </div>
          <div className="flex gap-2 items-end h-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 1 + i * 0.1, ease: "easeInOut" }} className="w-[2.5px] bg-accent/50" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-background">
       {/* Background Elements */}
       <div className="absolute inset-0 w-full h-full pointer-events-none">
          <AnamorphicStreak />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-accent/[0.03] blur-[120px] rounded-full mix-blend-screen" />
       </div>

       <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/[0.05] backdrop-blur-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-nano font-bold uppercase tracking-widest-3x text-accent">
                {t('hero.tag')}
              </span>
            </motion.div>
            
            <div className="relative mb-10">
              <h1 className="font-display text-h1-fluid font-medium leading-[0.9] tracking-tight text-text mix-blend-difference">
                <span className="block overflow-hidden">
                  <motion.span 
                    initial={{ y: "100%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('hero.title1')}
                  </motion.span>
                </span>
                <span className="block overflow-hidden text-secondary/60">
                   <motion.span 
                    initial={{ y: "100%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('hero.title2')}
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                   <motion.span 
                    initial={{ y: "100%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('hero.title3')}
                  </motion.span>
                </span>
              </h1>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-h3-fluid text-secondary font-light max-w-xl leading-relaxed mb-12"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
               className="flex flex-wrap items-center gap-6"
            >
              <Magnetic strength={0.3}>
                <a href="#work" className="bg-accent text-accent-contrast px-8 py-4 rounded-full font-bold text-label-fluid uppercase tracking-widest-2x hover:shadow-[0_0_40px_rgba(var(--accent-rgb),0.4)] transition-all duration-500">
                  {t('hero.btn')}
                </a>
              </Magnetic>

              <Magnetic strength={0.2}>
                <button className="px-8 py-4 rounded-full font-bold text-label-fluid uppercase tracking-widest-2x text-text border border-border hover:bg-text hover:text-background transition-all duration-500 flex items-center gap-3 group">
                   <span className="material-icons-outlined text-lg group-hover:scale-110 transition-transform">play_circle</span>
                   {t('hero.reel')}
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* Visual Content - Sentinel Core */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
             animate={{ opacity: 1, scale: 1, rotateX: 0 }}
             transition={{ duration: 1.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
             className="lg:col-span-5 relative aspect-square"
          >
             <SentinelCore />
          </motion.div>
       </div>
    </section>
  );
};

export default Hero;
