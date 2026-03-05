import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { PlayCircle, ShieldCheck, Gem } from 'lucide-react';

export const LuxuryLayout: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C2C2C] font-serif selection:bg-[#D4AF37]/30">
      
      {/* Refined Navigation */}
      <nav className="absolute top-0 w-full z-50 px-8 py-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent text-white">
        <div className="tracking-[0.3em] text-sm uppercase">Omugwo Academy</div>
        <button className="text-xs uppercase tracking-[0.2em] border border-white/30 px-6 py-2 rounded-sm hover:bg-white hover:text-black transition-colors">
          Boutique
        </button>
      </nav>

      {/* Hero: Luxury Magazine Style */}
      <div className="h-screen relative overflow-hidden flex items-center">
        <motion.div style={{ y }} className="absolute inset-0 z-0">
          <img 
            src={COURSE_DATA.heroImage} 
            alt="Luxury Motherhood" 
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-[#2C2C2C]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#FDFBF7]" />
        </motion.div>

        <div className="relative z-10 w-full px-8 md:px-16 text-center mt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <h2 className="text-[#D4AF37] tracking-[0.4em] text-xs uppercase mb-8 font-sans">The Signature Collection</h2>
            <h1 className="text-5xl md:text-8xl font-light text-white mb-6 tracking-wide drop-shadow-lg">
              The Postpartum <br /> <span className="italic font-serif">Masterclass</span>
            </h1>
            <p className="text-white/90 font-sans font-light tracking-wide max-w-xl mx-auto text-lg md:text-xl drop-shadow">
              Curated expertise for the modern mother. A refined approach to healing and wellness.
            </p>
          </motion.div>
        </div>
      </div>

      {/* The Experience Section */}
      <div className="max-w-6xl mx-auto px-8 py-32">
        <div className="text-center mb-24">
          <Gem className="w-8 h-8 mx-auto text-[#D4AF37] mb-6" />
          <h2 className="text-3xl font-light uppercase tracking-[0.2em] mb-8">The Experience</h2>
          <div className="w-px h-16 bg-[#D4AF37] mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-4xl italic font-light leading-tight">"A masterclass that elevates the standard of maternal care."</h3>
            <p className="font-sans font-light text-[#555] leading-relaxed text-lg">
              {COURSE_DATA.description}
            </p>
            <div className="flex items-center gap-6 pt-8 border-t border-[#EAEAEA]">
              <img src={COURSE_DATA.instructor.avatar} alt="Expert" className="w-16 h-16 rounded-full object-cover grayscale" />
              <div>
                <p className="font-sans font-medium uppercase tracking-widest text-sm">{COURSE_DATA.instructor.name}</p>
                <p className="font-sans font-light text-xs text-[#888] tracking-wider">{COURSE_DATA.instructor.role}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 border border-[#D4AF37] translate-x-4 -translate-y-4" />
            <img src={COURSE_DATA.videoBg} alt="Experience" className="relative z-10 w-full aspect-[3/4] object-cover" />
            <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-24 h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform">
              <PlayCircle className="w-8 h-8 text-[#2C2C2C] font-light" strokeWidth={1} />
            </button>
          </motion.div>
        </div>
      </div>

      {/* The Curriculum (Boutique Menu Style) */}
      <div className="bg-[#2C2C2C] text-[#FDFBF7] py-32">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-sm font-sans font-light uppercase tracking-[0.4em] text-[#D4AF37] mb-4">The Curriculum</h2>
            <h3 className="text-4xl italic font-light">Program Itinerary</h3>
          </div>

          <div className="space-y-16">
            {COURSE_DATA.modules.map((mod, i) => (
              <div key={mod.id} className="relative pl-12 border-l border-white/20 pb-8">
                <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full border border-[#D4AF37] bg-[#2C2C2C]" />
                <span className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] block mb-2">PART 0{i + 1}</span>
                <h4 className="text-3xl font-light mb-6">{mod.title.split(': ')[1]}</h4>
                <ul className="space-y-4">
                  {mod.lessons.map((lesson, j) => (
                    <li key={j} className="flex items-center justify-between font-sans font-light text-sm text-[#CCC] border-b border-white/10 pb-4">
                      <span>{lesson}</span>
                      <span className="italic text-[#888]">Included</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acquisition / Pricing */}
      <div className="py-32 px-8 text-center max-w-2xl mx-auto">
        <ShieldCheck className="w-8 h-8 mx-auto text-[#D4AF37] mb-8" />
        <h2 className="text-4xl font-light mb-6">Acquire Access</h2>
        <p className="font-sans font-light text-[#555] mb-12">
          Lifetime access to the complete masterclass, curated resources, and priority support.
        </p>
        
        <div className="border border-[#EAEAEA] p-12 bg-white relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            <span className="font-sans text-xs tracking-[0.2em] text-[#D4AF37] uppercase">Investment</span>
          </div>
          
          <div className="flex justify-center items-baseline gap-4 mb-8">
            <span className="text-xl text-[#888] line-through font-sans font-light">{COURSE_DATA.originalPrice}</span>
            <span className="text-5xl font-light">{COURSE_DATA.price}</span>
          </div>

          <button className="w-full bg-[#2C2C2C] text-white font-sans font-light tracking-[0.2em] uppercase py-5 text-sm hover:bg-black transition-colors">
            Reserve Your Place
          </button>
        </div>
      </div>

    </div>
  );
};
