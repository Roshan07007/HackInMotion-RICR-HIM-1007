import mongoose, { Document, Schema } from "mongoose";

export interface IVideoInterview extends Document {
  userId: mongoose.Types.ObjectId;
  jobRole: string;
  jobDescription?: string;
  numberOfQuestions: number;
  type: "self" | "recruiter";
  status: "in-progress" | "completed" | "evaluated";
  
  // Storage for the recruiter to review later
  videoUrl?: string; // Cloudinary/S3 link to the recorded video (optional for now)
  
  // The actual Q&A transcript
  transcript: {
    role: "assistant" | "user";
    content: string;
    aiFeedback?: string; // Specific feedback for user's answer
    score?: number;      // Score for user's answer
  }[];
  
  // Final Evaluation Report (AI Screening)
  overallReport?: {
    technicalScore: number;
    communicationScore: number;
    confidenceScore: number; 
    hireabilityRating: "Strong Hire" | "Hire" | "Weak Hire" | "Reject";
    executiveSummary: string;
    strengths: string[];
    weaknesses: string[];
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const transcriptSchema = new Schema(
  {
    role: { type: String, enum: ["assistant", "user"], required: true },
    content: { type: String, required: true },
    aiFeedback: { type: String },
    score: { type: Number, min: 0, max: 10 },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const videoInterviewSchema = new Schema<IVideoInterview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    jobRole: { type: String, required: true },
    jobDescription: { type: String },
    numberOfQuestions: { type: Number, default: 5 },
    type: { type: String, enum: ["self", "recruiter"], default: "self" },
    status: { 
      type: String, 
      enum: ["in-progress", "completed", "evaluated"],
      default: "in-progress"
    },
    videoUrl: { type: String },
    transcript: [transcriptSchema],
    overallReport: {
      technicalScore: { type: Number },
      communicationScore: { type: Number },
      confidenceScore: { type: Number },
      hireabilityRating: { type: String, enum: ["Strong Hire", "Hire", "Weak Hire", "Reject"] },
      executiveSummary: { type: String },
      strengths: [{ type: String }],
      weaknesses: [{ type: String }]
    }
  },
  { timestamps: true }
);

const VideoInterview = mongoose.model<IVideoInterview>("VideoInterview", videoInterviewSchema);

export default VideoInterview;
