
export enum MBTIDimension {
  EI = 'EI',
  SN = 'SN',
  TF = 'TF',
  JP = 'JP'
}

export interface Question {
  id: number;
  text: string;
  dimension?: MBTIDimension;
  trait?: 'O' | 'C' | 'E' | 'A' | 'N';
  options: {
    label: string;
    value: number;
  }[];
}

export interface PersonalityResults {
  mbti: string;
  ocean: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
}

export interface Certification {
  name: string;
  url: string;
}

export interface CareerRoadmapStep {
  title: string;
  description: string;
  duration: string;
}

export interface CareerRecommendation {
  career: string;
  confidence: number;
  description: string;
  skills: string[];
  certifications: Certification[];
  roadmap: CareerRoadmapStep[];
}

export interface CareerAnalysisResponse {
  topMatches: CareerRecommendation[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface User {
  email: string;
  displayName: string;
  photoURL?: string;
}

export interface SavedRoadmap extends CareerRecommendation {
  id: string;
  savedAt: string;
}
