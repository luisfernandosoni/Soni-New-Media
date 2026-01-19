import React from 'react';
import { motion } from 'framer-motion';

const CinematicVisual = () => {
  return (
    <div className="w-full h-full relative group overflow-hidden rounded-3xl border border-white/5 bg-[#0a0a0a]">
      {/* Background Cinematic Texture */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <img 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600"
          alt="Abstract Cinematic Mesh"
          className="w-full h-full object-cover mix-blend-screen grayscale group-hover:grayscale-0 transition-all duration-1000"
        />
      </motion.div>

      {/* Floating Light Orbs for Depth */}
      <motion.div 
        animate={{ 
          x: [0, 50, -20, 0],
          y: [0, -30, 40, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 blur-[100px] rounded-full z-0"
      />
      
      {/* Interactive HUD Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between p-10 bg-gradient-to-t from-black/80 via-transparent to-black/40">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">System Status</p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] font-mono text-white/60">NEURAL_NET_ACTIVE</p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-white/40 text-right">
            01011001 <br />
            SONI_CORE_V1
          </div>
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-2xl flex justify-between items-end transform transition-all duration-700 hover:bg-white/10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">Creative Direction</p>
            <h3 className="text-white font-display text-2xl font-medium tracking-tight">Machine Aesthetics</h3>
          </div>
          <div className="flex gap-1.5 items-end h-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div 
                key={i}
                animate={{ height: ["20%", "70%", "30%", "100%", "20%"] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2, 
                  ease: "easeInOut",
                  delay: i * 0.15 
                }}
                className="w-1 bg-white rounded-full opacity-60"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 overflow-hidden px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-10 z-10"
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs font-bold uppercase tracking-[0.4em] text-gray-500"
            >
              Intelligence Agency
            </motion.span>
            <h1 className="font-display text-7xl lg:text-9xl font-medium tracking-tighter leading-[0.85] text-white">
              Hybrid<br />
              Filmmaking<br />
              <span className="text-gray-700 block mt-2">& Media.</span>
            </h1>
          </div>
          
          <p className="text-xl text-gray-400 max-w-lg font-light leading-relaxed">
            We architect high-fidelity digital experiences and cinematic content using sovereign AI workflows.
          </p>
          
          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a href="#work" className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white px-10 font-medium text-black transition-all duration-300 hover:bg-gray-200">
              <span className="relative z-10 flex items-center gap-2">
                Explore Work
                <span className="material-icons-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
              </span>
            </a>
            
            <button className="group flex items-center gap-3 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <span className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-800 group-hover:border-white transition-colors">
                <span className="material-icons-outlined text-lg">play_arrow</span>
              </span>
              Process Reel
            </button>
          </div>
        </motion.div>

        {/* Visual Content - Replaced Rive with High-End Framer Visual */}
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