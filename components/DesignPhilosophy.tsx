import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';

const DesignPhilosophy: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-40 bg-surface border-y border-border transition-colors duration-500">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="material-icons-outlined text-4xl mb-10 text-secondary/40">format_quote</span>
        <AnimatePresence mode="wait">
          <motion.blockquote 
            key={language}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-display text-3xl md:text-5xl font-light leading-tight mb-12 text-text"
          >
            {t('philosophy.quote')}
          </motion.blockquote>
        </AnimatePresence>
        <cite className="not-italic text-xs font-bold tracking-[0.3em] uppercase text-secondary">
          {t('philosophy.tag')}
        </cite>
      </div>
    </section>
  );
};

export default DesignPhilosophy;