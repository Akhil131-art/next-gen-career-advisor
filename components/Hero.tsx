
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface HeroProps {
  user: User | null;
}

const Hero: React.FC<HeroProps> = ({ user }) => {
  const [showMethodology, setShowMethodology] = useState(false);

  return (
    <div className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-900/20 blur-[120px] rounded-full -z-10"></div>
      
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          Map Your Tech Future <br/> with Precision AI.
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
          Next-Gen Career Advisor fuses MBTI cognitive dynamics with Big Five personality traits to architect your optimal career trajectory in the modern tech landscape.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link 
            to={user ? "/test" : "/auth"} 
            className="w-full sm:w-auto px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black text-xl transition-all transform hover:scale-105 shadow-2xl shadow-indigo-600/30"
          >
            Start Your Test
          </Link>
          <button 
            onClick={() => setShowMethodology(true)}
            className="w-full sm:w-auto px-12 py-5 glass text-white rounded-[1.5rem] font-black text-xl hover:bg-slate-800 transition-all border border-slate-700 shadow-xl"
          >
            Learn Methodology
          </button>
        </div>

        {/* Methodology Modal */}
        {showMethodology && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-2xl animate-in fade-in zoom-in duration-300">
            <div className="glass max-w-2xl w-full p-10 md:p-14 rounded-[3rem] border border-indigo-500/20 relative shadow-[0_0_100px_rgba(99,102,241,0.1)]">
              <button 
                onClick={() => setShowMethodology(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white text-3xl transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl text-white">
                  <i className="fa-solid fa-flask"></i>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">The Science</h2>
              </div>

              <div className="space-y-8 text-slate-300">
                <section className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-indigo-500 font-bold">01</div>
                  <div>
                    <h3 className="text-white font-black mb-2 uppercase tracking-widest text-sm">MBTI Cognitive Engine</h3>
                    <p className="text-sm leading-relaxed text-slate-400">By mapping 30 data points across 4 dichotomies, we identify your natural mental preferences—how you perceive information and make decisions.</p>
                  </div>
                </section>
                
                <section className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-indigo-500 font-bold">02</div>
                  <div>
                    <h3 className="text-white font-black mb-2 uppercase tracking-widest text-sm">Big Five Integration</h3>
                    <p className="text-sm leading-relaxed text-slate-400">OCEAN traits provide the empirical foundation for stability and adaptability. We measure openness to innovation, conscientiousness in execution, and social extraversion.</p>
                  </div>
                </section>

                <section className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 text-indigo-500 font-bold">03</div>
                  <div>
                    <h3 className="text-white font-black mb-2 uppercase tracking-widest text-sm">AI Fusion Analysis</h3>
                    <p className="text-sm leading-relaxed text-slate-400">Our real-time AI cross-references your profile with millions of career data points to predict high-satisfaction IT roles and generate actionable, time-bound roadmaps.</p>
                  </div>
                </section>
              </div>

              <button 
                onClick={() => setShowMethodology(false)}
                className="mt-12 w-full py-5 bg-white text-slate-900 font-black text-lg rounded-[1.5rem] hover:bg-indigo-50 transition-all shadow-xl"
              >
                I Understand
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'MBTI Profiles', value: '16', icon: 'fa-shapes' },
            { label: 'OCEAN Traits', value: '5', icon: 'fa-chart-pie' },
            { label: 'IT Careers', value: '50+', icon: 'fa-code' },
            { label: 'Analysis Engine', value: 'Neural AI', icon: 'fa-bolt' }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[2rem] border border-slate-800/50 group hover:border-indigo-500/30 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-slate-900/50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600/10 transition-colors">
                <i className={`fa-solid ${stat.icon} text-indigo-500 text-xl`}></i>
              </div>
              <div className="text-3xl font-black text-white mb-1 leading-none">{stat.value}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-black">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;