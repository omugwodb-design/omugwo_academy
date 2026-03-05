import React from 'react';
import { motion } from 'framer-motion';
import { COURSE_DATA } from './shared';
import { CheckCircle2, TrendingUp, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export const SalesFocusedLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-200">
      {/* Urgency Banner */}
      <div className="bg-rose-600 text-white text-center py-3 px-4 font-bold text-sm tracking-wide">
        🔥 ENROLLMENT CLOSING SOON: Join 8,000+ mothers transforming their postpartum experience.
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.05] text-slate-900">
              Survive to Thrive: <span className="text-rose-600">The Postpartum Blueprint</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
              {COURSE_DATA.subtitle}
            </p>
            <div className="flex flex-col gap-4">
              <button className="w-full sm:w-auto px-10 py-5 bg-rose-600 text-white font-black text-xl rounded-xl shadow-[0_10px_40px_-10px_rgba(225,29,72,0.5)] hover:bg-rose-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                ENROLL NOW - {COURSE_DATA.price} <ArrowRight className="w-6 h-6" />
              </button>
              <div className="flex items-center justify-center sm:justify-start gap-4 text-sm font-bold text-slate-500">
                <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-green-500" /> 30-Day Guarantee</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> Lifetime Access</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[8px] border-slate-100">
              <img src={COURSE_DATA.heroImage} className="w-full aspect-[4/3] object-cover" alt="Course Hero" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-4 flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+20}`} className="w-10 h-10 rounded-full border-2 border-white" alt="Student" />)}
                  </div>
                  <div>
                    <div className="flex text-yellow-500 text-xs">â˜…â˜…â˜…â˜…â˜…</div>
                    <p className="text-xs font-bold text-slate-800">Loved by {COURSE_DATA.stats.students} moms</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Pain vs Solution */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-center mb-16">Does this sound familiar?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-black text-xl">X</div>
              <ul className="space-y-4">
                <li className="flex gap-3 text-slate-600"><span className="text-rose-500">✗</span> Feeling overwhelmed by conflicting advice</li>
                <li className="flex gap-3 text-slate-600"><span className="text-rose-500">✗</span> Anxious about physical recovery and pain</li>
                <li className="flex gap-3 text-slate-600"><span className="text-rose-500">✗</span> Struggling to balance tradition with modern care</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-green-500 relative transform md:-translate-y-4">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-black text-xl">✓</div>
              <ul className="space-y-4">
                <li className="flex gap-3 font-bold text-slate-800"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> Clear, medically-backed recovery roadmap</li>
                <li className="flex gap-3 font-bold text-slate-800"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> Confident decision-making for your baby</li>
                <li className="flex gap-3 font-bold text-slate-800"><CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" /> Supportive digital village at your fingertips</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Overview */}
      <div className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">What You'll Learn</h2>
          <p className="text-lg text-slate-500">A step-by-step system designed for the sleep-deprived parent.</p>
        </div>
        <div className="space-y-6">
          {COURSE_DATA.modules.map((mod, i) => (
            <div key={mod.id} className="group bg-white border-2 border-slate-100 p-6 rounded-2xl hover:border-rose-500 transition-colors cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-2xl font-black text-slate-400 group-hover:bg-rose-100 group-hover:text-rose-600 transition-colors">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 text-slate-800">{mod.title.split(': ')[1]}</h3>
                <p className="text-slate-500">{mod.lessons.length} High-Impact Lessons • {mod.duration}</p>
              </div>
              <button className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing / Final CTA */}
      <div className="bg-slate-900 text-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to take control of your recovery?</h2>
          <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Lifetime Access</h3>
            <div className="flex justify-center items-end gap-3 mb-8">
              <span className="text-3xl text-slate-400 line-through decoration-rose-500">{COURSE_DATA.originalPrice}</span>
              <span className="text-6xl font-black text-slate-900">{COURSE_DATA.price}</span>
            </div>
            <button className="w-full py-6 bg-rose-600 hover:bg-rose-700 text-white text-2xl font-black rounded-2xl shadow-xl transition-transform hover:scale-105 mb-6">
              YES! I WANT IN
            </button>
            <p className="text-slate-500 font-medium">Secure, 1-click checkout. 30-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
