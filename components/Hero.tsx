
import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame, useVelocity, useTime, MotionValue } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Magnetic } from './Magnetic.tsx';

const SentinelRing: React.FC<{ 
  index: number; 
  mouseX: MotionValue<number>; 
  mouseY: MotionValue<number>; 
}> = ({ index, mouseX, mouseY }) => {
  const zDepth = index * -30;
  const ringSpringX = useSpring(mouseX, { stiffness: 60 - index * 3, damping: 25 + index });
  const ringSpringY = useSpring(mouseY, { stiffness: 60 - index * 3, damping: 25 + index });
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
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 25 + index * 3, repeat: Infinity, ease: "linear" }}
      className="absolute border border-accent/80 dark:border-accent/30 rounded-full"
    />
  );
};

const SentinelCore = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const time = useTime();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const xVelocity = useVelocity(mouseX);
  const yVelocity = useVelocity(mouseY);
  const combinedVelocity = useTransform([xVelocity, yVelocity], ([vx, vy]) => 
    Math.min(Math.sqrt(Math.pow(vx as number, 2) + Math.pow(vy as number, 2)) / 15, 1)
  );
  const springX = useSpring(mouseX, { stiffness: 45, damping: 35 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 35 });

  useAnimationFrame(() => {
    const root = document.documentElement;
    const mx = parseFloat(root.style.getPropertyValue('--mouse-x'));
    const my = parseFloat(root.style.getPropertyValue('--mouse-y'));
    if (containerRef.current && !isNaN(mx)) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (mx - (rect.left + rect.width / 2)) / (rect.width / 2);
      const relY = (my - (rect.top + rect.height / 2)) / (rect.height / 2);
      mouseX.set(relX);
      mouseY.set(relY);
    }
  });

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
            style={{ left: `${(i + 1) * 10}%`, width: '1px' }}
            className="absolute h-32 bg-gradient-to-b from-transparent via-accent to-transparent"
          />
        ))}
      </div>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative w-full h-full flex items-center justify-center">
        {rings.map((_, i) => (
          <SentinelRing key={i} index={i} mouseX={mouseX} mouseY={mouseY} />
        ))}
        <motion.div style={{ translateZ: 100, scale: useTransform(combinedVelocity, [0, 1], [1, 0.85]), transformStyle: "preserve-3d" }} className="relative z-50">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center shadow-[0_0_60px_rgba(var(--accent-rgb),0.5)]">
            <motion.div style={{ scale: useTransform(time, t => 0.4 + Math.sin(t / 600) * 0.12) }} className="w-3.5 h-3.5 rounded-full bg-background" />
          </div>
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.1, 0.2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 -m-8 bg-accent/20 blur-2xl rounded-full -z-10" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 z-[60] p-10 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start opacity-60">
          <div className="space-y-1">
            <p className="text-[8px] uppercase tracking-[0.4em] font-bold text-accent italic">Status // Operational</p>
            <p className="text-[7px] font-mono text-accent">X-RAY_KINETIC_ALPHA</p>
          </div>
          <div className="text-[7px] font-mono text-accent text-right">UPTIME: 0.9999</div>
        </div>
        <div className="w-full flex justify-between items-end">
          <div className="bg-accent/5 backdrop-blur-md border border-accent/10 px-5 py-3 rounded-xl overflow-hidden relative transition-colors hover:bg-accent/10">
            <p className="text-[7px] uppercase tracking-[0.3em] text-accent/50 mb-1 font-bold">Kinetic_Drive</p>
            <h3 className="text-accent/90 font-display text-xs font-medium tracking-tight uppercase">Sentinel_VII</h3>
          </div>
          <div className="flex gap-1 items-end h-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} animate={{ height: [2, 10, 2] }} transition={{ repeat: Infinity, duration: 1 + i * 0.1, ease: "easeInOut" }} className="w-[1.5px] bg-accent/40" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { t, language } = useLanguage();
  
  // SHARED HEIGHT CONSTANT - Adjusted for 2026 aesthetics (Lower profile)
  const sharedHeight = "580px";

  return (
    <section className="relative pt-24 pb-16 lg:pt-40 lg:pb-24 overflow-hidden px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 lg:items-stretch">
        
        {/* TEXT CONTENT - Balanced and Responsive */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
          className="relative z-20 flex flex-col justify-between lg:h-[580px] py-2"
        >
          {/* TOP: Tag */}
          <div className="mb-8 lg:mb-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full border border-accent/10 bg-accent/[0.03]">
              <div className="relative w-1.5 h-1.5"><div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-40" /><div className="relative w-full h-full bg-accent rounded-full" /></div>
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-accent/50">{t('hero.tag')}</span>
            </motion.div>
          </div>

          {/* MIDDLE: Fluid Title & Description */}
          <div className="space-y-6 lg:space-y-8">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={language} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
                /* Using fluid typography with clamp for perfect scaling */
                className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-medium tracking-tighter leading-[0.95] text-text"
              >
                {t('hero.title1')}<br />{t('hero.title2')}<br />
                <span className="text-text/20 block mt-4 font-light italic text-[clamp(1.5rem,4vw,3rem)] tracking-normal">{t('hero.title3')}</span>
              </motion.h1>
            </AnimatePresence>
            <p className="text-sm md:text-base text-secondary max-w-sm font-light leading-relaxed tracking-tight opacity-80">
              {t('hero.desc')}
            </p>
          </div>

          {/* BOTTOM: CTAs */}
          <div className="flex flex-wrap items-center gap-8 pt-8 lg:pt-0 relative z-30">
            <Magnetic strength={0.1} radius={200}>
              <a href="#work" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-accent px-8 transition-all duration-500 hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-3 text-[9px] tracking-[0.4em] uppercase font-bold text-accent-contrast">
                  {t('hero.btn')}
                  <span className="material-icons-outlined text-sm">north_east</span>
                </span>
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2} radius={100}>
              <button className="group flex items-center gap-4 text-[9px] font-bold uppercase tracking-[0.4em] text-secondary hover:text-text transition-all">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-accent/10 group-hover:border-accent">
                  <span className="material-icons-outlined text-base">play_arrow</span>
                </div>
                {t('hero.reel')}
              </button>
            </Magnetic>
          </div>
        </motion.div>

        {/* VISUAL CONTENT - The Reduced Anchor Box */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 1.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }} 
          className="relative h-[450px] w-full lg:h-[580px] flex items-center justify-center z-10"
        >
          <SentinelCore />
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
