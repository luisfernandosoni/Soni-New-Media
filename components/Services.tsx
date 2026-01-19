import React from 'react';
import { motion } from 'framer-motion';
import { ServiceItem } from '../types.ts';

const services: ServiceItem[] = [
  { id: '1', number: '01', icon: 'smart_toy', title: 'AI Automation', description: 'Streamline creative workflows by integrating intelligent agents that handle repetitive tasks with precision.' },
  { id: '2', number: '02', icon: 'movie_filter', title: 'Hybrid Filmmaking', description: 'Merging traditional cinematography with generative video models to create impossible shots.' },
  { id: '3', number: '03', icon: 'psychology', title: 'AI Agents', description: 'Custom-trained LLMs that understand your brand voice and execute complex customer interactions.' },
  { id: '4', number: '04', icon: 'web', title: 'High-End Web', description: 'Performant, aesthetically superior landing pages designed for maximum conversion and brand impact.' },
  { id: '5', number: '05', icon: 'campaign', title: 'Meta Ads & Scale', description: 'Data-driven acquisition strategies powered by AI targeting algorithms to scale revenue.' },
];

const Card: React.FC<{ item: ServiceItem; index: number }> = ({ item, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="group p-10 rounded-3xl bg-surface border border-white/5 hover:border-white/20 transition-all duration-500 hover:shadow-2xl hover:shadow-white/5 hover:-translate-y-2 cursor-default min-h-[320px] flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <span className="material-icons-outlined text-3xl text-gray-500 group-hover:text-white transition-colors duration-300">{item.icon}</span>
      <span className="text-xs font-mono text-gray-700 group-hover:text-gray-500 transition-colors">{item.number}</span>
    </div>
    <div>
      <h3 className="text-2xl font-display font-medium mb-4 text-white">{item.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300">{item.description}</p>
    </div>
  </motion.div>
);

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-6 block">Capabilities</span>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-tight text-white">Our Intelligence.</h2>
          </div>
          <p className="text-gray-400 max-w-sm mt-8 md:mt-0 text-right md:text-left leading-relaxed">
            We bridge the gap between artistic direction and computational efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={service.id} item={service} index={index} />
          ))}
          
          {/* CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="group p-10 rounded-3xl bg-white text-black border border-white hover:opacity-90 transition-all duration-300 cursor-pointer min-h-[320px] flex flex-col justify-center items-center text-center relative overflow-hidden"
          >
             <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-medium mb-3">Custom Solution?</h3>
              <p className="text-gray-600 text-sm mb-8">Let's architect something new.</p>
              <span className="inline-block border-b border-black pb-1 uppercase tracking-widest text-xs font-bold">Get in touch</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;