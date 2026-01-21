
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';

const DesignPhilosophy: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="py-48 lg:py-64 bg-surface border-y border-border transition-colors duration-500 overflow-hidden">
      <div className="max-w-6xl mx-auto px-10 text-center">
        <span className="material-icons-outlined text-5xl mb-16 text-secondary/30">format_quote</span>
        <AnimatePresence mode="wait">
          <motion.div
            key={language}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <blockquote className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-16 text-text tracking-tight">
              {t('philosophy.quote')}
            </blockquote>
            <cite className="not-italic text-nano font-black tracking-widest-3x uppercase text-secondary block">
              {t('philosophy.tag')}
            </cite>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DesignPhilosophy;
