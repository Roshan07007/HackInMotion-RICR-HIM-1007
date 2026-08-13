import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  role: z.enum(["user", "admin", "recruiter", "interviewer"]).optional().default("user"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const sendOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export type SignupPayload = z.infer<typeof signupSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type SendOtpPayload = z.infer<typeof sendOtpSchema>;
