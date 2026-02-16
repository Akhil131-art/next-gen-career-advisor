
import React, { useState, useRef, useEffect } from 'react';
import { updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { uploadBytes, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { auth, storage, db } from '../services/firebase';
import { User, PersonalityResults } from '../types';

interface ProfileProps {
  user: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [isEditing, setIsEditing] = useState(false);
  const [personality, setPersonality] = useState<PersonalityResults | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchPersonality = async () => {
      if (!currentUser) return;
      const docSnap = await getDoc(doc(db, "results", currentUser.uid));
      if (docSnap.exists()) {
        setPersonality(docSnap.data() as PersonalityResults);
      }
    };
    fetchPersonality();
  }, [currentUser]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && currentUser) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Limit: 2MB per upload.");
        return;
      }
      
      setUploading(true);
      try {
        const imageRef = ref(storage, `profiles/${currentUser.uid}`);
        await uploadBytes(imageRef, file);
        const url = await getDownloadURL(imageRef);
        await updateProfile(currentUser, { photoURL: url });
        window.location.reload(); // Refresh to show new image
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSave = async () => {
    if (currentUser) {
      await updateProfile(currentUser, { displayName });
      setIsEditing(false);
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Profile Header */}
      <div className="glass p-12 md:p-16 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden mb-16">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[100px] -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-14">
          {/* Avatar Section */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-52 h-52 rounded-[3.5rem] bg-slate-800 border-4 border-slate-700 overflow-hidden shadow-2xl transition-all group-hover:border-indigo-500 relative">
              {currentUser?.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 text-white text-7xl font-black">
                  {user.displayName.charAt(0)}
                </div>
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                 {uploading ? <i className="fa-solid fa-circle-notch animate-spin text-white text-3xl"></i> : <i className="fa-solid fa-camera text-white text-3xl"></i>}
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-indigo-600 text-white rounded-3xl flex items-center justify-center shadow-2xl border-4 border-slate-900">
              <i className="fa-solid fa-upload"></i>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
          </div>

          {/* Details Section */}
          <div className="flex-grow text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-6 mb-4">
              {isEditing ? (
                <div className="flex gap-3 w-full max-w-sm">
                  <input 
                    type="text" 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-grow bg-slate-800 border border-slate-700 text-3xl font-black text-white px-5 py-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    autoFocus
                  />
                  <button 
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 rounded-2xl hover:bg-green-500 transition-all shadow-xl"
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-5xl font-black text-white tracking-tighter leading-none">{currentUser?.displayName || 'User'}</h2>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-slate-600 hover:text-white transition-colors text-2xl"
                  >
                    <i className="fa-solid fa-pen-nib"></i>
                  </button>
                </>
              )}
            </div>
            <p className="text-slate-500 font-bold text-lg mb-10 uppercase tracking-widest">{currentUser?.email}</p>
            
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-6 py-3 glass bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs text-indigo-400 font-black uppercase tracking-[0.2em]">
                Tier 1 Candidate
              </div>
              <div className="px-6 py-3 glass bg-slate-800 border border-slate-700 rounded-2xl text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
                Cloud Synchronized
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Personality Summary */}
        <div className="glass p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-10 flex items-center uppercase tracking-widest">
            <i className="fa-solid fa-dna text-indigo-500 mr-4"></i> 
            Neural Profile
          </h3>
          
          {personality ? (
            <div className="space-y-10">
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Cognitive Core</div>
                  <div className="text-6xl font-black text-white tracking-tighter leading-none">{personality.mbti}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2">Verification</div>
                  <div className="text-xl font-black text-green-500">100% Valid</div>
                </div>
              </div>
              
              <div className="space-y-5">
                {Object.entries(personality.ocean).map(([trait, val]) => (
                  <div key={trait}>
                    <div className="flex justify-between text-[11px] mb-2.5">
                      <span className="text-slate-500 uppercase font-black tracking-widest capitalize">{trait}</span>
                      <span className="text-white font-black">{val}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                      <div className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400" style={{ width: `${val}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-24 text-center border-2 border-slate-800 border-dashed rounded-[2.5rem]">
               <i className="fa-solid fa-cloud-arrow-up text-slate-800 text-6xl mb-6"></i>
               <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">No Cloud Data Detected</p>
            </div>
          )}
        </div>

        {/* Account Settings */}
        <div className="glass p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl">
          <h3 className="text-xl font-black text-white mb-10 flex items-center uppercase tracking-widest">
            <i className="fa-solid fa-gears text-slate-400 mr-4"></i> 
            Database Config
          </h3>
          
          <div className="space-y-5">
            {[
              { label: 'Real-time Telemetry', status: true, icon: 'fa-signal' },
              { label: 'Automated Skill Sync', status: true, icon: 'fa-microchip' },
              { label: 'Cloud Trajectory Tracking', status: true, icon: 'fa-globe' },
              { label: 'Neural Data Encryption', status: true, icon: 'fa-user-shield' }
            ].map((setting, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-slate-900/50 border border-slate-800 rounded-3xl hover:border-slate-700 transition-all group">
                <div className="flex items-center space-x-5">
                  <i className={`fa-solid ${setting.icon} text-slate-600 group-hover:text-indigo-500 transition-colors text-lg`}></i>
                  <span className="text-slate-300 font-black text-sm uppercase tracking-widest">{setting.label}</span>
                </div>
                <div className={`w-14 h-7 rounded-full relative transition-all shadow-inner ${setting.status ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-lg ${setting.status ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
            
            <div className="pt-10 border-t border-slate-800 mt-6 text-center">
              <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">Encrypted Session: Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
