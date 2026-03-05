import React from 'react';
import { motion } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { Heart, Sun, Users, BookOpen } from 'lucide-react';

export const CulturalLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDF8F5] text-[#4A3B32] font-serif">
      {/* Hero with Traditional Patterns */}
      <div className="relative pt-24 pb-32 overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#8C5A35 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 border border-[#8C5A35] rounded-full text-xs tracking-widest uppercase mb-8 text-[#8C5A35]">
              Honoring Our Heritage
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-[#2D241E] leading-tight">
              The Modern <br/>
              <span className="italic text-[#8C5A35]">Omugwo</span> Experience
            </h1>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed opacity-80 font-sans">
              {COURSE_DATA.subtitle}
            </p>
          </div>

          <div className="relative rounded-t-[100px] rounded-b-[20px] overflow-hidden shadow-2xl border-8 border-white max-w-4xl mx-auto">
            <img src={COURSE_DATA.heroImage} alt="Heritage" className="w-full aspect-video object-cover filter sepia-[0.2]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/80 to-transparent flex items-end justify-center pb-12">
              <button className="px-8 py-4 bg-[#8C5A35] text-white font-sans font-bold tracking-widest uppercase text-sm rounded-full hover:bg-[#6b4428] transition-colors">
                Join the Village — {COURSE_DATA.price}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy */}
      <div className="bg-[#8C5A35] text-[#FDF8F5] py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Sun className="w-12 h-12 mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl md:text-5xl italic font-light leading-relaxed">
            "{COURSE_DATA.description}"
          </h2>
        </div>
      </div>

      {/* Modules with Earthy Tones */}
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="flex justify-between items-end mb-16 border-b border-[#E8DCC4] pb-8">
          <h2 className="text-4xl font-bold text-[#2D241E]">The Journey</h2>
          <span className="font-sans text-sm tracking-widest uppercase opacity-60">4 Pillars of Healing</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {COURSE_DATA.modules.map((mod, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              key={mod.id} 
              className="flex gap-8 group"
            >
              <div className="w-16 h-16 rounded-full border border-[#8C5A35] flex items-center justify-center font-sans font-bold text-xl text-[#8C5A35] group-hover:bg-[#8C5A35] group-hover:text-white transition-colors shrink-0">
                0{i + 1}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 text-[#2D241E]">{mod.title.split(': ')[1]}</h3>
                <ul className="space-y-3 font-sans">
                  {mod.lessons.map((lesson, j) => (
                    <li key={j} className="flex gap-3 text-sm opacity-80">
                      <span className="text-[#8C5A35]">•</span> {lesson}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Elder / Instructor */}
      <div className="bg-[#E8DCC4] py-32">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <img src={COURSE_DATA.instructor.avatar} alt={COURSE_DATA.instructor.name} className="w-full aspect-[4/5] object-cover rounded-t-full shadow-lg filter grayscale" />
          <div>
            <h2 className="text-xs font-sans tracking-[0.2em] uppercase text-[#8C5A35] mb-4">Your Guide</h2>
            <h3 className="text-5xl font-bold mb-6 text-[#2D241E]">{COURSE_DATA.instructor.name}</h3>
            <p className="text-xl italic mb-8 opacity-80">"{COURSE_DATA.instructor.role}"</p>
            <p className="font-sans leading-relaxed opacity-70 mb-12">
              {COURSE_DATA.instructor.bio}
            </p>
            <div className="grid grid-cols-2 gap-8 font-sans border-t border-[#8C5A35]/20 pt-8">
              <div>
                <p className="text-3xl font-bold text-[#8C5A35]">{COURSE_DATA.stats.students}</p>
                <p className="text-sm uppercase tracking-wider opacity-60">Mothers Guided</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#8C5A35]">{COURSE_DATA.stats.lessons}</p>
                <p className="text-sm uppercase tracking-wider opacity-60">Teachings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
