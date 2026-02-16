
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from './services/firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AuthForm from './components/AuthForm';
import PersonalityTest from './components/PersonalityTest';
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import ChatBot from './components/ChatBot';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Hero user={user} />} />
            <Route path="/auth" element={!user ? <AuthForm onAuthSuccess={() => {}} /> : <Navigate to="/dashboard" />} />
            <Route path="/test" element={user ? <PersonalityTest /> : <Navigate to="/auth" />} />
            <Route path="/results" element={user ? <Results /> : <Navigate to="/auth" />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/auth" />} />
          </Routes>
        </main>

        <ChatBot />

        <footer className="border-t border-slate-800 py-8 bg-slate-900/50">
          <div className="container mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; 2026 Next-Gen Career Advisor. Powered by AI.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;