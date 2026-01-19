import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext.tsx';
import { CloudflareImage } from './CloudflareImage.tsx';
import { Magnetic } from './Magnetic.tsx';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    const initialTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    setTheme(initialTheme);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

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
          <div className="flex items-center group cursor-pointer relative">
            <div className="h-12 w-12 flex items-center justify-center">
               <CloudflareImage 
                name="SoniNewMedia.png"
                alt="Soní Logo" 
                priority={true}
                width={96} 
                className="h-full w-full dark:invert transition-transform duration-500 group-hover:scale-110 will-change-transform" 
              />
            </div>
          </div>
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
                    ? 'bg-accent text-background shadow-sm' 
                    : 'text-secondary hover:text-text'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            <Magnetic strength={0.3} radius={60}>
              <button 
                onClick={toggleTheme}
                className="w-14 h-8 rounded-full bg-subtle relative flex items-center p-1 transition-colors border border-border"
                aria-label="Toggle Theme"
              >
                <motion.div
                  animate={{ x: theme === 'dark' ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  className="w-6 h-6 rounded-full bg-accent flex items-center justify-center shadow-sm"
                >
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={theme}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className="material-icons-outlined text-[14px] text-background select-none"
                    >
                      {theme === 'dark' ? 'dark_mode' : 'light_mode'}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </button>
            </Magnetic>
          </div>

          <Magnetic strength={0.15} radius={120}>
            <a
              href="#contact"
              className="hidden md:block bg-accent text-background px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-accent/10 transition-all font-semibold text-xs uppercase tracking-widest"
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