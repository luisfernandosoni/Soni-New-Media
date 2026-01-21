
import React, { useRef, useMemo, useId } from 'react';
import { motion, useSpring, useTransform, useMotionTemplate, AnimatePresence, useInView } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { WorkItem } from '../types.ts';
import { useRelativeMotion, useKinetic } from '../context/KineticContext.tsx';

const works: WorkItem[] = [
  { 
    id: '1', 
    title: 'Neural Cinema v.01', 
    category: 'Hybrid Filmmaking Prototype', 
    year: '2026', 
    image: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1600', 
    wide: true 
  },
  { id: '2', title: 'Media Sovereignty', category: 'Autonomous New Media Engine', year: '2025', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '3', title: 'Aetheric Archive', category: 'Spatial Cinematic Experience', year: '2026', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '4', title: 'Cybernetic Fauna', category: 'Generative Creature Design', year: '2025', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800', wide: false }
];

const WorkCardEngine: React.FC<{ item: WorkItem; index: number; cardId: string }> = ({ item, index, cardId }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { velX, velY } = useKinetic();
  const { relX, relY, isOver } = useRelativeMotion(cardId, cardRef);
  
  const speed = useTransform([velX, velY], ([vx, vy]: number[]) => 
    Math.sqrt(Math.pow(vx || 0, 2) + Math.pow(vy || 0, 2))
  );

  const springConfig = useMemo(() => ({ damping: 30, stiffness: 200, mass: 0.5 }), []);
  
  const activeX = useTransform([isOver, relX], ([over, rX]: number[]) => (over === 1 ? rX : 0.5));
  const activeY = useTransform([isOver, relY], ([over, rY]: number[]) => (over === 1 ? rY : 0.5));

  const rotateX = useSpring(useTransform(activeY, [0, 1], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(activeX, [0, 1], [-10, 10]), springConfig);
  
  const imageX = useSpring(useTransform(activeX, [0, 1], [-20, 20]), springConfig);
  const imageY = useSpring(useTransform(activeY, [0, 1], [-20, 20]), springConfig);

  const shineXPercent = useTransform(activeX, [0, 1], ["0%", "100%"]);
  
  const smoothSpeed = useSpring(speed, { damping: 50, stiffness: 200 });
  const shineOpacity = useTransform(smoothSpeed, [0, 2000], [0, 0.3]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full h-full flex flex-col"
    >
      <motion.div
        ref={cardRef}
        style={{ 
          rotateX, 
          rotateY, 
          perspective: 1200,
          "--sx": shineXPercent
        } as any}
        className="relative overflow-hidden rounded-[40px] bg-surface border border-border shadow-2xl transition-shadow duration-500 group-hover:shadow-accent/5 will-change-transform group"
      >
        <motion.div 
          style={{ 
            background: `radial-gradient(circle at var(--sx) 50%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: shineOpacity
          } as any}
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        />

        <div className="relative aspect-[16/9] overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            style={{ x: imageX, y: imageY, scale: 1.2 } as any}
            className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
          />
          
          <motion.div 
            style={{ opacity: useTransform(isOver, (over: number) => over === 1 ? 1 : 0) } as any}
            className="absolute inset-0 z-10 p-12 lg:p-16 flex flex-col justify-between pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/60 transition-opacity duration-700"
          >
            <div className="flex justify-between items-start">
              <span className="text-nano font-black tracking-widest-3x text-white uppercase opacity-70">Archive_{item.year}</span>
              <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                <span className="material-icons-outlined text-white text-base">north_east</span>
              </div>
            </div>
            
            <div className="space-y-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <h3 className="text-white font-display text-h3-fluid font-medium">{item.title}</h3>
              <p className="text-white/70 text-body-fluid font-light max-w-sm">{item.category}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="mt-12 flex justify-between items-end px-4">
        <div className="space-y-3">
          <h4 className="text-label-fluid font-black text-text uppercase tracking-widest-3x">{item.title}</h4>
          <p className="text-nano text-secondary font-bold uppercase tracking-widest-2x">{item.category}</p>
        </div>
        <div className="h-[1px] flex-grow mx-12 bg-border opacity-50 mb-3" />
        <span className="text-nano font-mono text-secondary tabular-nums font-black mb-1">©{item.year}</span>
      </div>
    </motion.div>
  );
};

const WorkCard: React.FC<{ item: WorkItem; index: number }> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardId = useId();
  const isInView = useInView(scrollRef, { margin: "300px", once: false });

  return (
    <div
      ref={scrollRef}
      className={`relative min-h-[400px] ${props.item.wide ? 'col-span-1 lg:col-span-2' : 'col-span-1'}`}
    >
      {isInView ? (
        <WorkCardEngine {...props} cardId={cardId} />
      ) : (
        <div className="w-full aspect-[16/9] bg-surface/50 border border-border/20 rounded-[40px] animate-pulse" />
      )}
    </div>
  );
};

const Work: React.FC = () => {
  const { t, language } = useLanguage();
  const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section id="work" className="py-24 lg:py-40 bg-background overflow-hidden scroll-mt-20">
      <div className="max-w-8xl mx-auto px-10 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-48 border-l-[4px] border-accent pl-16">
          <div className="space-y-12 max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div key={language} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={transition}>
                <span className="text-label-fluid font-black uppercase tracking-widest-3x text-secondary block">{t('work.tag')}</span>
                <h2 className="font-display text-h2-fluid font-medium text-text mt-6">{t('work.title')}</h2>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-16 md:mt-0 text-right">
             <AnimatePresence mode="wait">
               <motion.div key={language} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ ...transition, delay: 0.1 }}>
                 <p className="text-secondary/70 max-w-sm text-body-fluid leading-relaxed mb-10 font-light">{t('work.desc')}</p>
                 <button className="text-label-fluid uppercase tracking-widest-3x font-black text-accent border-b-[3px] border-accent pb-2 hover:opacity-60 transition-opacity">
                   {t('work.viewArchive')}
                 </button>
               </motion.div>
             </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-24 gap-y-40">
          {works.map((work, index) => (
            <WorkCard key={work.id} item={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
