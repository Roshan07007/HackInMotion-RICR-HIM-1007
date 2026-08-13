import { Request, Response } from "express";
import {
  initializeMockInterviewService,
  chatMockInterviewService,
  getCareerChatService,
  sendCareerChatMessageService,
  clearCareerChatService,
} from "../services/chat.service.js";
import logger from "../utils/logger.js";

// ---------------------------------------------------------------------------
// Mock Interview
// ---------------------------------------------------------------------------

export const initializeMockInterview = async (req: Request, res: Response) => {
  try {
    const conversation = await initializeMockInterviewService(req.user._id, req.body);
    return res.status(200).json(conversation);
  } catch (error: any) {
    logger.error("initializeMockInterview error", error);
    if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const chatMockInterview = async (req: Request, res: Response) => {
  try {
    const conversation = await chatMockInterviewService(req.user._id, req.body);
    return res.status(200).json(conversation);
  } catch (error: any) {
    logger.error("chatMockInterview error", error);
    if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------------
// Career Mentor
// ---------------------------------------------------------------------------

export const getCareerChat = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await getCareerChatService(req.user._id, req.user.preferences, page, limit);
    return res.status(200).json({ success: true, data: { messages: result.data, pagination: result.pagination } });
  } catch (error: any) {
    logger.error("getCareerChat error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const sendCareerChatMessage = async (req: Request, res: Response) => {
  try {
    const messages = await sendCareerChatMessageService(req.user._id, req.user.preferences, req.body);
    const reply = messages[1]?.content || "Sorry, I couldn't process that.";
    return res.status(200).json({ success: true, data: { reply } });
  } catch (error: any) {
    logger.error("sendCareerChatMessage error", error);
    if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const clearCareerChat = async (req: Request, res: Response) => {
  try {
    await clearCareerChatService(req.user._id);
    return res.status(200).json({ success: true, message: "Chat cleared successfully" });
  } catch (error: any) {
    logger.error("clearCareerChat error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
