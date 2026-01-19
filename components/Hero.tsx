import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';

const CinematicVisual = () => {
  return (
    <div className="w-full h-full relative group overflow-hidden rounded-3xl border border-accent/5 bg-surface transition-colors duration-500 shadow-2xl shadow-accent/[0.02]">
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600"
          alt="Abstract Cinematic Mesh"
          className="w-full h-full object-cover mix-blend-screen grayscale dark:group-hover:grayscale-0 transition-all duration-1000"
        />
      </motion.div>
      <motion.div 
        animate={{ x: [0, 50, -20, 0], y: [0, -30, 40, 0], opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 blur-[100px] rounded-full z-0"
      />
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-10 bg-gradient-to-t from-background/80 via-transparent to-background/40 transition-colors duration-500">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-text/40">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-mono text-text/60 uppercase">Neural_Net_Active</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-text/40 text-right uppercase">01011001 <br />SONI_CORE_V1</div>
        </div>
        <div className="backdrop-blur-xl bg-accent/5 border border-accent/10 p-8 rounded-2xl flex justify-between items-end transform transition-all duration-700 hover:bg-accent/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-text/40 mb-2">Creative Direction</p>
            <h3 className="text-text font-display text-2xl font-medium tracking-tight">Machine Aesthetics</h3>
          </div>
          <div className="flex gap-1.5 items-end h-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                animate={{ height: ["20%", "70%", "30%", "100%", "20%"] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: i * 0.15 }}
                className="w-1 bg-accent rounded-full opacity-60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden px-6 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 z-10"
        >
          <div className="space-y-4">
            <motion.span className="text-xs font-bold uppercase tracking-[0.4em] text-text/40 block">
              {t('hero.tag')}
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.h1 
                key={language}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="font-display text-7xl lg:text-9xl font-medium tracking-tighter leading-[0.85] text-text"
              >
                {t('hero.title1')}<br />
                {t('hero.title2')}<br />
                <span className="text-text/30 block mt-2">{t('hero.title3')}</span>
              </motion.h1>
            </AnimatePresence>
          </div>
          
          <p className="text-xl text-text/60 max-w-lg font-light leading-relaxed">
            {t('hero.desc')}
          </p>
          
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a href="#work" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-accent px-10 font-medium text-background transition-all duration-300 hover:opacity-80">
              <span className="relative z-10 flex items-center gap-2">
                {t('hero.btn')}
                <span className="material-icons-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </span>
            </a>
            <button className="group flex items-center gap-3 text-sm font-medium text-text/60 hover:text-text transition-colors">
              <span className="flex items-center justify-center w-12 h-12 rounded-full border border-accent/20 group-hover:border-accent transition-colors">
                <span className="material-icons-outlined text-lg">play_arrow</span>
              </span>
              {t('hero.reel')}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative h-[600px] w-full"
        >
          <CinematicVisual />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;