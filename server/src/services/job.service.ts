
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

import User from "../models/user.model.js";
import axios from "axios";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const PDFParse = pdfParseModule.PDFParse || pdfParseModule;

export const calculateMatchScoreService = async (jobId: string, userId: string) => {
  const job = await Job.findById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  const user = await User.findById(userId);
  let resumeText = "";

  if (user?.resume?.url) {
    try {
      const response = await axios.get(user.resume.url, { responseType: 'arraybuffer' });
      const pdf = new PDFParse({ data: new Uint8Array(response.data) });
      const data = await pdf.getText();
      resumeText = data.text;
    } catch (error) {
      console.error("Failed to parse user default resume:", error);
    }
  }

  if (!resumeText) {
    const latestAnalysis = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    if (!latestAnalysis) {
      throw new Error("No resume found. Please upload a resume in your profile or analyze one first.");
    }
    resumeText = latestAnalysis.resumeText;
  }

  const prompt = `
  Analyze the following Resume against the Job Description.
  Provide a match analysis in strict JSON format.
  
  Job Title: ${job.title}
  Job Description: ${job.description}
  Requirements: ${job.requirements.join(", ")}
  
  Resume Text:
  ${resumeText}
  
  Return a JSON object with this exact structure (all numbers MUST be integers between 0 and 100):
  {
    "overallScore": number,
    "breakdown": {
      "skills": number,
      "experience": number,
      "keywords": number
    },
    "missingSkills": [
      { "skill": "string", "importance": "Required" | "Preferred" }
    ],
    "recommendations": [ "string" ]
  }
  `;

  const messages: ChatMessage[] = [
    { role: "system", content: "You are an expert ATS and technical recruiter. You must ONLY output valid JSON." },
    { role: "user", content: prompt }
  ];

  const aiResponse = await generateAiResponse(messages, true, 1000);
  
  // Safely parse the JSON, stripping markdown if present
  try {
    const cleanJson = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanJson);
    
    // Ensure numbers are valid integers (AI sometimes outputs strings like "85")
    result.overallScore = Number(result.overallScore);
    if (isNaN(result.overallScore)) result.overallScore = 50;
    
    if (result.breakdown) {
      result.breakdown.skills = Number(result.breakdown.skills);
      if (isNaN(result.breakdown.skills)) result.breakdown.skills = 50;
      
      result.breakdown.experience = Number(result.breakdown.experience);
      if (isNaN(result.breakdown.experience)) result.breakdown.experience = 50;
      
      result.breakdown.keywords = Number(result.breakdown.keywords);
      if (isNaN(result.breakdown.keywords)) result.breakdown.keywords = 50;
    } else {
      result.breakdown = { skills: 50, experience: 50, keywords: 50 };
    }
    return result;
  } catch (error) {
    console.error("Failed to parse AI response:", aiResponse);
    return {
      overallScore: 0,
      breakdown: { skills: 0, experience: 0, keywords: 0 },
      missingSkills: [],
      recommendations: ["Error analyzing match score."]
    };
  }
};

import AppliedJob from "../models/appliedJob.model.js";
import { log } from "console";

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
