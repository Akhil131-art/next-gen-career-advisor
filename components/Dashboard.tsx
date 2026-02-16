
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, db } from '../services/firebase';
import { SavedRoadmap, PersonalityResults, User } from '../types';

const Dashboard: React.FC = () => {
  const [savedRoadmaps, setSavedRoadmaps] = useState<SavedRoadmap[]>([]);
  const [personality, setPersonality] = useState<PersonalityResults | null>(null);
  const [loading, setLoading] = useState(true);

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        // 1. Fetch saved roadmaps from Firestore
        const roadmapQuery = query(
          collection(db, "roadmaps"), 
          where("userId", "==", currentUser.uid)
        );
        const roadmapSnap = await getDocs(roadmapQuery);
        const roadmaps = roadmapSnap.docs.map(d => ({ id: d.id, ...d.data() } as SavedRoadmap));
        setSavedRoadmaps(roadmaps);

        // 2. Fetch personality results from Firestore
        const personalityDoc = await getDoc(doc(db, "results", currentUser.uid));
        if (personalityDoc.exists()) {
          setPersonality(personalityDoc.data() as PersonalityResults);
        }
      } catch (err) {
        console.error("Error fetching Firestore data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-32 text-center">
        <div className="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Querying Real-time Database...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tighter">Student Terminal</h1>
          <p className="text-slate-500 font-medium">Real-time sync active across all modules.</p>
        </div>
        <Link 
          to="/test" 
          className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black flex items-center transition-all shadow-2xl shadow-indigo-600/30"
        >
          <i className="fa-solid fa-bolt mr-3"></i>
          {personality ? 'Retake Analysis' : 'Initialize Assessment'}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Summary Card */}
        <div className="lg:col-span-1 glass p-10 rounded-[3rem] border border-slate-800 flex flex-col items-center shadow-2xl">
          <div className="relative mb-8">
            <div className="w-32 h-32 rounded-[2.8rem] bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden border-4 border-slate-900">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                currentUser?.displayName?.charAt(0) || 'U'
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
               <i className="fa-solid fa-check text-white text-[10px]"></i>
            </div>
          </div>
          
          <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{currentUser?.displayName || 'User'}</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-10">{currentUser?.email}</p>
          
          <div className="w-full space-y-4">
            <div className="flex justify-between items-center p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
              <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Sessions</span>
              <span className="text-white font-black">{personality ? 1 : 0}</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-slate-900/50 rounded-2xl border border-slate-800">
              <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">Saved Trajectories</span>
              <span className="text-white font-black">{savedRoadmaps.length}</span>
            </div>
          </div>

          <Link to="/profile" className="mt-10 text-indigo-400 text-xs font-black uppercase tracking-[0.2em] hover:text-indigo-300 transition-colors">
            Profile Settings <i className="fa-solid fa-arrow-right ml-2"></i>
          </Link>
        </div>

        {/* Saved Content */}
        <div className="lg:col-span-2 space-y-10">
          <h3 className="text-xl font-black text-white flex items-center uppercase tracking-widest">
            <i className="fa-solid fa-route text-indigo-500 mr-4"></i>
            Active Learning Paths
          </h3>
          
          {savedRoadmaps.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
              {savedRoadmaps.map((roadmap) => (
                <div key={roadmap.id} className="glass p-8 rounded-[2.5rem] border border-slate-800 hover:border-indigo-500/40 transition-all group shadow-xl">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
                          {new Date(roadmap.savedAt).toLocaleDateString()}
                        </span>
                        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                          {roadmap.confidence}% Correlation
                        </span>
                      </div>
                      <h4 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors">{roadmap.career}</h4>
                    </div>
                    <Link 
                      to="/results" 
                      className="px-6 py-3 bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 shadow-lg"
                    >
                      Enter Roadmap
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-16 rounded-[3rem] border-2 border-slate-800 border-dashed text-center">
              <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                <i className="fa-solid fa-ghost text-slate-700 text-4xl"></i>
              </div>
              <h4 className="text-white font-black text-2xl mb-3">Database Empty</h4>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">No career trajectories detected. Initiate the psychometric scan to generate roadmaps.</p>
              <Link to="/test" className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-indigo-600/30 inline-block">
                Start Neural Scan
              </Link>
            </div>
          )}

          {personality && (
            <div className="mt-12">
              <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-widest">
                <i className="fa-solid fa-dna text-indigo-500 mr-4"></i>
                Psychometric Persistence
              </h3>
              <div className="glass p-10 rounded-[3rem] border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 shadow-2xl">
                <div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Detected Type</span>
                  <div className="text-6xl font-black text-white tracking-tighter mb-6">{personality.mbti}</div>
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">Static analysis indicates high compatibility with structured logical frameworks and innovative problem-solving modules.</p>
                </div>
                <div className="space-y-4">
                  {Object.entries(personality.ocean).map(([trait, val]) => (
                    <div key={trait}>
                      <div className="flex justify-between text-[11px] mb-2">
                        <span className="text-slate-500 uppercase font-black tracking-widest">{trait}</span>
                        <span className="text-white font-black">{val}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div className="h-full bg-indigo-500/60" style={{ width: `${val}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
