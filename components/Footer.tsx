
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Logo } from './Logo.tsx';

const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  const variant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  const transition = { 
    duration: 0.35, 
    ease: [0.16, 1, 0.3, 1] as const 
  };

  return (
    <footer id="contact" className="footer bg-background pt-56 lg:pt-80 pb-20 border-t border-border transition-colors duration-500">
      <div className="max-w-8xl mx-auto px-10 lg:px-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-32 lg:gap-48 mb-64">
          <div className="max-w-5xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={language}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
              >
                <h2 className="font-display text-h2-fluid font-medium text-text mb-24">
                  {t('footer.cta')}
                </h2>
                <a 
                  href={`mailto:${t('footer.email')}`}
                  className="inline-flex items-center text-h3-fluid font-light border-b-[3px] border-text/15 pb-4 hover:text-text hover:border-text transition-all text-secondary"
                >
                  {t('footer.email')}
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="grid grid-cols-2 gap-x-32 gap-y-20 w-full lg:w-auto">
            <div className="min-w-[160px]">
              <div className="relative min-h-[2.5em] mb-12">
                <AnimatePresence mode="wait">
                  <motion.h4 key={language} {...variant} transition={transition} className="font-black text-label-fluid uppercase tracking-widest-3x text-secondary w-full">
                    {t('footer.sitemap')}
                  </motion.h4>
                </AnimatePresence>
              </div>
              <ul className="space-y-8 text-body-fluid text-secondary/80">
                {['services', 'work', 'about'].map((item, idx) => (
                  <li key={item} className="relative min-h-[1.5em]">
                    <AnimatePresence mode="wait">
                      <motion.a 
                        key={language}
                        {...variant}
                        transition={{ ...transition, delay: idx * 0.03 }}
                        href={`#${item}`} 
                        className="hover:text-text transition-colors capitalize block w-full font-bold tracking-tight"
                      >
                        {t(`nav.${item}`)}
                      </motion.a>
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
            <div className="min-w-[160px]">
              <div className="relative min-h-[2.5em] mb-12">
                <AnimatePresence mode="wait">
                  <motion.h4 key={language} {...variant} transition={transition} className="font-black text-label-fluid uppercase tracking-widest-3x text-secondary w-full">
                    {t('footer.socials')}
                  </motion.h4>
                </AnimatePresence>
              </div>
              <ul className="space-y-8 text-body-fluid text-secondary/80">
                {['Instagram', 'LinkedIn', 'Twitter'].map((item, idx) => (
                  <li key={item} className="relative min-h-[1.5em]">
                    <AnimatePresence mode="wait">
                      <motion.a 
                        key={language}
                        {...variant}
                        transition={{ ...transition, delay: idx * 0.03 }}
                        href="#" 
                        className="hover:text-text transition-colors block w-full font-bold tracking-tight"
                      >
                        {item}
                      </motion.a>
                    </AnimatePresence>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-16 border-t border-border text-nano text-secondary/50">
          <div className="flex items-center gap-10 mb-10 md:mb-0">
            <Logo size={40} className="opacity-40 grayscale brightness-200 hover:opacity-100 hover:grayscale-0 transition-all duration-500" />
            <div className="relative min-w-[200px]">
              <AnimatePresence mode="wait">
                <motion.span key={language} {...variant} transition={transition} className="font-black tracking-widest-2x uppercase block">
                  {t('footer.copyright')}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
          <div className="flex gap-16 font-black uppercase tracking-widest-3x">
            <AnimatePresence mode="wait">
              <motion.div key={language} {...variant} transition={transition} className="flex gap-16">
                <a href="#" className="hover:text-text transition-colors">{t('footer.privacy')}</a>
                <a href="#" className="hover:text-text transition-colors">{t('footer.terms')}</a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
