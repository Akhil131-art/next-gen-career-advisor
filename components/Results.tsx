
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, addDoc, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from '../services/firebase';
import { analyzeCareer } from '../services/geminiService';
import { PersonalityResults, CareerRecommendation } from '../types';

const Results: React.FC = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState<PersonalityResults | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  useEffect(() => {
    const data = localStorage.getItem('career_test_results');
    if (data) {
      const parsed = JSON.parse(data);
      setResults(parsed);
      
      const fetchAnalysis = async () => {
        try {
          const res = await analyzeCareer(parsed);
          if (res && res.topMatches) {
            setRecommendations(res.topMatches);
          } else {
            throw new Error("Invalid response format from AI");
          }
        } catch (error: any) {
          console.error("Analysis Error Detailed:", error);
          setErrorInfo(error.message || "An unexpected error occurred during analysis.");
        } finally {
          setLoading(false);
        }
      };
      
      fetchAnalysis();
    } else {
      setLoading(false);
      navigate('/test');
    }
  }, [navigate]);

  const handleSaveRoadmap = async () => {
    const user = auth.currentUser;
    if (!user || !recommendations[selectedIndex]) return;
    
    setIsSaving(true);
    const activeMatch = recommendations[selectedIndex];
    
    try {
      if (results) {
        await setDoc(doc(db, "results", user.uid), results);
      }
      await addDoc(collection(db, "roadmaps"), {
        ...activeMatch,
        userId: user.uid,
        savedAt: new Date().toISOString()
      });
      setSaveStatus('success');
    } catch (err) {
      console.error("Firestore save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-32 text-center">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="fa-solid fa-microchip text-2xl text-indigo-400 animate-pulse"></i>
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase tracking-widest">Architecting Future</h2>
          <p className="text-slate-500 max-w-sm mx-auto font-medium">AI is cross-referencing your 60 psychometric data points with global IT career trends...</p>
        </div>
      </div>
    );
  }

  if (errorInfo || recommendations.length === 0) return (
    <div className="text-center py-24 text-slate-400 glass rounded-[3rem] p-16 max-w-xl mx-auto mt-10 shadow-2xl border border-slate-800">
      <i className="fa-solid fa-triangle-exclamation text-6xl mb-6 text-amber-500/50"></i>
      <p className="text-3xl font-black text-white mb-3">Analysis Interrupted</p>
      <p className="mb-4 font-medium text-red-400/80">Error: {errorInfo || "No recommendations generated."}</p>
      <p className="mb-10 text-sm text-slate-500">Please check your API Key configuration in the .env file and ensure you have an active internet connection.</p>
      <button onClick={() => window.location.reload()} className="bg-indigo-600 px-10 py-4 rounded-2xl text-white font-black shadow-2xl shadow-indigo-600/30">Retry Logic</button>
    </div>
  );

  const activeMatch = recommendations[selectedIndex];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="relative mb-16 rounded-[3.5rem] overflow-hidden bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-slate-800 p-10 md:p-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] -z-10"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
              <i className="fa-solid fa-shield-halved mr-3"></i> Neural Alignment Verified
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6 leading-none">
              Identity: <span className="text-indigo-500">{results?.mbti}</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-xl font-medium leading-relaxed">
              Synthesized results from 60 vectors. Your cognitive profile strongly correlates with the following 5 high-impact technology trajectories.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-4 md:gap-5">
            {results && Object.entries(results.ocean).map(([trait, val]) => (
              <div key={trait} className="flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl glass border border-slate-700 flex flex-col items-center justify-center mb-3 hover:border-indigo-500 transition-all group shadow-xl">
                   <span className="text-white font-black text-2xl leading-none">{val}</span>
                   <span className="text-[10px] text-slate-600 font-black uppercase mt-1">{trait.charAt(0)}</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{trait.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-xl font-black text-white mb-8 flex items-center px-4 uppercase tracking-[0.2em] text-sm">
            <div className="bg-indigo-600 w-2 h-8 rounded-full mr-4"></div>
            Matched Trajectories
          </h3>
          <div className="space-y-5">
            {recommendations.map((match, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  setSaveStatus('idle');
                }}
                className={`w-full group relative overflow-hidden text-left p-8 rounded-[2.5rem] transition-all border-2 ${
                  selectedIndex === idx 
                    ? 'bg-indigo-600 border-indigo-400 shadow-2xl shadow-indigo-600/30 -translate-y-1' 
                    : 'glass border-slate-800/50 hover:border-slate-600 hover:-translate-y-0.5'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedIndex === idx ? 'text-indigo-200' : 'text-slate-500'}`}>
                    Tier {idx + 1} Compatibility
                  </span>
                  <div className={`text-xs font-mono font-black px-3 py-1.5 rounded-xl ${selectedIndex === idx ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-slate-400'}`}>
                    {match.confidence}%
                  </div>
                </div>
                <h4 className={`font-black text-2xl leading-snug ${selectedIndex === idx ? 'text-white' : 'text-slate-200'}`}>
                  {match.career}
                </h4>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-8 space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="glass p-12 md:p-16 rounded-[3.5rem] border border-indigo-500/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-16 opacity-[0.03] rotate-12">
              <i className="fa-solid fa-rocket text-[15rem] text-white"></i>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
              <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">{activeMatch.career}</h2>
              <div className="flex gap-2">
                <span className="px-5 py-2 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest rounded-full">
                   Optimal Match
                </span>
              </div>
            </div>
            
            <p className="text-2xl text-slate-300 leading-relaxed mb-16 border-l-8 border-indigo-500/50 pl-10 italic font-medium">
              "{activeMatch.description}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center">
                  <i className="fa-solid fa-code text-indigo-500 mr-4"></i> Skill Stack
                </h4>
                <div className="flex flex-wrap gap-3">
                  {activeMatch.skills.map((s, i) => (
                    <div key={i} className="flex items-center px-6 py-4 bg-slate-900/50 border border-slate-800 rounded-3xl text-slate-200 text-sm font-bold hover:border-indigo-500/50 transition-all shadow-md">
                      <i className="fa-solid fa-chevron-right text-indigo-600 mr-3 text-xs"></i>
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center">
                  <i className="fa-solid fa-certificate text-yellow-500 mr-4"></i> Credentials
                </h4>
                <div className="space-y-4">
                  {activeMatch.certifications.map((cert, i) => (
                    <a 
                      key={i} 
                      href={cert.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-slate-900/80 to-indigo-900/10 border border-slate-800 rounded-[2rem] group hover:border-indigo-500/40 transition-all shadow-xl"
                    >
                      <div className="flex items-center pr-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mr-5 group-hover:bg-indigo-600 transition-all shadow-inner">
                          <i className="fa-solid fa-link text-xs text-slate-500 group-hover:text-white"></i>
                        </div>
                        <span className="font-bold text-slate-300 group-hover:text-white text-sm leading-tight">{cert.name}</span>
                      </div>
                      <i className="fa-solid fa-arrow-right-from-bracket text-slate-700 group-hover:text-indigo-500 transition-colors text-xs"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12">
            <h3 className="text-4xl font-black text-white mb-20 flex items-center px-6 uppercase tracking-widest">
              <i className="fa-solid fa-timeline text-indigo-500 mr-5"></i> Execution Roadmap
            </h3>
            <div className="relative border-l-4 border-indigo-500/20 ml-8 md:ml-20 space-y-16">
              {activeMatch.roadmap.map((step, i) => (
                <div key={i} className="relative pl-16 md:pl-24 group">
                  <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center group-hover:scale-150 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                  
                  <div className="glass p-12 rounded-[3.5rem] border border-slate-800 group-hover:border-indigo-500/30 transition-all hover:bg-indigo-500/[0.03] shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
                      <div className="flex items-center gap-6">
                        <span className="text-5xl font-black text-indigo-500/10 group-hover:text-indigo-500/40 transition-colors">0{i + 1}</span>
                        <h4 className="text-3xl font-black text-white group-hover:text-indigo-400 transition-colors">{step.title}</h4>
                      </div>
                      <div className="flex items-center px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl text-xs font-black tracking-widest uppercase">
                        <i className="fa-solid fa-calendar-days mr-3"></i> {step.duration}
                      </div>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-xl font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col items-center py-24">
             <button 
              onClick={handleSaveRoadmap}
              disabled={isSaving || saveStatus === 'success'}
              className={`px-20 py-8 rounded-[2.5rem] font-black text-3xl transition-all shadow-2xl flex items-center space-x-6 border-4 ${
                saveStatus === 'success' 
                  ? 'bg-green-600/10 border-green-500/50 text-green-500' 
                  : 'bg-white text-slate-900 hover:bg-indigo-50 hover:scale-105 border-transparent shadow-white/5'
              }`}
             >
                {isSaving ? (
                  <><i className="fa-solid fa-spinner animate-spin mr-3"></i> Syncing DB...</>
                ) : saveStatus === 'success' ? (
                  <><i className="fa-solid fa-check-double mr-3"></i> Trajectory Persisted</>
                ) : (
                  <>Finalize & Persist Roadmap</>
                )}
             </button>
             <p className="mt-8 text-slate-500 text-sm font-black uppercase tracking-[0.3em]">
                {saveStatus === 'success' ? 'Synchronized with Cloud Storage' : 'Push current projection to real-time database'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
