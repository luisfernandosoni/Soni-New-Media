import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { ServiceItem } from '../types.ts';

const Card: React.FC<{ item: ServiceItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group p-10 rounded-3xl bg-surface border border-border hover:border-text/20 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/[0.03] hover:-translate-y-2 cursor-default min-h-[320px] flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <span className="material-icons-outlined text-3xl text-secondary group-hover:text-text transition-colors duration-300">{item.icon}</span>
      <span className="text-xs font-mono text-secondary/50 group-hover:text-secondary transition-colors">{item.number}</span>
    </div>
    <div>
      <h3 className="text-2xl font-display font-medium mb-4 text-text">{item.title}</h3>
      <p className="text-secondary text-sm leading-relaxed group-hover:text-text transition-colors">{item.description}</p>
    </div>
  </motion.div>
);

const Services: React.FC = () => {
  const { t } = useLanguage();

  const services: ServiceItem[] = [
    { id: '1', number: '01', icon: 'smart_toy', title: t('services.tag'), description: t('services.desc') }, // Using tags for demo, but normally keys would match
    { id: '2', number: '02', icon: 'movie_filter', title: 'Hybrid Filmmaking', description: 'Merging traditional cinematography with generative video models.' },
    { id: '3', number: '03', icon: 'psychology', title: 'AI Agents', description: 'Custom-trained LLMs that understand your brand voice.' },
    { id: '4', number: '04', icon: 'web', title: 'High-End Web', description: 'Performant, aesthetically superior landing pages.' },
    { id: '5', number: '05', icon: 'campaign', title: 'Meta Ads & Scale', description: 'Data-driven acquisition strategies powered by AI.' },
  ];

  return (
    <section id="services" className="py-32 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary mb-6 block">{t('services.tag')}</span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-text">{t('services.title')}</h2>
          </div>
          <p className="text-secondary max-w-sm mt-8 md:mt-0 text-left leading-relaxed">
            {t('services.desc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={service.id} item={service} index={index} />
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="group p-10 rounded-3xl bg-accent text-background border border-accent hover:opacity-90 transition-all duration-300 cursor-pointer min-h-[320px] flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-medium mb-3">{t('services.custom')}</h3>
              <p className="opacity-70 text-sm mb-8">{t('services.customDesc')}</p>
              <span className="inline-block border-b border-background pb-1 uppercase tracking-widest text-xs font-bold">{t('services.cta')}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;