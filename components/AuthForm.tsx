
import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from '../services/firebase';
import { User } from '../types';

interface AuthFormProps {
  onAuthSuccess: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="glass p-8 rounded-[2.5rem] shadow-2xl border border-slate-700/50">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-600/30">
            <i className={`fa-solid ${isLogin ? 'fa-fingerprint' : 'fa-user-plus'} text-white text-3xl`}></i>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-400 mt-3 font-medium">{isLogin ? 'Enter your credentials to continue.' : 'Start your journey with real-time AI guidance.'}</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-5 py-4 rounded-2xl mb-8 text-xs font-bold flex items-center">
            <i className="fa-solid fa-triangle-exclamation mr-3 text-lg"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                placeholder="Ex: Alan Turing"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Email Endpoint</label>
            <input 
              type="email" 
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              placeholder="user@network.com"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Access Key</label>
            <input 
              type="password" 
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-lg py-5 rounded-2xl shadow-2xl shadow-indigo-600/30 transition-all mt-4 flex items-center justify-center space-x-3 disabled:opacity-50"
          >
            {loading ? <i className="fa-solid fa-circle-notch animate-spin"></i> : (isLogin ? 'Authorise Access' : 'Initialize Profile')}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-slate-800 text-center">
          <p className="text-slate-500 font-medium">
            {isLogin ? "No account in our database?" : "Already have an identity?"}{' '}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-400 font-black hover:text-indigo-300 transition-colors"
            >
              {isLogin ? 'Create One Now' : 'Sign In Now'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
