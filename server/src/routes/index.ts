import express from "express";
import authRoutes from "./auth.route.js";
import uploadRoutes from "./upload.route.js";
import aiRoutes from "./ai.route.js";
import jobRoutes from "./job.route.js";
import videoInterviewRoutes from "./videoInterview.routes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/upload", uploadRoutes);
router.use("/ai", aiRoutes);
router.use("/jobs", jobRoutes);
router.use("/video-interview", videoInterviewRoutes);

export default router;
