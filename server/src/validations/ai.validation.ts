import { z } from "zod";

export const analyzeResumeSchema = z.object({
  body: z.object({
    resumeText: z.string().min(50, "Resume text must be at least 50 characters long"),
    jobRole: z.string().min(2, "Job role must be provided"),
    jobDescription: z.string().optional(),
  }),
});

export const deepAnalyzeResumeSchema = z.object({
  body: z.object({
    jobRole: z.string().min(2, "Job role must be provided"),
    companyName: z.string().optional(),
    location: z.string().optional(),
    jobDescription: z.string().optional(),
  }),
});

export const mockInterviewInitSchema = z.object({
  body: z.object({
    resumeText: z.string().min(50, "Resume text must be at least 50 characters long"),
    jobRole: z.string().min(2, "Job role must be provided"),
    jobDescription: z.string().optional(),
  }),
});

export const mockInterviewMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid conversation ID"),
    message: z.string().min(1, "Message cannot be empty"),
  }),
});

export const initCareerChatSchema = z.object({
  // No body required for initialization, but we can accept it if we wanted to
});

export const careerChatMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message cannot be empty"),
  }),
});

export const videoInterviewInitSchema = z.object({
  body: z.object({
    jobRole: z.string().min(2, "Job role must be provided"),
    jobDescription: z.string().optional(),
    numberOfQuestions: z.number().min(1).max(20).optional().default(5),
    resumeText: z.string().optional(), // For AI context
    type: z.enum(["self", "recruiter"]).optional().default("self"),
  }),
});

export const videoInterviewAnswerSchema = z.object({
  body: z.object({
    interviewId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid interview ID"),
    answer: z.string().min(1, "Answer cannot be empty"),
  }),
});
