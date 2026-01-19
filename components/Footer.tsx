
import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { Logo } from './Logo.tsx';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="footer bg-background pt-32 pb-12 border-t border-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-32">
          <div className="max-w-2xl">
            <h2 className="font-display text-5xl md:text-7xl font-medium tracking-tighter mb-10 text-text">
              {t('footer.cta')}
            </h2>
            <a 
              href="mailto:hello@soninewmedia.com" 
              className="inline-flex items-center text-xl md:text-2xl font-light border-b border-text/20 pb-1 hover:text-text hover:border-text transition-all text-secondary"
            >
              hello@soninewmedia.com
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-x-20 gap-y-10 w-full lg:w-auto">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-secondary mb-6">Sitemap</h4>
              <ul className="space-y-4 text-sm text-secondary">
                {['services', 'work', 'about'].map(item => (
                  <li key={item}>
                    <a href={`#${item}`} className="hover:text-text transition-colors capitalize">{t(`nav.${item}`)}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-secondary mb-6">Socials</h4>
              <ul className="space-y-4 text-sm text-secondary">
                {['Instagram', 'LinkedIn', 'Twitter (X)'].map(item => (
                  <li key={item}>
                    <a href="#" className="hover:text-text transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border text-xs text-secondary/60">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Logo size={24} className="opacity-40 grayscale brightness-200 hover:opacity-100 hover:grayscale-0 transition-all duration-500" />
            <span className="ml-2">© 2026 Soní New Media.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-text transition-colors">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-text transition-colors">{t('footer.terms')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
