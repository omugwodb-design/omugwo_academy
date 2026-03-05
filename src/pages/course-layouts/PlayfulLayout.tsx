import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, Heart, Zap, ArrowRight, ArrowDownRight, Star } from 'lucide-react';
import { COURSE_DATA } from './shared';

export const PlayfulLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF4ED] text-[#1D1D1F] font-sans selection:bg-[#FFD1B3]">
      {/* Navbar Pattern */}
      <div className="h-4 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyIiBmaWxsPSIjRkY3QTVFIi8+PC9zdmc+')] opacity-50" />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-2">
              <Sparkles className="w-4 h-4 text-[#FF5A5F]" />
              <span className="text-sm font-bold uppercase tracking-wider">The Ultimate Guide</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] mb-6">
              Navigate <br/>
              <span className="relative">
                <span className="relative z-10 text-white bg-[#FF5A5F] px-4 py-1 inline-block transform rotate-1">Motherhood</span>
              </span> <br/>
              Like a Pro.
            </h1>
            
            <p className="text-xl mb-10 font-medium text-gray-600 max-w-lg">
              {COURSE_DATA.subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="group relative px-8 py-4 bg-[#FF5A5F] text-white text-lg font-black rounded-2xl hover:-translate-y-1 transition-transform">
                <div className="absolute inset-0 border-2 border-black rounded-2xl" />
                <div className="absolute inset-0 border-2 border-black rounded-2xl translate-x-2 translate-y-2 -z-10 bg-[#FFD1B3] group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                <span className="relative flex items-center gap-2">
                  Enroll for {COURSE_DATA.price} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-[#FFD1B3] rounded-[3rem] rotate-6 transform scale-105 border-4 border-black" />
            <div className="absolute inset-0 bg-[#A5D8FF] rounded-[3rem] -rotate-3 transform scale-105 border-4 border-black" />
            <img 
              src={COURSE_DATA.heroImage} 
              alt="Course" 
              className="relative rounded-[3rem] w-full aspect-square object-cover border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]"
            />
            
            {/* Floating Stats */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-6 bg-white px-6 py-4 rounded-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            >
              <p className="text-3xl font-black text-[#FF5A5F]">{COURSE_DATA.stats.students}+</p>
              <p className="font-bold text-sm">Happy Moms</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Marquee */}
      <div className="border-y-4 border-black bg-white overflow-hidden py-4 flex whitespace-nowrap">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex gap-12 items-center"
        >
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-12">
              <span className="text-2xl font-black uppercase tracking-widest">{COURSE_DATA.stats.duration} Content</span>
              <Star className="w-8 h-8 text-[#FF5A5F] fill-current" />
              <span className="text-2xl font-black uppercase tracking-widest">{COURSE_DATA.stats.lessons} Lessons</span>
              <Heart className="w-8 h-8 text-[#A5D8FF] fill-current" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Modules */}
      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-5xl lg:text-7xl font-black">What's <br/>Inside?</h2>
          <ArrowDownRight className="w-20 h-20 text-[#FF5A5F]" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {COURSE_DATA.modules.map((mod, i) => (
            <motion.div 
              key={mod.id}
              whileHover={{ scale: 1.02, rotate: i % 2 === 0 ? 1 : -1 }}
              className={`p-8 rounded-3xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${
                i % 4 === 0 ? 'bg-[#FFD1B3]' : 
                i % 4 === 1 ? 'bg-[#A5D8FF]' : 
                i % 4 === 2 ? 'bg-[#D4E8B5]' : 'bg-[#FFE5E5]'
              }`}
            >
              <div className="w-12 h-12 bg-white rounded-full border-4 border-black flex items-center justify-center font-black text-xl mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                {i + 1}
              </div>
              <h3 className="text-3xl font-black mb-6">{mod.title.split(': ')[1]}</h3>
              <ul className="space-y-3">
                {mod.lessons.map((lesson, j) => (
                  <li key={j} className="flex items-start gap-3 font-bold bg-white/50 p-3 rounded-xl border-2 border-black">
                    <Zap className="w-5 h-5 shrink-0 mt-0.5" />
                    {lesson}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instructor CTA */}
      <div className="bg-[#1D1D1F] text-white py-32 border-t-4 border-black">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <img src={COURSE_DATA.instructor.avatar} alt="Instructor" className="w-32 h-32 rounded-full border-4 border-white mx-auto mb-8 object-cover" />
          <h2 className="text-4xl lg:text-6xl font-black mb-6">Taught by {COURSE_DATA.instructor.name}</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">{COURSE_DATA.instructor.bio}</p>
          
          <button className="group relative px-12 py-6 bg-white text-black text-2xl font-black rounded-full hover:scale-105 transition-transform">
            <span className="relative z-10 flex items-center gap-3">
              Join the Masterclass
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
