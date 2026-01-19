import React from 'react';
import { motion } from 'framer-motion';
import { WorkItem } from '../types.ts';

const works: WorkItem[] = [
  { 
    id: '1', 
    title: 'Project Aether', 
    category: 'Generative Product Campaign', 
    year: '2025', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAekvWeorw2WeUx5SJ4LPhldabBtDuU5NUJmA4Llh2uxF8N5Pb40BTfadQmnNYGxol7JHrNqC4CwD_f_tL6qMBHJ-Qlz25xXEf1w-RP3MeKMzvAsGixyuWURNMol6m3pEEDJa6-nZFecn5-cHaZ4tS-ACs5XtslPejQ7kDqLtxNU6PbSbLx-f82ek9ep0oruuUiepbgk3Q0Re95d8_vYIhmc0xMo7ApKyChmcpZJl7R7GYv_xZM46RrjlXW1WHXBzERAuen9SE72lpW', 
    wide: true 
  },
  { 
    id: '2', 
    title: 'Datastream V', 
    category: 'Automated Interface Design', 
    year: '2023', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3nS3RQhoUZaEfXNCoz-Vp-QPhHtWHknO4lQoYGlto4VtANcjbFYji7z7kwPros1PqgNgXSnrne6KIVXu0gOEtrrqk_m5yLyfrQdlE4cMsa0MnGJvwI7227NGHWHTXoKiSex_qUf-86rPPtFHgwaQUTTE8hCTqcAMAipUfUbl87pAzNgiv5MmHp0S0WtsPWqHTwBrc5UBfJNQqiUDmSVveHBF1IzMhGxmwc2dOOJLNUh7gMdI3rRo1KiHBj_c-O4nziYRs6guibMFl', 
    wide: false 
  },
  { 
    id: '3', 
    title: 'Kinetic Labs', 
    category: 'AI Robotics Showcase', 
    year: '2024', 
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCiKKEjsyiCxcIa06-pAWqR8VqzdcupDSP0VcqUWD6o6-aLPBSzMQZ1JxTeTwcZEIv7oBnZyorY1dZc4bfpiPI-pzI0rEMT2K68dgbj6-Ks4GV_Pv2Fw2sp4FwqEkeErkyajFxYkDOU1Phm0ZPVrwFVnuwikjWXKNz9ngXEGUlrAu84BKt-hlvLCHo1bqy5EXOFpPSSBu1Wot_CQs_GEmcVB-bAAi_LVNFffpI3fP03ljOTS7nSFUMYfCVlazCTjRyX4HLAqhMYAsPR', 
    wide: false 
  },
];

const WorkCard: React.FC<{ item: WorkItem }> = ({ item }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7 }}
    className={`group cursor-pointer ${item.wide ? 'col-span-1 md:col-span-2' : 'col-span-1'}`}
  >
    <div className="relative overflow-hidden rounded-2xl bg-surface mb-6 aspect-[4/3] md:aspect-video border border-white/5">
      <img 
        src={item.image} 
        alt={item.title} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105 opacity-80 group-hover:opacity-100" 
      />
      
      {/* Overlay Details for Wide Card */}
      {item.wide && (
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex justify-between items-end bg-gradient-to-t from-black/80 to-transparent">
          <div>
            <h3 className="text-white text-3xl font-display font-medium mb-2">{item.title}</h3>
            <p className="text-white/70 text-sm">{item.category}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform translate-y-4 group-hover:translate-y-0">
             <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center">
                <span className="material-icons-outlined">arrow_outward</span>
             </div>
          </div>
        </div>
      )}
    </div>

    {/* Details for Standard Cards */}
    {!item.wide && (
      <div className="flex justify-between items-center border-t border-white/10 pt-5 group-hover:border-white/30 transition-colors">
        <div>
          <h3 className="text-2xl font-display font-medium text-white mb-1">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.category}</p>
        </div>
        <span className="text-xs uppercase border border-white/10 px-3 py-1.5 rounded-full text-gray-400">{item.year}</span>
      </div>
    )}
  </motion.div>
);

const Work: React.FC = () => {
  return (
    <section id="work" className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 block">Selected Works</span>
          <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-white">Digital Sculptures.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {works.map((work) => (
            <WorkCard key={work.id} item={work} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;