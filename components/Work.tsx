import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { WorkItem } from '../types.ts';

const works: WorkItem[] = [
  { id: '1', title: 'Project Aether', category: 'Generative Product Campaign', year: '2025', image: 'https://images.unsplash.com/photo-1635323533469-808620868f0a?auto=format&fit=crop&q=80&w=1600', wide: true },
  { id: '2', title: 'Datastream V', category: 'Automated Interface Design', year: '2023', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800', wide: false },
  { id: '3', title: 'Kinetic Labs', category: 'AI Robotics Showcase', year: '2024', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', wide: false },
];

const WorkCard: React.FC<{ item: WorkItem }> = ({ item }) => (
  <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.7 }} className={`group cursor-pointer ${item.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}>
    <div className="relative overflow-hidden rounded-2xl bg-surface mb-6 aspect-[4/3] md:aspect-video border border-border">
      <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 opacity-90 group-hover:opacity-100 grayscale hover:grayscale-0 transition-all" />
      {item.wide && (
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end bg-gradient-to-t from-black/90 to-transparent">
          <div><h3 className="text-white text-3xl font-display font-medium mb-2">{item.title}</h3><p className="text-white/70 text-sm">{item.category}</p></div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
             <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-xl"><span className="material-icons-outlined">arrow_outward</span></div>
          </div>
        </div>
      )}
    </div>
    {!item.wide && (
      <div className="flex justify-between items-center border-t border-border pt-5 group-hover:border-text/30 transition-colors">
        <div><h3 className="text-2xl font-display font-medium text-text mb-1">{item.title}</h3><p className="text-secondary text-sm">{item.category}</p></div>
        <span className="text-[10px] font-bold tracking-widest uppercase border border-border px-3 py-1.5 rounded-full text-secondary">{item.year}</span>
      </div>
    )}
  </motion.div>
);

const Work: React.FC = () => {
  const { t } = useLanguage();
  return (
    <section id="work" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-6 block">{t('work.tag')}</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-text">{t('work.title')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {works.map((work) => <WorkCard key={work.id} item={work} />)}
        </div>
      </div>
    </section>
  );
};

export default Work;