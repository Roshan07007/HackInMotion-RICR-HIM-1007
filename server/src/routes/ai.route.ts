import express from "express";
import multer from "multer";
import { protect } from "../middleware/auth.middleware.js";
import {
  analyzeResume,
  deepAnalyzeResume,
  getResumeHistory,
  clearResumeHistory,
  getResumeAnalysisById,
} from "../controllers/resume.controller.js";
import {
  initializeMockInterview,
  chatMockInterview,
  getCareerChat,
  sendCareerChatMessage,
  clearCareerChat,
} from "../controllers/chat.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All AI routes are protected
router.use(protect);

// Resume routes
router.post("/analyze-resume", analyzeResume);
router.post("/resume/deep-analyze", upload.single("resume"), deepAnalyzeResume);
router.get("/resume/history", getResumeHistory);
router.delete("/resume/history", clearResumeHistory);
router.get("/resume/history/:id", getResumeAnalysisById);

// Mock Interview routes
router.post("/interview/init", initializeMockInterview);
router.post("/interview/message", chatMockInterview);

// Career Mentor routes
router.get("/mentor/chat", getCareerChat);
router.post("/mentor/message", sendCareerChatMessage);
router.delete("/mentor/chat", clearCareerChat);

export default router;
