
import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-40 bg-background relative overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-4 px-4 py-1.5 rounded-full border border-accent/10 bg-accent/[0.03]"
            >
              <span className="text-[8px] font-bold uppercase tracking-[0.5em] text-accent/50">
                {t('about.tag')}
              </span>
            </motion.div>
            
            <div className="space-y-6">
              <p className="text-secondary text-base leading-relaxed font-light">
                {t('about.desc')}
              </p>
              <div className="h-px w-20 bg-accent/20" />
            </div>
          </div>

          {/* Main Manifesto Text */}
          <div className="lg:col-span-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-medium tracking-tighter leading-[0.9] text-text mb-16"
            >
              {t('about.title')}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl md:text-2xl text-secondary font-light leading-snug max-w-2xl"
            >
              {t('about.manifesto')}
            </motion.p>
          </div>
        </div>

        {/* Decorative background element */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/[0.02] blur-[120px] rounded-full pointer-events-none -z-10" />
      </div>
    </section>
  );
};

export default About;
