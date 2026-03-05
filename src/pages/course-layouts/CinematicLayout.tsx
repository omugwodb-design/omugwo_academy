import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Star, Clock, BookOpen, ChevronRight, Award, CheckCircle2 } from 'lucide-react';
import { COURSE_DATA } from './shared';
import { Button } from '../../components/ui/Button';

export const CinematicCoursePage: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30 font-sans">
      {/* Cinematic Hero */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1, opacity }} className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={COURSE_DATA.videoBg} alt="Background" className="w-full h-full object-cover scale-105" />
        </motion.div>

        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="px-3 py-1 bg-red-600/20 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest border border-red-500/20">Masterclass</span>
              <span className="flex items-center gap-1 text-yellow-500 text-sm font-medium"><Star className="w-4 h-4 fill-current" /> {COURSE_DATA.stats.rating} ({COURSE_DATA.stats.students})</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">{COURSE_DATA.title}</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
              {COURSE_DATA.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white border-0 px-10 h-14 text-lg rounded-full shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                Enroll Now — {COURSE_DATA.price}
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/5 text-white h-14 px-8 rounded-full backdrop-blur-md">
                <Play className="w-5 h-5 mr-2" /> Watch Trailer
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-y border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-around items-center gap-8">
          {[
            { icon: Clock, label: COURSE_DATA.stats.duration, sub: 'of video content' },
            { icon: BookOpen, label: `${COURSE_DATA.stats.lessons} Lessons`, sub: 'comprehensive guide' },
            { icon: Award, label: 'Certificate', sub: 'upon completion' },
            { icon: Star, label: 'Lifetime Access', sub: 'learn at your pace' },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-950/30 flex items-center justify-center border border-red-900/50">
                <stat.icon className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="font-bold text-sm">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-16">
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-24">
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-8">The Definitive Guide to Your Recovery</h2>
            <div className="prose prose-invert prose-lg text-gray-300">
              <p>{COURSE_DATA.description}</p>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-10">Curriculum</h2>
            <div className="space-y-6">
              {COURSE_DATA.modules.map((mod, i) => (
                <div key={mod.id} className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-500 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-red-500 text-sm font-bold tracking-wider uppercase mb-2 block">Module {i + 1}</span>
                      <h3 className="text-2xl font-bold">{mod.title.split(': ')[1]}</h3>
                    </div>
                    <span className="text-gray-500 text-sm flex items-center gap-1"><Clock className="w-4 h-4" />{mod.duration}</span>
                  </div>
                  <ul className="space-y-3">
                    {mod.lessons.map((lesson, j) => (
                      <li key={j} className="flex items-center gap-3 text-gray-400 group-hover:text-gray-200 transition-colors">
                        <Play className="w-4 h-4 text-white/20 group-hover:text-red-500 transition-colors" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/20 blur-[50px] rounded-full" />
              
              <div className="mb-8">
                <img src={COURSE_DATA.instructor.avatar} alt={COURSE_DATA.instructor.name} className="w-20 h-20 rounded-full object-cover mb-4 ring-2 ring-white/10" />
                <h3 className="text-xl font-bold">{COURSE_DATA.instructor.name}</h3>
                <p className="text-red-400 text-sm mb-4">{COURSE_DATA.instructor.role}</p>
                <p className="text-sm text-gray-400">{COURSE_DATA.instructor.bio}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-gray-400">Total Price</span>
                  <div className="text-right">
                    <span className="text-sm text-gray-500 line-through block">{COURSE_DATA.originalPrice}</span>
                    <span className="text-3xl font-black text-white">{COURSE_DATA.price}</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-14 bg-white text-black hover:bg-gray-200 text-lg font-bold rounded-xl mb-4">
                Enroll Now
              </Button>
              <p className="text-xs text-center text-gray-500">30-day money-back guarantee. Full lifetime access.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
