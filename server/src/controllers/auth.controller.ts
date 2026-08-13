import { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import { generateToken } from "../utils/jwt.js";
import genOtpToken from "../utils/genOtpToken.js";
import logger from "../utils/logger.js";
import { signupSchema, loginSchema, sendOtpSchema } from "../validations/auth.validation.js";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = signupSchema.parse({ body: req.body }).body;
    
    const newUser = await authService.signup(validatedData);
    const token = await generateToken(newUser, res);
    const safeUser: any = newUser.toObject();
    delete safeUser.password;
    res
      .status(201)
      .json({ message: "Registration Successful", data: safeUser, token });
  } catch (error) {
    logger.error("Error in signup controller", error);
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = loginSchema.parse({ body: req.body }).body;
    const user = await authService.login(validatedData);
    const token = await generateToken(user, res);
    const safeUser: any = user.toObject();
    delete safeUser.password;
    res
      .status(200)
      .json({ message: "Login successfully", data: safeUser, token });
  } catch (error) {
    logger.error("Error in login controller", error);
    next(error);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    logger.error("Error in logout controller", error);
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const safeUser: any = req.user.toObject();
    delete safeUser.password;
    res.status(200).json({ message: "User Authenticated", data: safeUser });
  } catch (error) {
    logger.error("Error in getMe controller", error);
    next(error);
  }
};

export const genSignupOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validatedData = sendOtpSchema.parse({ body: req.body }).body;
    await authService.generateSignupOtp(validatedData.email);
    res.status(200).json({ message: "Signup Otp sent successfully" });
  } catch (error) {
    logger.error("Error in genSignupOtp", error);
    next(error);
  }
};

export const genOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return next({ status: 400, message: "Email is required." });
    }
    await authService.generateOtp(email);
    res.status(200).json({ message: "Otp sent successfully" });
  } catch (error) {
    logger.error("Error in genOtp", error);
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next({ status: 400, message: "All fields are required." });
    }
    const user = await authService.verifyOtp({ email, otp });
    await genOtpToken(user, res);
    res.status(200).json({ message: "Otp verified successfully" });
  } catch (error) {
    logger.error("Error in verifyOtp", error);
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { newPassword } = req.body;
    const currentUser = req.user;
    if (!newPassword) {
      return next({ status: 400, message: "All fields are required." });
    }
    await authService.resetPassword(currentUser, newPassword);
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    logger.error("Error in resetPassword", error);
    next(error);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, phone, preferences } = req.body;
    let parsedPreferences;
    
    // Check if preferences is sent as string (multipart/form-data)
    if (typeof preferences === 'string') {
      try {
        parsedPreferences = JSON.parse(preferences);
      } catch {
        parsedPreferences = undefined;
      }
    } else {
      parsedPreferences = preferences;
    }

    const user = await authService.updateProfile(req.user._id, {
      name,
      phone,
      preferences: parsedPreferences,
      file: req.file,
    });
    const safeUser: any = user.toObject();
    delete safeUser.password;
    res.status(200).json({ success: true, data: safeUser });
  } catch (error) {
    logger.error("Error updating profile", error);
    next(error);
  }
};

export const savePushToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token } = req.body;
    if (!token) {
      return next({ status: 400, message: "Token is required." });
    }

    await authService.savePushToken(req.user._id, token);
    res
      .status(200)
      .json({ success: true, message: "Push token saved successfully" });
  } catch (error) {
    logger.error("Error saving push token", error);
    next(error);
  }
};
