
/* 
 * RULES SUMMARY:
 * 1. Focus on one core task per sprint.
 * 2. Maintain SV Top 10 VP/Senior standard.
 * 3. Use bleeding-edge technology/design.
 * 4. Strive for Apple-level aesthetic perfection.
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ServiceItem } from '../types.ts';
import { ServiceCard } from './ServiceCard.tsx';

const Services: React.FC = () => {
  const { t, language } = useLanguage();
  const services: ServiceItem[] = t('services.items') || [];

  const transition = { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <section id="services" className="py-24 lg:py-40 bg-background relative transition-colors duration-500 overflow-hidden scroll-mt-20">
      <div className="absolute top-0 right-0 w-[2000px] h-[2000px] bg-white/[0.01] blur-[300px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="max-w-8xl mx-auto px-10 lg:px-20 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-48">
          <div className="space-y-12 max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div 
                key={language}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={transition}
                className="inline-flex items-center gap-6 px-8 py-3 rounded-full border border-white/10 bg-white/[0.05]"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                <span className="text-nano font-black uppercase tracking-widest-3x text-white/70">
                  {t('services.tag')}
                </span>
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.h2 
                key={language}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ ...transition, duration: 0.5 }}
                className="font-display text-h2-fluid font-medium text-white"
              >
                {t('services.title')}
              </motion.h2>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait">
            <motion.p 
              key={language}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ ...transition, delay: 0.1 }}
              className="text-body-fluid text-white/50 max-w-md mt-16 md:mt-0 text-left leading-relaxed font-light"
            >
              {t('services.desc')}
            </motion.p>
          </AnimatePresence>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.id} 
              item={service} 
              index={index} 
            />
          ))}
          
          <ServiceCard 
            index={services.length}
            isCTA={true}
            ctaTitle={t('services.custom')}
            ctaDesc={t('services.customDesc')}
            ctaBtn={t('services.cta')}
          />
        </div>
      </div>
    </section>
  );
};

export default Services;
