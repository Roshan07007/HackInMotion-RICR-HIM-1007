import mongoose, { Document, Schema } from "mongoose";

export interface IResumeAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  jobRole: string; // Title entered by user
  companyName?: string;
  location?: string;
  jobDescription?: string; // Original JD text
  documentUrl?: string; // Cloudinary URL
  resumeText: string; // Extracted raw text

  // 3. Overall Resume Score
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

  // 4. Job Match Intelligence
  skillMatch: {
    strongMatches: string[];
    missingSkills: string[];
    weakEvidence: { skill: string; reason: string }[];
    keywordCoveragePercentage: number;
  };

  // 5. Explain WHY
  matchExplanations: { category: string; explanation: string }[];

  // 6. ATS Compatibility
  atsSimulation: {
    passedChecks: string[];
    failedChecks: string[];
  };

  // 7. Quality Analysis (Content, Experience, Project, Structure)
  qualityAnalysis: { category: string; feedback: string }[];

  // 9. Bullet Point Analyzer
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

  // 10. Prioritized Improvements
  recommendations: {
    impact: "High" | "Medium" | "Low";
    action: string;
    why: string;
    how: string;
  }[];

  // 11. Resume Summary Generator
  summarySuggestions: {
    current: string;
    analysis: string;
    conservative: string;
    strong: string;
  };

  // 15. Interview Readiness
  interviewPrep: {
    likelyTopics: string[];
    questions: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

const resumeAnalysisSchema = new Schema<IResumeAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobRole: { type: String, required: true },
    companyName: { type: String },
    location: { type: String },
    jobDescription: { type: String },
    documentUrl: { type: String },
    resumeText: { type: String, required: true },

    scores: {
      overallMatch: { type: Number, default: 0 },
      skillsMatch: { type: Number, default: 0 },
      experienceMatch: { type: Number, default: 0 },
      keywordMatch: { type: Number, default: 0 },
      projectRelevance: { type: Number, default: 0 },
      educationMatch: { type: Number, default: 0 },
      atsReadiness: { type: Number, default: 0 },
      impactQuantification: { type: Number, default: 0 },
    },

    skillMatch: {
      strongMatches: [{ type: String }],
      missingSkills: [{ type: String }],
      weakEvidence: [{
        skill: String,
        reason: String
      }],
      keywordCoveragePercentage: { type: Number, default: 0 }
    },

    matchExplanations: [{
      category: String,
      explanation: String
    }],

    atsSimulation: {
      passedChecks: [{ type: String }],
      failedChecks: [{ type: String }]
    },

    qualityAnalysis: [{
      category: String,
      feedback: String
    }],

    bulletAnalysis: [{
      original: String,
      problem: String,
      missing: [{ type: String }],
      suggestedStructure: String,
      options: {
        conservative: String,
        impactFocused: String,
        technical: String
      }
    }],

    recommendations: [{
      impact: { type: String, enum: ["High", "Medium", "Low"] },
      action: String,
      why: String,
      how: String
    }],

    summarySuggestions: {
      current: String,
      analysis: String,
      conservative: String,
      strong: String
    },

    interviewPrep: {
      likelyTopics: [{ type: String }],
      questions: [{ type: String }]
    }
  },
  { timestamps: true }
);

const ResumeAnalysis = mongoose.model<IResumeAnalysis>("ResumeAnalysis", resumeAnalysisSchema);

export default ResumeAnalysis;
