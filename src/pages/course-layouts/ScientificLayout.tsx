import React from 'react';
import { motion } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { Activity, Beaker, Dna, FileHeart, ChevronRight } from 'lucide-react';

export const ScientificLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1E293B] font-sans selection:bg-[#3B82F6]/30">
      
      {/* Clinical Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600 font-bold tracking-tight">
            <Activity className="w-5 h-5" /> Omugwo Clinical
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <span>Evidence-Based</span>
            <span>Peer Reviewed</span>
            <span>Medically Sound</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-12 gap-12">
        
        {/* Left: Content */}
        <div className="lg:col-span-7 space-y-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase tracking-wider mb-6">
              Clinical Program / V2.4
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight mb-6">
              The Science of Postpartum Recovery
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              A comprehensive clinical protocol bridging the gap between traditional practices and modern medical evidence.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Dna, title: 'Physiological Healing' },
                { icon: Beaker, title: 'Nutritional Science' },
                { icon: Activity, title: 'Mental Wellness Protocol' },
                { icon: FileHeart, title: 'Pediatric Fundamentals' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-sm text-slate-700">{item.title}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="prose prose-slate prose-lg max-w-none bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-600 rounded-full" /> Abstract
            </h2>
            <p>{COURSE_DATA.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <div className="w-2 h-6 bg-blue-600 rounded-full" /> Curriculum Methodology
            </h2>
            <div className="space-y-4">
              {COURSE_DATA.modules.map((mod, i) => (
                <div key={mod.id} className="bg-white p-6 rounded-xl border border-slate-200 flex gap-6 items-start">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center font-mono font-bold text-slate-400 shrink-0">
                    M{i+1}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">{mod.title.split(': ')[1]}</h3>
                    <div className="flex flex-wrap gap-2">
                      {mod.lessons.map((lesson, j) => (
                        <span key={j} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-md text-xs font-medium text-slate-600">
                          {lesson}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Sidebar / Purchase */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-6">
            
            {/* Payment Panel */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200">
              <img src={COURSE_DATA.heroImage} className="w-full aspect-video object-cover rounded-xl mb-6" alt="Clinical setup" />
              
              <div className="flex justify-between items-baseline mb-6 border-b border-slate-100 pb-6">
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Access Fee</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-slate-900">{COURSE_DATA.price}</span>
                    <span className="text-sm text-slate-400 line-through">{COURSE_DATA.originalPrice}</span>
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {['12 Hours of Clinical Video Content', '48 Protocol Documentation Files', 'Lifetime Platform Access', 'Certificate of Completion'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    <ChevronRight className="w-4 h-4 text-blue-500" /> {item}
                  </li>
                ))}
              </ul>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex justify-center items-center gap-2">
                Gain Immediate Access <Activity className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Author Profile */}
            <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <img src={COURSE_DATA.instructor.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-slate-700" alt="Author" />
                <div>
                  <h3 className="font-bold text-lg">{COURSE_DATA.instructor.name}</h3>
                  <p className="text-blue-400 text-sm font-medium">{COURSE_DATA.instructor.role}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {COURSE_DATA.instructor.bio}
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
