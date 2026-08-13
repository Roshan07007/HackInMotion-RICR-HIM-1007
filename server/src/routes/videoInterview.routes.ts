import { Router } from "express";
import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.js";
import {
  initializeInterview,
  submitAnswer,
  finalizeInterview,
  getHistory,
  getInterviewById,
  deleteInterview,
  deleteAllInterviews
} from "../controllers/videoInterview.controller.js";

const router = Router();

router.use(protect); // All routes require authentication

router.post("/init", initializeInterview);
router.post("/answer", submitAnswer);
router.post("/:id/finalize", upload.single("video"), finalizeInterview);
router.get("/history", getHistory);
router.delete("/history", deleteAllInterviews);
router.get("/:id", getInterviewById);
router.delete("/:id", deleteInterview);

export default router;
