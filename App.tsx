import React from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import Services from './components/Services.tsx';
import Work from './components/Work.tsx';
import DesignPhilosophy from './components/DesignPhilosophy.tsx';
import Footer from './components/Footer.tsx';

const App: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen bg-background text-white selection:bg-white selection:text-black overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <DesignPhilosophy />
      </main>
      <Footer />
    </div>
  );
};

export default App;