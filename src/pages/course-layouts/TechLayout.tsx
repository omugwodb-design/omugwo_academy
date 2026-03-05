import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { Terminal, Database, Code2, Cpu, ChevronRight, Lock } from 'lucide-react';

export const TechLayout: React.FC = () => {
  const [activeModule, setActiveModule] = useState(COURSE_DATA.modules[0].id);

  return (
    <div className="min-h-screen bg-[#0D0D12] text-[#A0A0AB] font-mono selection:bg-[#3E63DD]/30">
      {/* Top Bar */}
      <div className="h-12 border-b border-[#27272A] flex items-center px-4 justify-between bg-[#0D0D12]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]" />
          </div>
          <span className="text-xs text-[#52525B]">~/omugwo/masterclass/init.ts</span>
        </div>
        <button className="text-xs text-[#3E63DD] hover:text-[#5B7DE5] transition-colors flex items-center gap-1">
          <Terminal className="w-3 h-3" /> [Execute Build]
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main IDE Area */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Hero Panel */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden">
              <div className="h-10 bg-[#27272A]/50 border-b border-[#27272A] flex items-center px-4">
                <span className="text-xs font-bold text-[#E4E4E7]">README.md</span>
              </div>
              <div className="p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h1 className="text-4xl md:text-5xl font-black text-[#E4E4E7] mb-4 tracking-tight">
                    <span className="text-[#3E63DD]">const</span> <span className="text-[#F5D90A]">course</span> = <span className="text-[#10B981]">'Postpartum Masterclass'</span>;
                  </h1>
                  <p className="text-lg text-[#A0A0AB] mb-8 leading-relaxed max-w-2xl">
                    {COURSE_DATA.subtitle}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="px-4 py-2 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center gap-2">
                      <Database className="w-4 h-4 text-[#3E63DD]" />
                      <span className="text-sm">{COURSE_DATA.stats.lessons} Modules</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#10B981]" />
                      <span className="text-sm">{COURSE_DATA.stats.duration} Runtime</span>
                    </div>
                    <div className="px-4 py-2 rounded-lg bg-[#27272A] border border-[#3F3F46] flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-[#F59E0B]" />
                      <span className="text-sm">v1.0.0 Stable</span>
                    </div>
                  </div>

                  <button className="group px-6 py-3 bg-[#E4E4E7] text-[#18181B] font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2">
                    npm install @omugwo/masterclass <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Interactive Curriculum Explorer */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden">
              <div className="h-10 bg-[#27272A]/50 border-b border-[#27272A] flex items-center px-4 gap-4">
                <span className="text-xs font-bold text-[#E4E4E7]">curriculum.json</span>
              </div>
              <div className="flex">
                {/* File Tree */}
                <div className="w-64 border-r border-[#27272A] p-2 hidden sm:block">
                  <div className="text-xs font-bold text-[#52525B] uppercase tracking-wider mb-2 px-2">Explorer</div>
                  {COURSE_DATA.modules.map((mod, i) => (
                    <button
                      key={mod.id}
                      onClick={() => setActiveModule(mod.id)}
                      className={`w-full text-left px-2 py-1.5 rounded text-sm mb-1 transition-colors flex items-center gap-2
                        ${activeModule === mod.id ? 'bg-[#3E63DD]/20 text-[#3E63DD]' : 'hover:bg-[#27272A] text-[#A0A0AB]'}`}
                    >
                      <ChevronRight className={`w-3 h-3 transition-transform ${activeModule === mod.id ? 'rotate-90' : ''}`} />
                      module_{i + 1}.ts
                    </button>
                  ))}
                </div>

                {/* File Content */}
                <div className="flex-1 p-6 bg-[#0D0D12] overflow-x-auto">
                  <AnimatePresence mode="wait">
                    {COURSE_DATA.modules.map(mod => mod.id === activeModule && (
                      <motion.div
                        key={mod.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        <div className="text-[#5B7DE5] mb-4">// {mod.title}</div>
                        <div className="text-[#E4E4E7]">
                          <span className="text-[#3E63DD]">export const</span> moduleData = {'{'}
                        </div>
                        <div className="pl-4 space-y-2 my-2">
                          <div><span className="text-[#93C5FD]">id:</span> <span className="text-[#10B981]">'{mod.id}'</span>,</div>
                          <div><span className="text-[#93C5FD]">duration:</span> <span className="text-[#10B981]">'{mod.duration}'</span>,</div>
                          <div><span className="text-[#93C5FD]">lessons:</span> [</div>
                          <div className="pl-4 space-y-1">
                            {mod.lessons.map((lesson, i) => (
                              <div key={i}><span className="text-[#10B981]">'{lesson}'</span>,</div>
                            ))}
                          </div>
                          <div>]</div>
                        </div>
                        <div className="text-[#E4E4E7]">{'};'}</div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Payment / Terminal Panel */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden sticky top-20">
              <div className="h-10 bg-[#27272A]/50 border-b border-[#27272A] flex items-center px-4">
                <span className="text-xs font-bold text-[#E4E4E7]">checkout.sh</span>
              </div>
              <div className="p-6 font-mono text-sm">
                <div className="text-[#10B981] mb-4">$ ./initialize_enrollment.sh</div>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between">
                    <span className="text-[#A0A0AB]">Target:</span>
                    <span className="text-[#E4E4E7]">Lifetime Access</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A0A0AB]">Discount:</span>
                    <span className="text-[#F59E0B] line-through">{COURSE_DATA.originalPrice}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#27272A] pt-3">
                    <span className="text-[#E4E4E7] font-bold">Total:</span>
                    <span className="text-[#3E63DD] font-bold">{COURSE_DATA.price}</span>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#3E63DD] hover:bg-[#5B7DE5] text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Execute Payment
                </button>
              </div>
            </div>

            {/* Instructor Profile (JSON format) */}
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] overflow-hidden">
              <div className="h-10 bg-[#27272A]/50 border-b border-[#27272A] flex items-center px-4">
                <span className="text-xs font-bold text-[#E4E4E7]">author.json</span>
              </div>
              <div className="p-6 flex gap-4 items-start">
                <img src={COURSE_DATA.instructor.avatar} alt="Author" className="w-16 h-16 rounded border border-[#27272A] object-cover" />
                <div className="text-xs">
                  <div className="text-[#E4E4E7]">{'{'}</div>
                  <div className="pl-4">
                    <div><span className="text-[#93C5FD]">"name":</span> <span className="text-[#10B981]">"{COURSE_DATA.instructor.name}"</span>,</div>
                    <div><span className="text-[#93C5FD]">"role":</span> <span className="text-[#10B981]">"{COURSE_DATA.instructor.role}"</span></div>
                  </div>
                  <div className="text-[#E4E4E7]">{'}'}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
