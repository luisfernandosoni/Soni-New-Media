import React from 'react';
import { motion, useTime, useTransform } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ServiceItem } from '../types.ts';

const BreathableCard: React.FC<{ item: ServiceItem; index: number }> = ({ item, index }) => {
  const time = useTime();
  const breathe = useTransform(time, t => 1 + Math.sin((t + index * 500) / 2500) * 0.015);
  const glow = useTransform(time, t => 0.05 + Math.sin((t + index * 500) / 2500) * 0.03);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{ scale: breathe }}
      className="group relative p-10 rounded-[40px] bg-surface/50 dark:bg-white/[0.02] border border-border hover:border-accent/20 transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] cursor-default min-h-[360px] flex flex-col justify-between overflow-hidden backdrop-blur-sm"
    >
      <motion.div 
        style={{ opacity: glow }}
        className="absolute inset-0 bg-accent rounded-[40px] blur-[100px] -z-10 pointer-events-none"
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-accent/[0.03] border border-accent/5 flex items-center justify-center group-hover:bg-accent group-hover:border-accent transition-all duration-500">
          <span className="material-icons-outlined text-2xl text-accent group-hover:text-accent-contrast transition-colors duration-500">
            {item.icon}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-accent/20 tracking-widest group-hover:text-accent/60 transition-colors">
          {item.number}
        </span>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl font-display font-medium mb-4 text-text tracking-tight">{item.title}</h3>
        <p className="text-secondary text-sm leading-relaxed group-hover:text-text/80 transition-colors duration-500 max-w-[90%]">
          {item.description}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/5 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
    </motion.div>
  );
};

const Services: React.FC = () => {
  const { t } = useLanguage();
  const services: ServiceItem[] = t('services.items') || [];

  return (
    <section id="services" className="py-40 bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-32">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-accent/10 bg-accent/[0.02]"
            >
              <span className="w-1 h-1 rounded-full bg-accent/40" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-accent/40">
                {t('services.tag')}
              </span>
            </motion.div>
            <h2 className="font-display text-5xl md:text-7xl font-medium tracking-tighter text-text">
              {t('services.title')}
            </h2>
          </div>
          <p className="text-secondary max-w-sm mt-12 md:mt-0 text-left leading-relaxed text-lg font-light">
            {t('services.desc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <BreathableCard key={service.id} item={service} index={index} />
          ))}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="group p-10 rounded-[40px] bg-accent text-accent-contrast border border-accent hover:shadow-[0_40px_100px_rgba(var(--accent-rgb),0.2)] transition-all duration-700 cursor-pointer min-h-[360px] flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--accent-contrast)_1px,_transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <h3 className="text-3xl font-display font-medium tracking-tight">{t('services.custom')}</h3>
                <p className="opacity-60 text-sm font-light px-4">{t('services.customDesc')}</p>
              </div>
              
              <div className="inline-flex items-center gap-3 border-b border-accent-contrast/20 pb-2 group-hover:border-accent-contrast transition-colors">
                <span className="uppercase tracking-[0.3em] text-[10px] font-bold">{t('services.cta')}</span>
                <span className="material-icons-outlined text-sm">arrow_forward</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;