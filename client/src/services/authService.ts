import { api } from "../config/api";
import { SendOtpPayload, SignupPayload, LoginPayload } from "../validations/auth.validation";

export const authService = {
  sendOtp: (payload: SendOtpPayload) =>
    api.post("/auth/send-signup-otp", payload),

  signup: (payload: SignupPayload) =>
    api.post("/auth/signup", payload),

  login: (payload: LoginPayload) =>
    api.post("/auth/login", payload),

  getMe: () => api.get("/auth/me"),

  updateMe: (data: FormData | Record<string, unknown>) =>
    api.put("/auth/me", data, {
      headers: data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    }),

  logout: () =>
    api.post("/auth/logout"),
};
