
/* 
 * UNBREAKABLE RULES SUMMARY:
 * 1. Focus on 1 core task per sprint.
 * 2. Silicon Valley Senior Engineer standard.
 * 3. Bleeding-edge design/tech.
 * 4. Steve Jobs/Jony Ive approved aesthetics.
 * 5. No unsolicited changes.
 * 6. Inform/Explain for learning.
 * 7. Cloudflare 2026 Ecosystem.
 * 
 * SPRINT LOG:
 * Fixed the type mismatch in `WorkCard`. Replaced the invalid `useTransform` 
 * with a kinetic velocity-based specularity engine. The shine now reacts 
 * dynamically to mouse speed for a more tactile, premium feel.
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { WorkItem } from '../types.ts';

const works: WorkItem[] = [
  { id: '1', title: 'Project Aether', category: 'Generative Product Campaign', year: '2025', image: 'https://images.unsplash.com/photo-1635323533469-808620868f0a?auto=format&fit=crop&q=80&w=1600', wide: true },
  { id: '2', title: 'Datastream V', category: 'Automated Interface Design', year: '2023', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '3', title: 'Kinetic Labs', category: 'AI Robotics Showcase', year: '2024', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', wide: false },
];

const WorkCard: React.FC<{ item: WorkItem; index: number }> = ({ item, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // High-performance motion values for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Kinetic speed calculation for dynamic specularity
  const xVelocity = useVelocity(mouseX);
  const yVelocity = useVelocity(mouseY);
  const speed = useTransform([xVelocity, yVelocity], ([vx, vy]) => 
    Math.sqrt(Math.pow(vx as number, 2) + Math.pow(vy as number, 2))
  );

  // Smooth springs for "Premium Material" feel
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);
  
  // Internal Parallax (Inverse movement of the image)
  const imageX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-20, 20]), springConfig);
  const imageY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-20, 20]), springConfig);

  // Dynamic Shine (Specularity)
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  
  // Fix: Replaced invalid function-based useTransform with a proper MotionValue-driven one
  // We use a smoothed speed to avoid jitter in the specularity layer
  const smoothSpeed = useSpring(speed, { damping: 50, stiffness: 200 });
  const shineOpacity = useTransform(smoothSpeed, [0, 2000], [0, 0.3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1200 }}
      className={`relative group cursor-pointer ${item.wide ? 'col-span-1 lg:col-span-2' : 'col-span-1'}`}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative overflow-hidden rounded-3xl bg-surface border border-border shadow-2xl transition-shadow duration-500 group-hover:shadow-accent/5 will-change-transform"
      >
        {/* Dynamic Specularity Layer: Opacity is now driven by kinetic velocity */}
        <motion.div 
          style={{ 
            background: `radial-gradient(circle at ${shineX} 50%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: shineOpacity
          }}
          className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay"
        />

        {/* Viewport Frame */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <motion.img
            src={item.image}
            alt={item.title}
            style={{ x: imageX, y: imageY, scale: 1.2 }}
            className="absolute inset-0 h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-out"
          />
          
          {/* Spatial Overlay Labels */}
          <div className="absolute inset-0 z-10 p-10 flex flex-col justify-between pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase opacity-60">Archive_{item.year}</span>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
                <span className="material-icons-outlined text-white text-sm">north_east</span>
              </div>
            </div>
            
            <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
              <h3 className="text-white font-display text-4xl font-medium tracking-tight">{item.title}</h3>
              <p className="text-white/60 text-sm font-light max-w-xs">{item.category}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Meta-Info (Outside 3D container for depth contrast) */}
      <div className="mt-8 flex justify-between items-end px-2">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-text uppercase tracking-widest">{item.title}</h4>
          <p className="text-xs text-secondary">{item.category}</p>
        </div>
        <div className="h-[1px] flex-grow mx-8 bg-border opacity-50 mb-2" />
        <span className="text-[10px] font-mono text-secondary tabular-nums">©{item.year}</span>
      </div>
    </motion.div>
  );
};

const Work: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="work" className="py-40 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32 border-l-2 border-accent pl-10">
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-xs font-bold uppercase tracking-[0.4em] text-secondary block"
            >
              {t('work.tag')}
            </motion.span>
            <h2 className="font-display text-6xl md:text-8xl font-medium tracking-tighter text-text">
              {t('work.title')}
            </h2>
          </div>
          <div className="mt-12 md:mt-0 text-right">
             <p className="text-secondary max-w-xs text-sm leading-relaxed mb-6">
               Curating digital artifacts through the lens of machine intelligence and human craft.
             </p>
             <button className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent border-b border-accent pb-1 hover:opacity-60 transition-opacity">
               View Full Archive
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-20 gap-y-32">
          {works.map((work, index) => (
            <WorkCard key={work.id} item={work} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
