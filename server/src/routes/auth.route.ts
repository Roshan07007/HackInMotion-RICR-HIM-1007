import express from "express";
import multer from "multer";
import {
  signup,
  login,
  getMe,
  logout,
  updateMe,
  genSignupOtp,
  savePushToken,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/send-signup-otp", authLimiter, genSignupOtp);
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.get("/me", protect, getMe);
router.put(
  "/me",
  protect,
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]),
  updateMe
);
router.post("/push-token", protect, savePushToken);

export default router;
