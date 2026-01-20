
import React, { useRef } from 'react';
import { motion, useTime, useTransform, useSpring, useMotionTemplate, AnimatePresence } from 'motion/react';
import { ServiceItem } from '../types.ts';
import { useRelativeMotion } from '../context/KineticContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface ServiceCardProps {
  item?: ServiceItem;
  index: number;
  isCTA?: boolean;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaBtn?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  item, 
  index, 
  isCTA = false,
  ctaTitle,
  ctaDesc,
  ctaBtn
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const time = useTime();
  const { relX, relY, isOver } = useRelativeMotion(containerRef);
  const { language } = useLanguage();

  const springConfig = { 
    stiffness: 180, 
    damping: 35, 
    mass: 1.2,
    restDelta: 0.001 
  };
  
  const activeX = useTransform([isOver, relX], ([over, rX]: number[]) => (over === 1 ? rX : 0.5));
  const activeY = useTransform([isOver, relY], ([over, rY]: number[]) => (over === 1 ? rY : 0.5));

  const smoothX = useSpring(activeX, springConfig);
  const smoothY = useSpring(activeY, springConfig);

  // Constraints: Rotation degrees remain untouched (10 / -10)
  const rotateX = useTransform(smoothY, [0, 1], [10, -10]);
  const rotateY = useTransform(smoothX, [0, 1], [-10, 10]);
  
  // Parallax Tiers: High-relief separation values from previous v3 audit
  const tier1X = useTransform(smoothX, [0, 1], [32, -32]);
  const tier1Y = useTransform(smoothY, [0, 1], [32, -32]);
  
  const tier2X = useTransform(smoothX, [0, 1], [18, -18]);
  const tier2Y = useTransform(smoothY, [0, 1], [18, -18]);
  
  const tier3X = useTransform(smoothX, [0, 1], [10, -10]);
  const tier3Y = useTransform(smoothY, [0, 1], [10, -10]);

  const idleBreathe = useTransform(time, (t: number) => 1 + Math.sin((t + index * 500) / 4000) * 0.003);
  const transform = useMotionTemplate`rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${idleBreathe})`;

  const lightX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const lightY = useTransform(smoothY, [0, 1], ["0%", "100%"]);

  const theme = isCTA ? {
    container: "text-black",
    bg: "bg-white",
    subtext: "text-black/60",
    shadow: "hover:shadow-[0_80px_160px_rgba(255,255,255,0.18)]"
  } : {
    container: "text-white",
    bg: "bg-white/[0.04] backdrop-blur-3xl",
    subtext: "text-white/60",
    shadow: "hover:shadow-[0_50px_120px_rgba(0,0,0,0.5)]"
  };

  const textVariant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };
  
  const textTransition = { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div
      ref={containerRef}
      className="relative h-[460px] group" // Optimized height from 540px
      style={{ perspective: 2000 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
        style={{ 
          transform,
          transformStyle: 'preserve-3d',
          willChange: 'transform'
        } as any}
        className={`relative w-full h-full p-10 lg:p-12 rounded-[48px] border border-white/10 flex flex-col ${theme.container} ${theme.shadow} transition-shadow duration-700`}
      >
        <div 
          className={`absolute inset-0 rounded-[48px] pointer-events-none ${theme.bg}`}
          style={{ transform: 'translateZ(0px)' } as any}
        />

        <motion.div 
          style={{ 
            background: useTransform(
              [lightX, lightY], 
              ([lx, ly]: any[]) => isCTA 
                ? `radial-gradient(800px circle at ${lx} ${ly}, rgba(0,0,0,0.06), transparent 75%)`
                : `radial-gradient(1000px circle at ${lx} ${ly}, rgba(255,255,255,0.18), transparent 60%)`
            ),
            transform: 'translateZ(10px)',
            mixBlendMode: isCTA ? 'multiply' : 'overlay',
            opacity: useTransform(isOver, (over: number) => over === 1 ? 1 : 0)
          } as any}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500 rounded-[48px]"
        />

        <motion.div 
          style={{ 
            x: tier1X, 
            y: tier1Y, 
            translateZ: 165,
            transformStyle: 'preserve-3d'
          } as any}
          className="flex justify-between items-start relative z-10 h-20 lg:h-24 mb-4 pointer-events-none"
        >
          {isCTA ? (
            <span className="text-nano font-mono font-bold text-black/25 tracking-widest-2x uppercase pt-2">
              End_Sequence
            </span>
          ) : (
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:border-white group-hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all duration-1000 shadow-2xl">
              <span className="material-icons-outlined text-2xl lg:text-3xl text-white group-hover:text-black transition-colors duration-700 select-none">
                {item?.icon}
              </span>
            </div>
          )}
          <span className={`text-nano font-mono font-bold tracking-widest-2x uppercase pt-2 transition-colors duration-700 ${isCTA ? 'text-black/15' : 'text-white/40 group-hover:text-white/80'}`}>
            {isCTA ? '///' : item?.number}
          </span>
        </motion.div>

        <motion.div 
          style={{ 
            x: tier2X, 
            y: tier2Y, 
            translateZ: 105,
            transformStyle: 'preserve-3d'
          } as any}
          className={`relative z-10 flex-grow flex flex-col pointer-events-none ${isCTA ? 'items-center text-center' : ''}`}
        >
          <div className="min-h-[2.2em] mb-4 w-full relative">
            <AnimatePresence mode="wait">
              <motion.h3 
                key={language}
                {...textVariant}
                transition={textTransition}
                className="text-card-title-fluid font-display font-medium leading-[1.1] tracking-tight w-full"
              >
                {isCTA ? ctaTitle : item?.title}
              </motion.h3>
            </AnimatePresence>
          </div>
          
          <motion.div style={{ x: tier3X, y: tier3Y, translateZ: 55 } as any} className="relative min-h-[3em]">
            <AnimatePresence mode="wait">
              <motion.p 
                key={language}
                {...textVariant}
                transition={{ ...textTransition, delay: 0.1 }}
                className={`text-body-fluid leading-relaxed transition-colors duration-1000 max-w-full font-light w-full ${theme.subtext} ${isCTA ? 'px-4 opacity-80' : 'group-hover:text-white/90'}`}
              >
                {isCTA ? ctaDesc : item?.description}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {isCTA && (
          <motion.div 
            style={{ translateZ: 225, x: tier1X, y: tier1Y } as any}
            className="relative z-10 pb-2 flex justify-center w-full"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full transition-all duration-700 shadow-[0_30px_60px_rgba(0,0,0,0.3)] group/btn cursor-pointer pointer-events-auto"
            >
              <AnimatePresence mode="wait">
                <motion.span 
                  key={language}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={textTransition}
                  className="uppercase tracking-widest-2x text-label-fluid font-bold block"
                >
                  {ctaBtn}
                </motion.span>
              </AnimatePresence>
              <motion.span 
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="material-icons-outlined text-lg"
              >
                bolt
              </motion.span>
            </motion.div>
          </motion.div>
        )}

        {!isCTA && (
          <motion.div 
            className="absolute inset-0 border-[2px] border-white/30 rounded-[48px] pointer-events-none"
            style={{
              transform: 'translateZ(1px)',
              opacity: useTransform(isOver, (over: number) => over === 1 ? 1 : 0),
              maskImage: useTransform(
                [lightX, lightY],
                ([lx, ly]: any[]) => `radial-gradient(500px circle at ${lx} ${ly}, black, transparent 90%)`
              ),
              WebkitMaskImage: useTransform(
                [lightX, lightY],
                ([lx, ly]: any[]) => `radial-gradient(500px circle at ${lx} ${ly}, black, transparent 90%)`
              )
            } as any}
          />
        )}
      </motion.div>
    </div>
  );
};
