
import React from 'react';
import { LanguageProvider } from './context/LanguageContext.tsx';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Work from './components/Work.tsx';
import About from './components/About.tsx';
import DesignPhilosophy from './components/DesignPhilosophy.tsx';
import Footer from './components/Footer.tsx';
import { CustomCursor } from './components/CustomCursor.tsx';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="relative w-full min-h-screen bg-background text-text selection:bg-accent selection:text-background transition-colors duration-500 overflow-x-hidden">
        <CustomCursor />
        <Navbar />
        <main>
          <Hero />
          <Services />
          <Work />
          <About />
          <DesignPhilosophy />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

export default App;
