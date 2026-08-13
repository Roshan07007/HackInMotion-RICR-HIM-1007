/**
 * Resume AI service.
 * Contains all prompts and business logic specific to resume analysis.
 */

import { generateAiResponse, ChatMessage } from "./ai.service.js";
import ResumeAnalysis from "../models/resumeAnalysis.model.js";
import { uploadSingleToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import { parseDocument } from "../utils/documentParser.js";
import logger from "../utils/logger.js";
import { deepAnalyzeResumeSchema, analyzeResumeSchema } from "../validations/ai.validation.js";

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

export const RESUME_ANALYZER_PROMPT = `
You are an elite Tech Recruiter and AI Career Coach. 
Analyze the provided resume against the provided job role/description.
You MUST respond with ONLY valid JSON in the following exact format:
{
  "matchPercentage": 85,
  "skillsMatched": ["React", "TypeScript", "Node.js"],
  "missingSkills": ["Docker", "AWS"],
  "aiRecommendations": [
    "Quantify your impact in the E-commerce project",
    "Add more details about your state management experience"
  ]
}
Ensure the matchPercentage is an integer between 0 and 100.
Do NOT wrap the JSON in Markdown formatting (like \`\`\`json). Just return the raw JSON object.
`;

export const DEEP_RESUME_ANALYZER_PROMPT = `
You are an elite Tech Recruiter, Hiring Manager, and AI Career Coach. 
Analyze the provided resume against the Target Job Role (and Job Description if provided).
You must evaluate ATS compatibility, skill matches, experience relevance, bullet point impact, and interview readiness.
You MUST respond with ONLY valid JSON in the following exact format:
{
  "scores": {
    "overallMatch": 92, "skillsMatch": 94, "experienceMatch": 91, "keywordMatch": 89,
    "projectRelevance": 95, "educationMatch": 100, "atsReadiness": 88, "impactQuantification": 82
  },
  "skillMatch": {
    "strongMatches": ["React", "Node.js"], "missingSkills": ["AWS", "Docker"],
    "weakEvidence": [{ "skill": "PostgreSQL", "reason": "Listed in skills but not demonstrated in experience." }],
    "keywordCoveragePercentage": 84
  },
  "matchExplanations": [{ "category": "Strong Backend Match", "explanation": "Your Node.js experience directly aligns..." }],
  "atsSimulation": {
    "passedChecks": ["Contact info detected", "Standard section headings"],
    "failedChecks": ["Two-column formatting detected", "Missing Docker keyword"]
  },
  "qualityAnalysis": [{ "category": "Experience Quality", "feedback": "Good use of action verbs but lacks quantification." }],
  "bulletAnalysis": [{
    "original": "Worked on a React application", "problem": "Low specificity, missing outcome",
    "missing": ["Scope", "Technical contribution", "Outcome"], "suggestedStructure": "Action + Technology + Scope + Result",
    "options": {
      "conservative": "Developed a React application for...",
      "impactFocused": "Developed a React application used by 500+ users, reducing load time by 20%",
      "technical": "Engineered a React SPA with Redux state management for..."
    }
  }],
  "recommendations": [{
    "impact": "High", "action": "Add measurable outcomes",
    "why": "Your project bullets describe implementation but lack impact.",
    "how": "Add real metrics such as users, performance improvements, etc."
  }],
  "summarySuggestions": {
    "current": "Software engineer with 3 years experience...", "analysis": "A bit generic. Needs more focus on the target role.",
    "conservative": "Software Engineer specializing in React and Node.js with 3 years...",
    "strong": "Full Stack Engineer with a track record of building scalable React/Node applications..."
  },
  "interviewPrep": {
    "likelyTopics": ["React performance", "Node.js architecture"],
    "questions": ["Explain the architecture of your largest project.", "Why did you choose React?"]
  }
}
Do NOT invent fake skills, metrics, or experiences that are not in the resume. 
Do NOT wrap the JSON in Markdown formatting (like \`\`\`json). Just return the raw JSON object.
`;

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

/** Parse, upload, and deeply analyse a resume file. */
export const deepAnalyzeResumeService = async (
  userId: string,
  file: Express.Multer.File,
  body: Record<string, any>
) => {
  const resumeText = await parseDocument(file);
  if (!resumeText || resumeText.length < 50) {
    throw Object.assign(new Error("Could not extract sufficient text from the document"), { statusCode: 400 });
  }

  const cloudinaryRes = await uploadSingleToCloudinary(file, { folder: "resumes", resource_type: "auto" });
  const validatedData = deepAnalyzeResumeSchema.parse({ body }).body;

  const messages: ChatMessage[] = [
    { role: "system", content: DEEP_RESUME_ANALYZER_PROMPT },
    {
      role: "user",
      content: `Target Role: ${validatedData.jobRole}\nCompany: ${validatedData.companyName || "N/A"}\nJob Description: ${validatedData.jobDescription || "N/A"}\n\nResume Text:\n${resumeText}`,
    },
  ];

  // Requesting 4000 maxTokens causes rate limit errors on Groq free tier since prompt + maxTokens > 6000.
  // 1500 is plenty for the JSON response.
  const aiResponseString = await generateAiResponse(messages, true, 1500);

  let aiResponseJson: Record<string, any>;
  try {
    logger.info("Parsing deep analysis AI JSON response");
    aiResponseJson = JSON.parse(aiResponseString);
  } catch {
    throw new Error("AI returned invalid JSON format");
  }

  const resumeAnalysis = new ResumeAnalysis({
    userId,
    jobRole: validatedData.jobRole,
    companyName: validatedData.companyName,
    location: validatedData.location,
    jobDescription: validatedData.jobDescription,
    documentUrl: cloudinaryRes.url,
    resumeText,
    ...aiResponseJson,
  });

  await resumeAnalysis.save();
  return resumeAnalysis;
};

/** Run a lightweight text-based resume analysis. */
export const analyzeResumeService = async (
  userId: string,
  body: Record<string, any>
) => {
  const validatedData = analyzeResumeSchema.parse({ body }).body;

  const messages: ChatMessage[] = [
    { role: "system", content: RESUME_ANALYZER_PROMPT },
    {
      role: "user",
      content: `Target Role: ${validatedData.jobRole}\nJob Description (Optional): ${validatedData.jobDescription || "N/A"}\n\nResume Text:\n${validatedData.resumeText}`,
    },
  ];

  const aiResponseString = await generateAiResponse(messages, true);
  let aiResponseJson: Record<string, any>;
  try {
    aiResponseJson = JSON.parse(aiResponseString);
  } catch {
    throw new Error("AI returned invalid JSON format");
  }

  const resumeAnalysis = new ResumeAnalysis({
    userId,
    jobRole: validatedData.jobRole,
    matchPercentage: aiResponseJson.matchPercentage || 0,
    skillsMatched: aiResponseJson.skillsMatched || [],
    missingSkills: aiResponseJson.missingSkills || [],
    aiRecommendations: aiResponseJson.aiRecommendations || [],
    resumeText: validatedData.resumeText,
  });

  await resumeAnalysis.save();
  return resumeAnalysis;
};

/** Return paginated summary list of past analyses for a user. */
export const getResumeHistoryService = async (userId: string) => {
  return ResumeAnalysis.find({ userId })
    .select("_id jobRole companyName createdAt scores.overallMatch")
    .sort({ createdAt: -1 });
};

/** Delete all resume analyses (and their Cloudinary files) for a user. */
export const clearResumeHistoryService = async (userId: string) => {
  const items = await ResumeAnalysis.find({ userId });

  await Promise.all(
    items
      .filter((item) => item.documentUrl)
      .map(async (item) => {
        try {
          const urlParts = item.documentUrl!.split("/");
          const folderIndex = urlParts.indexOf("resumes");
          if (folderIndex !== -1) {
            const publicId = urlParts.slice(folderIndex).join("/").split(".")[0];
            await deleteFromCloudinary(publicId);
          }
        } catch (err) {
          logger.error("Failed to delete resume from Cloudinary", err);
        }
      })
  );

  await ResumeAnalysis.deleteMany({ userId });
};

/** Fetch a single analysis by ID, scoped to the requesting user. */
export const getResumeAnalysisByIdService = async (id: string, userId: string) => {
  return ResumeAnalysis.findOne({ _id: id, userId });
};
