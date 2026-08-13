import { generateAiResponse, ChatMessage } from "./ai.service.js";
import VideoInterview from "../models/videoInterview.model.js";
import { videoInterviewInitSchema, videoInterviewAnswerSchema } from "../validations/ai.validation.js";
import User from "../models/user.model.js";
import { uploadSingleToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import logger from "../utils/logger.js";

const VIDEO_INTERVIEW_SYSTEM_PROMPT = `
You are an expert technical interviewer and hiring manager conducting a live video interview.
Your goal is to assess the candidate's skills, communication, and fit for the role.
- Ask one question at a time.
- If the candidate answers a question, provide a brief, professional evaluation of their answer (internal feedback for grading, do NOT say "Good job" in your next question unnecessarily, keep it realistic).
- Keep your questions concise.
- Act like a real human interviewer.
`;

export const initializeVideoInterviewService = async (
  userId: string,
  body: Record<string, any>
) => {
  const validatedData = videoInterviewInitSchema.parse({ body }).body;

  const interview = new VideoInterview({
    userId,
    jobRole: validatedData.jobRole,
    jobDescription: validatedData.jobDescription,
    numberOfQuestions: validatedData.numberOfQuestions,
    type: validatedData.type,
    transcript: [],
    status: "in-progress"
  });

  const prompt = `I am ready to start the interview for the ${validatedData.jobRole} role. ${validatedData.resumeText ? `Here is my resume context:\n${validatedData.resumeText}` : ''} Please ask the first question. We will do exactly ${validatedData.numberOfQuestions} questions in total.`;

  const messages: ChatMessage[] = [
    { role: "system", content: VIDEO_INTERVIEW_SYSTEM_PROMPT },
    { role: "user", content: prompt }
  ];

  const aiResponse = await generateAiResponse(messages);

  interview.transcript.push({
    role: "assistant",
    content: aiResponse
  });

  await interview.save();
  return interview;
};

export const processVideoInterviewAnswerService = async (
  userId: string,
  body: Record<string, any>
) => {
  const validatedData = videoInterviewAnswerSchema.parse({ body }).body;

  const interview = await VideoInterview.findById(validatedData.interviewId);
  if (!interview) throw Object.assign(new Error("Interview not found"), { statusCode: 404 });
  if (interview.userId.toString() !== userId) throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });
  if (interview.status !== "in-progress") throw Object.assign(new Error("Interview is not in progress"), { statusCode: 400 });

  // Check if we reached the limit
  const questionsAsked = interview.transcript.filter(t => t.role === "assistant").length;
  const isLastQuestion = questionsAsked >= interview.numberOfQuestions;

  // 1. Ask AI to evaluate the answer and generate the next question
  const evaluatePrompt = `
  The candidate provided the following answer:
  "${validatedData.answer}"

  Please evaluate this answer.
  ${isLastQuestion ? "This is the final response. Acknowledge their answer, thank them for their time, and tell them the interview is now concluded. DO NOT ask another question." : `You have asked ${questionsAsked} out of ${interview.numberOfQuestions} questions. Ask the next question.`}
  Return your response in EXACTLY the following JSON format without markdown code blocks:
  {
    "score": 8, // An integer out of 10
    "aiFeedback": "Brief internal feedback for grading (candidate will not see this)",
    "spokenResponse": "What the AI will actually say out loud to the candidate. This should sound natural. If the candidate's answer is good, acknowledge it briefly and ask the next question. If the answer is lacking or missing details, provide a gentle hint or ask a follow-up question to help them expand before moving on."
  }
  `;

  // Reconstruct chat history for context
  const contextMessages: ChatMessage[] = [
    { role: "system", content: VIDEO_INTERVIEW_SYSTEM_PROMPT }
  ];
  
  // Add last 3 pairs to keep context window small but relevant
  const recentTranscript = interview.transcript.slice(-6);
  recentTranscript.forEach(t => {
    contextMessages.push({ role: t.role, content: t.content });
  });
  
  contextMessages.push({ role: "user", content: evaluatePrompt });

  const aiResponseString = await generateAiResponse(contextMessages, true, 1000);
  let evaluation: any;
  try {
    evaluation = JSON.parse(aiResponseString);
  } catch (error) {
    logger.error("Failed to parse evaluation JSON", error);
    // Fallback if AI fails to return JSON
    evaluation = {
      score: 5,
      aiFeedback: "Could not fully parse AI feedback.",
      spokenResponse: "I see. Could you tell me more about your experience?"
    };
  }

  // 2. Save user's answer with evaluation
  interview.transcript.push({
    role: "user",
    content: validatedData.answer,
    score: evaluation.score || 5,
    aiFeedback: evaluation.aiFeedback || ""
  });

  // 3. Save assistant's next question
  interview.transcript.push({
    role: "assistant",
    content: evaluation.spokenResponse || "Can you elaborate on that?"
  });

  await interview.save();

  // Return the newly added user answer and assistant question
  return {
    userAnswer: interview.transcript[interview.transcript.length - 2],
    assistantQuestion: interview.transcript[interview.transcript.length - 1],
    isFinished: isLastQuestion
  };
};

export const finalizeVideoInterviewService = async (
  userId: string,
  interviewId: string,
  file?: Express.Multer.File
) => {
  const interview = await VideoInterview.findById(interviewId);
  if (!interview) throw Object.assign(new Error("Interview not found"), { statusCode: 404 });
  if (interview.userId.toString() !== userId) throw Object.assign(new Error("Unauthorized"), { statusCode: 403 });

  if (interview.status === "evaluated") return interview;

  if (file) {
    try {
      const cloudinaryRes = await uploadSingleToCloudinary(file, { folder: "interviews", resource_type: "video" });
      interview.videoUrl = cloudinaryRes.url;
    } catch (error) {
      console.error("Failed to upload video to Cloudinary", error);
    }
  }

  const summaryPrompt = `
  You are an expert AI Recruiter. You have just completed an interview for the role of: ${interview.jobRole}.
  Here is the full transcript of the interview (Q&A):
  ${interview.transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join("\n")}

  Generate a comprehensive final evaluation report for this candidate.
  Return EXACTLY the following JSON format without markdown code blocks:
  {
    "technicalScore": 85, // 0-100
    "communicationScore": 90, // 0-100
    "confidenceScore": 80, // 0-100 based on answer clarity and conciseness
    "hireabilityRating": "Strong Hire", // Must be one of: "Strong Hire", "Hire", "Weak Hire", "Reject"
    "executiveSummary": "A 2-3 sentence summary for the hiring manager.",
    "strengths": ["Clear communication", "Deep React knowledge"],
    "weaknesses": ["Hesitant on system design", "Lacks testing experience"]
  }
  `;

  const messages: ChatMessage[] = [
    { role: "system", content: "You are an expert AI Recruiter." },
    { role: "user", content: summaryPrompt }
  ];

  const aiResponseString = await generateAiResponse(messages, true, 1500);
  let overallReport: any;
  try {
    overallReport = JSON.parse(aiResponseString);
  } catch (error) {
    logger.error("Failed to parse summary JSON", error);
    throw new Error("AI returned invalid JSON format for summary");
  }

  interview.overallReport = {
    technicalScore: overallReport.technicalScore || 0,
    communicationScore: overallReport.communicationScore || 0,
    confidenceScore: overallReport.confidenceScore || 0,
    hireabilityRating: overallReport.hireabilityRating || "Weak Hire",
    executiveSummary: overallReport.executiveSummary || "Evaluation failed.",
    strengths: overallReport.strengths || [],
    weaknesses: overallReport.weaknesses || []
  };
  
  interview.status = "evaluated";
  await interview.save();

  return interview;
};

export const getVideoInterviewHistoryService = async (userId: string) => {
  return VideoInterview.find({ userId })
    .select("_id jobRole status createdAt overallReport.hireabilityRating")
    .sort({ createdAt: -1 });
};

export const getVideoInterviewByIdService = async (id: string, userId: string) => {
  return VideoInterview.findOne({ _id: id, userId });
};

export const deleteVideoInterviewService = async (id: string, userId: string) => {
  const interview = await VideoInterview.findOneAndDelete({ _id: id, userId });
  if (interview && interview.videoUrl) {
    // Optionally delete from Cloudinary using publicId extraction, though not strictly required for this demo.
  }
  return interview;
};

export const deleteAllVideoInterviewsService = async (userId: string) => {
  // Optionally clean up Cloudinary videos here
  return await VideoInterview.deleteMany({ userId });
};
