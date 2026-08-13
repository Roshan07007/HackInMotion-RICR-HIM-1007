import { Request, Response } from "express";
import { 
  getJobsService, 
  getJobByIdService, 
  saveJobService, 
  removeSavedJobService, 
  getSavedJobsService, 
  calculateMatchScoreService,
  applyToJobService,
  getAppliedJobsService
} from "../services/job.service.js";

export const getJobs = async (req: Request, res: Response) => {
  try {
    const data = await getJobsService(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getJobById = async (req: Request, res: Response) => {
  try {
    const data = await getJobByIdService(req.params.id, req.user._id.toString());
    return res.status(200).json(data);
  } catch (error: any) {
    if (error.message === "Job not found") {
      return res.status(404).json({ error: error.message });
    }
    console.error("Error fetching job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const saveJob = async (req: Request, res: Response) => {
  try {
    const data = await saveJobService(req.params.id, req.user._id.toString());
    return res.status(200).json(data);
  } catch (error: any) {
    if (error.message === "Job already saved") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error saving job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeSavedJob = async (req: Request, res: Response) => {
  try {
    const data = await removeSavedJobService(req.params.id, req.user._id.toString());
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error removing saved job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSavedJobs = async (req: Request, res: Response) => {
  try {
    const data = await getSavedJobsService(req.user._id.toString());
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const calculateMatchScore = async (req: Request, res: Response) => {
  try {
    const data = await calculateMatchScoreService(req.params.id, req.user._id.toString());
    return res.status(200).json(data);
  } catch (error: any) {
    if (error.message === "Job not found" || error.message.includes("No resume analysis found")) {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error calculating match score:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const applyToJob = async (req: Request, res: Response) => {
  try {
    const data = await applyToJobService(req.params.id, req.user._id.toString());
    return res.status(200).json(data);
  } catch (error: any) {
    if (error.message === "Job not found" || error.message === "Already applied/opened this job") {
      return res.status(400).json({ error: error.message });
    }
    console.error("Error applying to job:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAppliedJobs = async (req: Request, res: Response) => {
  try {
    const data = await getAppliedJobsService(req.user._id.toString());
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching applied jobs:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
