import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { COURSE_DATA } from './shared';

export const StorytellingLayout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div ref={containerRef} className="min-h-[200vh] bg-[#faf8f5] text-[#3e3a35] font-serif overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />
      
      <div className="max-w-5xl mx-auto px-8 pt-32 relative">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, ease: "easeOut" }} className="mb-32">
          <p className="text-sm tracking-[0.3em] uppercase mb-8 text-[#8c8273]">Chapter 01: The Beginning</p>
          <h1 className="text-6xl md:text-8xl font-light leading-[1.1] mb-12">
            Every mother has a story. <br/>
            <span className="italic text-[#c2b29f]">This is yours.</span>
          </h1>
          <p className="text-xl md:text-2xl text-[#8c8273] max-w-2xl leading-relaxed">
            {COURSE_DATA.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 relative">
          <motion.div style={{ y: y1 }} className="space-y-16">
            <img src={COURSE_DATA.heroImage} className="w-full aspect-[3/4] object-cover rounded-sm shadow-2xl" alt="Motherhood" />
            <div className="p-8 bg-white shadow-xl">
              <h3 className="text-2xl mb-4 italic">The Journey</h3>
              <p className="text-[#8c8273] leading-loose">{COURSE_DATA.description}</p>
            </div>
          </motion.div>

          <motion.div style={{ y: y2 }} className="md:mt-48 space-y-16">
            <div className="p-12 bg-[#3e3a35] text-[#faf8f5]">
              <h3 className="text-sm tracking-[0.3em] uppercase mb-8 text-[#c2b29f]">The Guide</h3>
              <img src={COURSE_DATA.instructor.avatar} className="w-24 h-24 rounded-full object-cover mb-6 grayscale" alt="Instructor" />
              <h4 className="text-3xl mb-4">{COURSE_DATA.instructor.name}</h4>
              <p className="text-[#c2b29f] leading-relaxed">{COURSE_DATA.instructor.bio}</p>
            </div>
            <img src={COURSE_DATA.videoBg} className="w-full aspect-square object-cover rounded-sm shadow-2xl" alt="Details" />
          </motion.div>
        </div>

        <div className="py-48 text-center">
          <h2 className="text-4xl md:text-6xl italic mb-12">Begin your next chapter.</h2>
          <button className="px-12 py-5 bg-[#3e3a35] text-[#faf8f5] text-sm tracking-[0.2em] uppercase hover:bg-[#2a2723] transition-colors">
            Enroll for {COURSE_DATA.price}
          </button>
        </div>
      </div>
    </div>
  );
};
