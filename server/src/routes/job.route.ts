import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { 
  getJobs, 
  getJobById, 
  saveJob, 
  removeSavedJob, 
  getSavedJobs, 
  calculateMatchScore,
  applyToJob,
  getAppliedJobs
} from "../controllers/job.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getJobs);
router.get("/saved", getSavedJobs);
router.get("/applied", getAppliedJobs);
router.get("/:id", getJobById);
router.post("/:id/save", saveJob);
router.delete("/:id/save", removeSavedJob);
router.post("/:id/apply", applyToJob);
router.get("/:id/match", calculateMatchScore);

export default router;
