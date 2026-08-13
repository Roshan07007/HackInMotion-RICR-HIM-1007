import { create } from "zustand";

export interface ResumeAnalysisData {
  _id: string;
  jobRole: string;
  companyName?: string;
  location?: string;
  jobDescription?: string;
  documentUrl?: string;
  resumeText: string;
  scores: {
    overallMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    keywordMatch: number;
    projectRelevance: number;
    educationMatch: number;
    atsReadiness: number;
    impactQuantification: number;
  };
  skillMatch: {
    strongMatches: string[];
    missingSkills: string[];
    weakEvidence: { skill: string; reason: string }[];
    keywordCoveragePercentage: number;
  };
  matchExplanations: { category: string; explanation: string }[];
  atsSimulation: {
    passedChecks: string[];
    failedChecks: string[];
  };
  qualityAnalysis: { category: string; feedback: string }[];
  bulletAnalysis: {
    original: string;
    problem: string;
    missing: string[];
    suggestedStructure: string;
    options: {
      conservative: string;
      impactFocused: string;
      technical: string;
    };
  }[];
  recommendations: {
    impact: "High" | "Medium" | "Low";
    action: string;
    why: string;
    how: string;
  }[];
  summarySuggestions: {
    current: string;
    analysis: string;
    conservative: string;
    strong: string;
  };
  interviewPrep: {
    likelyTopics: string[];
    questions: string[];
  };
  createdAt: string;
}

interface ResumeStoreState {
  analysisResult: ResumeAnalysisData | null;
  isAnalyzing: boolean;
  setAnalysisResult: (result: ResumeAnalysisData | null) => void;
  setIsAnalyzing: (status: boolean) => void;
  reset: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  analysisResult: null,
  isAnalyzing: false,
  setAnalysisResult: (result) => set({ analysisResult: result }),
  setIsAnalyzing: (status) => set({ isAnalyzing: status }),
  reset: () => set({ analysisResult: null, isAnalyzing: false }),
}));
