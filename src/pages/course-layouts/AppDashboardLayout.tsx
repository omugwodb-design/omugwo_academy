import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { LayoutDashboard, BookOpen, Clock, Award, PlayCircle, Lock } from 'lucide-react';

export const AppDashboardLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans">
      <div className="flex h-screen overflow-hidden">
        
        {/* App Sidebar */}
        <div className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h1 className="font-black text-xl text-indigo-600">Omugwo<span className="text-slate-900">App</span></h1>
          </div>
          <div className="p-4 flex-1">
            <div className="space-y-1">
              {['Overview', 'Curriculum', 'Instructor', 'Reviews'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    activeTab === tab.toLowerCase() ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-slate-100">
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">
              Enroll {COURSE_DATA.price}
            </button>
          </div>
        </div>

        {/* Main App Content */}
        <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-4xl mx-auto p-6 md:p-12">
            
            {/* Header Area */}
            <div className="mb-12 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg uppercase tracking-wider">Premium Course</span>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg uppercase tracking-wider">{COURSE_DATA.stats.rating} Rating</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-800">{COURSE_DATA.title}</h1>
              <p className="text-lg text-slate-500 mb-8">{COURSE_DATA.subtitle}</p>
              
              <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center"><Clock className="w-5 h-5 text-indigo-600" /></div>
                  <div><p className="text-sm font-bold text-slate-900">{COURSE_DATA.stats.duration}</p><p className="text-xs text-slate-500">Duration</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-purple-600" /></div>
                  <div><p className="text-sm font-bold text-slate-900">{COURSE_DATA.stats.lessons} Lessons</p><p className="text-xs text-slate-500">Comprehensive</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center"><Award className="w-5 h-5 text-pink-600" /></div>
                  <div><p className="text-sm font-bold text-slate-900">Certificate</p><p className="text-xs text-slate-500">On Completion</p></div>
                </div>
              </div>
            </div>

            {/* Video Player Mockup */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 mb-12 bg-black aspect-video md:aspect-[21/9]">
              <img src={COURSE_DATA.videoBg} className="w-full h-full object-cover opacity-60" alt="Preview" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <PlayCircle className="w-10 h-10 text-white" />
                </button>
              </div>
              <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="h-1.5 w-full bg-white/30 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-indigo-500" />
                </div>
              </div>
            </div>

            {/* Curriculum List */}
            <h2 className="text-2xl font-black mb-6">Course Modules</h2>
            <div className="space-y-4">
              {COURSE_DATA.modules.map((mod, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={mod.id} 
                  className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-200"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg">{mod.title.split(': ')[1]}</h3>
                      <p className="text-sm text-slate-500">{mod.lessons.length} Lessons • {mod.duration}</p>
                    </div>
                  </div>
                  <Lock className="w-5 h-5 text-slate-300" />
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
