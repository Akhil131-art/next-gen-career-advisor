
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MBTI_QUESTIONS, OCEAN_QUESTIONS } from '../constants';
import { MBTIDimension, PersonalityResults } from '../types';

const PersonalityTest: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0); // 0: MBTI, 1: OCEAN
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [mbtiAnswers, setMbtiAnswers] = useState<Record<number, number>>({});
  const [oceanAnswers, setOceanAnswers] = useState<Record<number, number>>({});

  const questions = currentStep === 0 ? MBTI_QUESTIONS : OCEAN_QUESTIONS;
  const currentQuestion = questions[currentQuestionIndex];
  
  const totalQuestions = MBTI_QUESTIONS.length + OCEAN_QUESTIONS.length;
  const progress = ((currentStep === 0 ? currentQuestionIndex : MBTI_QUESTIONS.length + currentQuestionIndex) / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    if (currentStep === 0) {
      setMbtiAnswers({ ...mbtiAnswers, [currentQuestion.id]: value });
    } else {
      setOceanAnswers({ ...oceanAnswers, [currentQuestion.id]: value });
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentStep === 0) {
      setCurrentStep(1);
      setCurrentQuestionIndex(0);
    } else {
      calculateAndFinish();
    }
  };

  const calculateAndFinish = () => {
    // 1. Calculate MBTI with high precision
    const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
    MBTI_QUESTIONS.forEach(q => {
      if (q.dimension) {
        const val = mbtiAnswers[q.id] ?? 0;
        scores[q.dimension] += val;
      }
    });
    
    // Result logic: Positive = First Letter, Negative = Second Letter
    // EI: Positive is E, SN: Positive is N, TF: Positive is T, JP: Positive is J
    const mbti = `${scores.EI >= 0 ? 'E' : 'I'}${scores.SN >= 0 ? 'N' : 'S'}${scores.TF >= 0 ? 'T' : 'F'}${scores.JP >= 0 ? 'J' : 'P'}`;

    // 2. Calculate OCEAN based on 30 questions (6 per trait)
    const getTraitScore = (traitChar: 'O' | 'C' | 'E' | 'A' | 'N') => {
      const traitQuestions = OCEAN_QUESTIONS.filter(q => q.trait === traitChar);
      const total = traitQuestions.reduce((acc, q) => acc + (oceanAnswers[q.id] || 3), 0);
      // Max score per trait is 6 questions * 5 points = 30. Min is 6 * 1 = 6.
      // Normalize to 0-100: ((score - min) / (max - min)) * 100
      return Math.round(((total - 6) / 24) * 100);
    };

    const ocean = {
      openness: getTraitScore('O'),
      conscientiousness: getTraitScore('C'),
      extraversion: getTraitScore('E'),
      agreeableness: getTraitScore('A'),
      neuroticism: getTraitScore('N')
    };

    const results: PersonalityResults = { mbti, ocean };
    localStorage.setItem('career_test_results', JSON.stringify(results));
    navigate('/results');
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="mb-12">
        <div className="flex justify-between items-end mb-4">
          <div>
            <span className="text-indigo-500 font-black uppercase tracking-[0.2em] text-[10px]">
              {currentStep === 0 ? `Module 01: Cognitive Dynamics` : `Module 02: Personality Vectors`}
            </span>
            <h2 className="text-3xl font-black text-white mt-2 tracking-tight">Question {currentQuestionIndex + 1} <span className="text-slate-600 font-medium text-lg">/ {questions.length}</span></h2>
          </div>
          <span className="text-indigo-400 text-sm font-black font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="glass p-10 md:p-14 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative min-h-[450px] flex flex-col justify-center transition-all">
        <div className="absolute top-0 right-0 p-10 opacity-[0.03]">
          <i className={`fa-solid ${currentStep === 0 ? 'fa-brain' : 'fa-dna'} text-8xl text-white`}></i>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-12 leading-tight tracking-tight">
          "{currentQuestion.text}"
        </h3>

        <div className="space-y-4">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option.value)}
              className="w-full text-left p-6 rounded-2xl glass border border-slate-800 hover:border-indigo-500 hover:bg-indigo-500/10 transition-all flex items-center group active:scale-[0.98]"
            >
              <div className="w-10 h-10 rounded-xl border-2 border-slate-700 flex items-center justify-center mr-6 group-hover:border-indigo-500 group-hover:bg-indigo-600 transition-all shadow-lg">
                <i className="fa-solid fa-check text-transparent group-hover:text-white text-sm"></i>
              </div>
              <span className="text-slate-300 group-hover:text-white font-bold text-lg">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center px-4">
        <button 
          disabled={currentQuestionIndex === 0 && currentStep === 0}
          onClick={() => {
            if (currentQuestionIndex > 0) {
              setCurrentQuestionIndex(prev => prev - 1);
            } else if (currentStep === 1) {
              setCurrentStep(0);
              setCurrentQuestionIndex(MBTI_QUESTIONS.length - 1);
            }
          }}
          className="text-slate-500 hover:text-white flex items-center text-sm font-black uppercase tracking-widest disabled:opacity-0 transition-colors"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Back
        </button>
        <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full transition-all ${currentStep === 0 ? 'bg-indigo-500 scale-125 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-all ${currentStep === 1 ? 'bg-indigo-500 scale-125 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default PersonalityTest;
