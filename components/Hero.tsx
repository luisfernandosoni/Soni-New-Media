
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
        width: `${80 + index * 32}px`,
        height: `${80 + index * 32}px`,
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

  const speed = useTransform([velX, velY], ([vx, vy]: number[]) => 
    Math.min(Math.sqrt(Math.pow(Number(vx || 0), 2) + Math.pow(Number(vy || 0), 2)) / 15, 1)
  );

  const springX = useSpring(relX, { stiffness: 45, damping: 35 });
  const springY = useSpring(relY, { stiffness: 45, damping: 35 });

  const rings = useMemo(() => Array.from({ length: 14 }), []);
  const rotateX = useTransform(springY, [-1, 1], [35, -35]);
  const rotateY = useTransform(springX, [-1, 1], [-35, 35]);

  return (
    <div ref={containerRef} className="w-full h-full relative group flex items-center justify-center perspective-[2500px] overflow-hidden rounded-[64px] bg-accent/[0.02] dark:bg-black/20 border border-accent/5 transition-all duration-700 hover:border-accent/20">
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ y: "-20%" }}
            animate={{ y: "120%" }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
            style={{ left: `${(i + 1) * 8}%`, width: '1px' } as any}
            className="absolute h-48 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
          />
        ))}
      </div>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" } as any} className="relative w-full h-full flex items-center justify-center">
        {rings.map((_, i) => (
          <SentinelRing key={i} index={i} relX={relX} relY={relY} />
        ))}
        <motion.div style={{ translateZ: 150, scale: useTransform(speed, [0, 1], [1, 0.7]), transformStyle: "preserve-3d" } as any} className="relative z-50">
          <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-[0_0_80px_rgba(var(--accent-rgb),0.6)]">
            <motion.div style={{ scale: useTransform(time, (t: number) => 0.4 + Math.sin(t / 600) * 0.15) } as any} className="w-4 h-4 rounded-full bg-background" />
          </div>
          <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 -m-12 bg-accent/30 blur-3xl rounded-full -z-10" />
        </motion.div>
      </motion.div>
      
      <div className="absolute inset-0 z-[60] p-12 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start opacity-50">
          <div className="space-y-2">
            <p className="text-nano uppercase tracking-widest-3x font-bold text-accent italic">SYSTEM_CORE_V2</p>
            <p className="text-[10px] font-mono text-accent/70 uppercase">PROXIMITY_AWARENESS_ACTIVE</p>
          </div>
          <div className="text-[10px] font-mono text-accent text-right uppercase tabular-nums tracking-widest">FPS: 120.0</div>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="bg-accent/[0.03] backdrop-blur-2xl border border-accent/10 px-8 py-5 rounded-2xl relative transition-all hover:bg-accent/10">
            <p className="text-nano uppercase tracking-widest-2x text-accent/40 mb-1 font-black">SENTINEL</p>
            <h3 className="text-accent/90 font-display text-lg font-medium tracking-tight uppercase">SYNK_ORBIT</h3>
          </div>
          <div className="flex gap-1.5 items-end h-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8 + i * 0.1, ease: "easeInOut" }} className="w-[3px] bg-accent/40" />
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
    <section className="relative w-full min-h-screen flex items-center justify-center pt-24 pb-16 lg:pt-32 overflow-hidden bg-background">
       <div className="absolute inset-0 w-full h-full pointer-events-none">
          <AnamorphicStreak />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] h-[90vw] bg-accent/[0.02] blur-[150px] rounded-full" />
       </div>

       <div className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch relative z-10 lg:h-[720px]">
          
          <div className="lg:col-span-7 flex flex-col justify-center text-left py-12 lg:py-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-accent/15 bg-accent/[0.03] backdrop-blur-md self-start"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-ping opacity-60" />
              <span className="text-nano font-black uppercase tracking-widest-3x text-accent/80">
                {t('hero.tag')}
              </span>
            </motion.div>
            
            <div className="relative mb-10 max-w-xl">
              <h1 className="font-display text-h1-fluid font-medium leading-[0.9] tracking-tight text-text">
                <span className="block overflow-hidden pb-1">
                  <motion.span 
                    initial={{ y: "110%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('hero.title1')}
                  </motion.span>
                </span>
                <span className="block overflow-hidden text-secondary/40 italic pb-1">
                   <motion.span 
                    initial={{ y: "110%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {t('hero.title2')}
                  </motion.span>
                </span>
                <span className="block overflow-hidden">
                   <motion.span 
                    initial={{ y: "110%" }} 
                    animate={{ y: "0%" }} 
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
              transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-body-fluid text-secondary max-w-md leading-relaxed mb-12 opacity-80 font-light"
            >
              {t('hero.desc')}
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className="flex flex-wrap items-center gap-8"
            >
              <Magnetic strength={0.3} radius={200}>
                <a href="#work" className="group relative bg-accent text-accent-contrast px-10 py-4 rounded-full font-bold text-label-fluid uppercase tracking-widest-2x hover:scale-105 transition-all duration-700 shadow-[0_20px_60px_rgba(255,255,255,0.1)] overflow-hidden">
                  <span className="relative z-10">{t('hero.btn')}</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </a>
              </Magnetic>

              <Magnetic strength={0.2} radius={150}>
                <button className="px-8 py-4 rounded-full font-bold text-label-fluid uppercase tracking-widest-2x text-text border border-white/10 hover:border-white/40 hover:bg-white/5 transition-all duration-500 flex items-center gap-4 group">
                   <span className="material-icons-outlined text-xl group-hover:scale-125 transition-transform duration-500">play_circle</span>
                   {t('hero.reel')}
                </button>
              </Magnetic>
            </motion.div>
          </div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95, x: 50 }}
             animate={{ opacity: 1, scale: 1, x: 0 }}
             transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
             className="lg:col-span-5 relative"
          >
             <SentinelCore />
          </motion.div>
       </div>
    </section>
  );
};

export default Hero;
