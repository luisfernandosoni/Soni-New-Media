
import React, { useRef } from 'react';
import { motion, useTime, useTransform, AnimatePresence, useInView } from 'motion/react';
import { ServiceItem } from '../types.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { KineticSurface } from './kinetic/KineticSurface.tsx';
import { KineticLayer } from './kinetic/KineticLayer.tsx';

/**
 * MODULAR ATOM: CardHeader
 * Handles the icon container and the surgical numbering.
 */
const CardHeader: React.FC<{ item?: ServiceItem; isCTA: boolean }> = ({ item, isCTA }) => (
  <div className="flex justify-between items-start mb-16 pointer-events-none relative z-20">
    <KineticLayer depth={120}>
      {isCTA ? (
        <span className="text-[10px] font-mono font-black text-black/20 tracking-widest-3x uppercase pt-2">System_Core</span>
      ) : (
        <div className="w-20 h-20 rounded-[32px] bg-[#1A1A1A] border border-white/10 flex items-center justify-center relative overflow-hidden group/icon shadow-inner">
           <span className="material-icons-outlined text-3xl text-white group-hover:scale-110 transition-transform duration-700">{item?.icon}</span>
        </div>
      )}
    </KineticLayer>
    
    <KineticLayer depth={180}>
      <span className={`text-[12px] font-mono font-bold tracking-[0.4em] transition-colors duration-700 ${isCTA ? 'text-black/20' : 'text-white/30'}`}>
        {isCTA ? '///' : item?.number.split('').join(' ')}
      </span>
    </KineticLayer>
  </div>
);

/**
 * MODULAR ATOM: CardBody
 * Handles Title and Description with language-aware transitions.
 */
const CardBody: React.FC<{ 
  title: string; 
  description: string; 
  language: string; 
  textVariant: any; 
  textTransition: any;
  subtextClass: string;
}> = ({ title, description, language, textVariant, textTransition, subtextClass }) => (
  <div className="flex-grow flex flex-col pointer-events-none">
    <KineticLayer depth={100} className="mb-6">
      <AnimatePresence mode="wait">
        <motion.h3 key={language} {...textVariant} transition={textTransition} className="text-h3-fluid font-display font-medium leading-none tracking-tight w-full">
          {title}
        </motion.h3>
      </AnimatePresence>
    </KineticLayer>
    
    <KineticLayer depth={60}>
      <AnimatePresence mode="wait">
        <motion.p key={language} {...textVariant} transition={{ ...textTransition, delay: 0.1 }} className={`text-body-fluid leading-relaxed transition-colors duration-1000 max-w-full font-light w-full ${subtextClass}`}>
          {description}
        </motion.p>
      </AnimatePresence>
    </KineticLayer>
  </div>
);

/**
 * MODULAR ATOM: CardFooter
 * Handles the separator line and the CTA button logic.
 */
const CardFooter: React.FC<{ 
  isCTA: boolean; 
  language: string; 
  btnText?: string; 
  textTransition: any;
  lineClass: string;
}> = ({ isCTA, language, btnText, textTransition, lineClass }) => (
  <>
    <KineticLayer depth={20} className="mt-12">
       <div className={`w-full h-[1.5px] rounded-full mx-auto max-w-[90%] ${lineClass}`} />
    </KineticLayer>

    {isCTA && (
      <KineticLayer depth={220} className="relative pt-10 flex justify-center w-full">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-5 bg-black text-white px-12 py-5 rounded-full transition-all duration-700 shadow-2xl group/btn cursor-pointer pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.span key={language} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={textTransition} className="uppercase tracking-widest-3x text-[10px] font-black block">
              {btnText}
            </motion.span>
          </AnimatePresence>
          <span className="material-icons-outlined text-lg">bolt</span>
        </motion.div>
      </KineticLayer>
    )}
  </>
);

interface ServiceCardProps {
  item?: ServiceItem;
  index: number;
  isCTA?: boolean;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaBtn?: string;
}

const ServiceCardEngine: React.FC<ServiceCardProps> = ({ 
  item, index, isCTA = false, ctaTitle, ctaDesc, ctaBtn
}) => {
  const time = useTime();
  const { language } = useLanguage();

  const idleBreathe = useTransform(time, (t: number) => 1 + Math.sin((t + index * 500) / 5000) * 0.003);
  
  const theme = isCTA ? {
    container: "text-black",
    bg: "bg-white",
    subtext: "text-black/70",
    line: "bg-black/5",
    shadow: "hover:shadow-[0_60px_120px_rgba(255,255,255,0.12)]"
  } : {
    container: "text-white",
    bg: "bg-[#080808]",
    subtext: "text-white/60",
    line: "bg-white/10",
    shadow: "hover:shadow-[0_50px_100px_rgba(0,0,0,0.8)]"
  };

  const textVariant = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 }
  };
  
  const textTransition = { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <KineticSurface 
      strength={16} 
      shineIntensity={isCTA ? 0.05 : 0.2}
      className={`w-full h-full p-12 lg:p-14 rounded-[52px] border border-white/5 flex flex-col ${theme.container} ${theme.shadow} transition-shadow duration-1000 overflow-hidden relative`}
    >
      {/* Background with subtle breathe */}
      <motion.div style={{ scale: idleBreathe } as any} className={`absolute inset-0 rounded-[52px] pointer-events-none ${theme.bg}`} />

      <CardHeader item={item} isCTA={isCTA} />

      <CardBody 
        title={isCTA ? ctaTitle! : item!.title}
        description={isCTA ? ctaDesc! : item!.description}
        language={language}
        textVariant={textVariant}
        textTransition={textTransition}
        subtextClass={theme.subtext}
      />

      <CardFooter 
        isCTA={isCTA}
        language={language}
        btnText={ctaBtn}
        textTransition={textTransition}
        lineClass={theme.line}
      />

      {/* Global Surgical Glow (Restricted to non-CTA) */}
      {!isCTA && (
        <KineticLayer depth={5} className="absolute inset-0 pointer-events-none">
          <motion.div 
            className="absolute inset-0 border-[1.5px] border-white/20 rounded-[52px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
            style={{
              maskImage: `radial-gradient(500px circle at var(--mx) var(--my), black, transparent 75%)`,
              WebkitMaskImage: `radial-gradient(500px circle at var(--mx) var(--my), black, transparent 75%)`
            } as any}
          />
        </KineticLayer>
      )}
    </KineticSurface>
  );
};

export const ServiceCard: React.FC<ServiceCardProps> = (props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(scrollRef, { margin: "200px", once: false });

  return (
    <div
      ref={scrollRef}
      className="relative h-[540px] group transition-opacity duration-700"
    >
      {isInView ? (
        <ServiceCardEngine {...props} />
      ) : (
        <div className="w-full h-full rounded-[52px] border border-white/5 bg-white/[0.01]" />
      )}
    </div>
  );
};
