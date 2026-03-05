import React from 'react';
import { motion } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { ArrowRight, Check } from 'lucide-react';

export const MinimalistLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black font-serif antialiased">
      {/* Editorial Header */}
      <header className="border-b border-black">
        <div className="max-w-screen-2xl mx-auto px-8 py-6 flex justify-between items-center">
          <div className="font-bold tracking-tighter text-2xl uppercase">Omugwo.</div>
          <button className="text-sm font-bold uppercase tracking-widest hover:underline underline-offset-4">
            Enroll Now
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-screen-2xl mx-auto px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <p className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-gray-500">
                A Modern Guide to Postpartum
              </p>
              <h1 className="text-6xl lg:text-8xl font-medium tracking-tighter leading-[0.9] mb-12">
                Reclaim <br />
                Your Body. <br />
                Restore <br />
                Your Mind.
              </h1>
              
              <div className="flex items-center gap-6">
                <button className="px-8 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-3">
                  Start the Journey <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-2xl font-light">{COURSE_DATA.price}</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="aspect-[3/4] relative overflow-hidden group"
            >
              <img 
                src={COURSE_DATA.heroImage} 
                alt="Motherhood" 
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 border border-black/10 m-4 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="border-y border-black bg-gray-50">
        <div className="max-w-screen-xl mx-auto px-8 py-32 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-5xl font-light leading-relaxed max-w-4xl mx-auto"
          >
            "{COURSE_DATA.description}"
          </motion.h2>
        </div>
      </div>

      {/* Curriculum */}
      <div className="max-w-screen-2xl mx-auto px-8 py-32">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <div className="sticky top-12">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8">The Syllabus</h2>
              <p className="text-gray-500 mb-8">{COURSE_DATA.stats.lessons} carefully curated lessons over {COURSE_DATA.stats.duration}.</p>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            <div className="border-t border-black">
              {COURSE_DATA.modules.map((mod, i) => (
                <div key={mod.id} className="group border-b border-black py-8 hover:bg-gray-50 transition-colors cursor-pointer px-4 -mx-4">
                  <div className="flex justify-between items-baseline mb-6">
                    <h3 className="text-2xl lg:text-4xl font-medium tracking-tight">
                      <span className="text-gray-400 text-lg mr-4 font-mono">0{i + 1}</span>
                      {mod.title.split(': ')[1]}
                    </h3>
                    <span className="font-mono text-sm">{mod.duration}</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-y-3 h-0 opacity-0 overflow-hidden group-hover:h-auto group-hover:opacity-100 transition-all duration-500">
                    {mod.lessons.map((lesson, j) => (
                      <div key={j} className="flex items-start gap-3">
                        <Check className="w-4 h-4 mt-1 text-gray-400" />
                        <span className="text-gray-600">{lesson}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Profile */}
      <div className="bg-black text-white">
        <div className="max-w-screen-2xl mx-auto px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src={COURSE_DATA.instructor.avatar} 
                alt={COURSE_DATA.instructor.name}
                className="w-full aspect-[4/5] object-cover filter grayscale"
              />
            </div>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-gray-500">Your Guide</h2>
              <h3 className="text-5xl lg:text-7xl font-medium tracking-tighter mb-6">{COURSE_DATA.instructor.name}</h3>
              <p className="text-xl text-gray-400 mb-12 font-light">{COURSE_DATA.instructor.bio}</p>
              
              <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-12">
                <div>
                  <p className="text-4xl font-light mb-2">{COURSE_DATA.stats.students}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Students Taught</p>
                </div>
                <div>
                  <p className="text-4xl font-light mb-2">{COURSE_DATA.stats.rating}/5.0</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
