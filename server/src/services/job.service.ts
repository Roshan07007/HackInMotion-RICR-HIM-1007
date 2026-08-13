
import Job from "../models/job.model.js";
import SavedJob from "../models/savedJob.model.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import { generateAiResponse, ChatMessage } from "./ai.service.js";
import { getAggregatedJobs } from "./jobAggregator.service.js";

export const getJobsService = async (query: any) => {
  return await getAggregatedJobs(query);
};

export const getJobByIdService = async (jobId: string, userId: string) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const saved = await SavedJob.findOne({ userId, jobId });

  return { ...job.toObject(), isSaved: !!saved };
};

export const saveJobService = async (jobId: string, userId: string) => {
  const existing = await SavedJob.findOne({ userId, jobId });
  if (existing) {
    throw new Error("Job already saved");
  }

  const savedJob = new SavedJob({ userId, jobId });
  await savedJob.save();
  return { success: true, message: "Job saved successfully" };
};

export const removeSavedJobService = async (jobId: string, userId: string) => {
  await SavedJob.findOneAndDelete({ userId, jobId });
  return { success: true, message: "Saved job removed" };
};

export const getSavedJobsService = async (userId: string) => {
  return await SavedJob.find({ userId })
    .populate("jobId")
    .sort({ createdAt: -1 });
};

export const calculateMatchScoreService = async (jobId: string, userId: string) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const latestAnalysis = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
  if (!latestAnalysis) {
    throw new Error("No resume analysis found. Please analyze a resume first.");
  }

  const prompt = `
  Analyze the following Resume against the Job Description.
  Provide a match analysis in strict JSON format.
  
  Job Title: ${job.title}
  Job Description: ${job.description}
  Requirements: ${job.requirements.join(", ")}
  
  Resume Text:
  ${latestAnalysis.resumeText}
  
  Return a JSON object with this exact structure:
  {
    "overallScore": number (0-100),
    "breakdown": {
      "skills": number (0-100),
      "experience": number (0-100),
      "keywords": number (0-100)
    },
    "missingSkills": [
      { "skill": "string", "importance": "Required" | "Preferred" }
    ],
    "recommendations": [ "string" ]
  }
  `;

  const messages: ChatMessage[] = [
    { role: "system", content: "You are an expert ATS and technical recruiter." },
    { role: "user", content: prompt }
  ];

  const aiResponse = await generateAiResponse(messages, true, 1000);
  return JSON.parse(aiResponse);
};

import AppliedJob from "../models/appliedJob.model.js";

export const applyToJobService = async (jobId: string, userId: string) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const existing = await AppliedJob.findOne({ userId, jobId });
  if (existing) {
    throw new Error("Already applied/opened this job");
  }

  const status = job.source === "Internal" ? "Applied" : "Opened";

  const appliedJob = new AppliedJob({ userId, jobId, status });
  await appliedJob.save();

  return { success: true, status, message: `Job marked as ${status}` };
};

export const getAppliedJobsService = async (userId: string) => {
  return await AppliedJob.find({ userId })
    .populate("jobId")
    .sort({ appliedAt: -1 });
};
