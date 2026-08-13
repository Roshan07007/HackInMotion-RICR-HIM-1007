import mongoose, { Document, Schema } from "mongoose";

export interface IJob extends Document {
  title: string;
  companyName: string;
  location: string;
  employmentType: "Full time" | "Part time" | "Contract" | "Internship";
  experienceLevel: "Entry level" | "Junior" | "Mid level" | "Senior" | "Internship";
  salaryRange?: string;
  skills: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  aiInsights?: {
    criticalSkills: string[];
    importantSkills: string[];
    preferredSkills: string[];
    experienceRequired: string;
    keyResponsibilities: string[];
  };
  applicationUrl?: string;
  source: string;
  externalId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    employmentType: { 
      type: String, 
      enum: ["Full time", "Part time", "Contract", "Internship"], 
      required: true 
    },
    experienceLevel: { 
      type: String, 
      enum: ["Entry level", "Junior", "Mid level", "Senior", "Internship"], 
      required: true 
    },
    salaryRange: { type: String },
    skills: [{ type: String }],
    description: { type: String, required: true },
    responsibilities: [{ type: String }],
    requirements: [{ type: String }],
    aiInsights: {
      criticalSkills: [{ type: String }],
      importantSkills: [{ type: String }],
      preferredSkills: [{ type: String }],
      experienceRequired: { type: String },
      keyResponsibilities: [{ type: String }],
    },
    applicationUrl: { type: String },
    source: { type: String, default: "Internal" },
    externalId: { type: String, sparse: true, unique: true },
  },
  { timestamps: true }
);

// Indexes for searching
jobSchema.index({ title: "text", companyName: "text", skills: "text", description: "text" });
jobSchema.index({ location: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ employmentType: 1 });

const Job = mongoose.model<IJob>("Job", jobSchema);

export default Job;
