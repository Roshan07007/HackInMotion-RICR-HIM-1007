import { Request, Response, NextFunction } from "express";
import * as videoInterviewService from "../services/videoInterview.service.js";

export const initializeInterview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const interview =
      await videoInterviewService.initializeVideoInterviewService(
        req.user!.id,
        req.body,
      );
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await videoInterviewService.processVideoInterviewAnswerService(
        req.user!.id,
        req.body,
      );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const finalizeInterview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const interview = await videoInterviewService.finalizeVideoInterviewService(
      req.user!.id,
      req.params.id,
      req.file,
    );
    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const history = await videoInterviewService.getVideoInterviewHistoryService(
      req.user!.id,
    );
    res.status(200).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const getInterviewById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const interview = await videoInterviewService.getVideoInterviewByIdService(
      req.params.id,
      req.user!.id,
    );
    if (!interview) {
      res.status(404).json({ success: false, error: "Interview not found" });
      return;
    }
    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    next(error);
  }
};

export const deleteInterview = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const interview = await videoInterviewService.deleteVideoInterviewService(
      req.params.id,
      req.user!.id,
    );
    if (!interview) {
      res.status(404).json({ success: false, error: "Interview not found" });
      return;
    }
    res.status(200).json({ success: true, message: "Interview deleted" });
  } catch (error) {
    next(error);
  }
};

export const deleteAllInterviews = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await videoInterviewService.deleteAllVideoInterviewsService(req.user!.id);
    res.status(200).json({ success: true, message: "All interviews deleted" });
  } catch (error) {
    next(error);
  }
};
