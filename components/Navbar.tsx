
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Magnetic } from './Magnetic.tsx';
import { Logo } from './Logo.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-background/80 backdrop-blur-xl border-border py-3'
          : 'bg-transparent border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Magnetic strength={0.2} radius={100}>
          <a href="#" className="flex items-center group cursor-pointer relative">
            <Logo size={32} />
          </a>
        </Magnetic>

        <div className="flex items-center space-x-8">
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
            {['services', 'work', 'about'].map((item) => (
              <Magnetic key={item} strength={0.4} radius={80}>
                <a
                  href={`#${item}`}
                  className="px-4 py-2 text-secondary hover:text-text transition-colors relative group uppercase text-[10px] tracking-widest block"
                >
                  {t(`nav.${item}`)}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-accent transition-all duration-300 group-hover:w-1/2" />
                </a>
              </Magnetic>
            ))}
          </div>
          
          <div className="flex items-center gap-4 border-l border-border pl-8">
            <div className="flex bg-subtle rounded-full p-1 border border-border">
              {(['en', 'es'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all duration-300 ${
                    language === lang 
                    ? 'bg-accent text-accent-contrast shadow-sm' 
                    : 'text-secondary hover:text-text'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <Magnetic strength={0.15} radius={120}>
            <a
              href="#contact"
              className="hidden md:block bg-accent text-accent-contrast px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-accent/10 transition-all font-semibold text-xs uppercase tracking-widest"
            >
              {t('nav.contact')}
            </a>
          </Magnetic>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
