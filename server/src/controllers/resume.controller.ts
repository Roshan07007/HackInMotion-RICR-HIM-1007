import { Request, Response } from "express";
import {
  deepAnalyzeResumeService,
  analyzeResumeService,
  getResumeHistoryService,
  clearResumeHistoryService,
  getResumeAnalysisByIdService,
} from "../services/resume.service.js";
import logger from "../utils/logger.js";

export const deepAnalyzeResume = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Resume file is required" });
    }
    const analysis = await deepAnalyzeResumeService(req.user._id, req.file, req.body);
    return res.status(200).json({ success: true, data: analysis });
  } catch (error: any) {
    logger.error("deepAnalyzeResume error", error);
    if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const analyzeResume = async (req: Request, res: Response) => {
  try {
    const analysis = await analyzeResumeService(req.user._id, req.body);
    return res.status(200).json({ success: true, data: analysis });
  } catch (error: any) {
    logger.error("analyzeResume error", error);
    if (error.name === "ZodError") return res.status(400).json({ error: error.errors });
    return res.status(error.statusCode || 500).json({ error: error.message || "Internal Server Error" });
  }
};

export const getResumeHistory = async (req: Request, res: Response) => {
  try {
    const history = await getResumeHistoryService(req.user._id);
    return res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    logger.error("getResumeHistory error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const clearResumeHistory = async (req: Request, res: Response) => {
  try {
    await clearResumeHistoryService(req.user._id);
    return res.status(200).json({ success: true, message: "History cleared successfully" });
  } catch (error: any) {
    logger.error("clearResumeHistory error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getResumeAnalysisById = async (req: Request, res: Response) => {
  try {
    const analysis = await getResumeAnalysisByIdService(req.params.id, req.user._id);
    if (!analysis) return res.status(404).json({ error: "Analysis not found" });
    return res.status(200).json({ success: true, data: analysis });
  } catch (error: any) {
    logger.error("getResumeAnalysisById error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
