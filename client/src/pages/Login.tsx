import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import Loading from "../components/common/Loading";
import toast from "react-hot-toast";
import { loginSchema, signupSchema, sendOtpSchema } from "../validations/auth.validation";
import { ZodError } from "zod";

const Login = () => {
  const navigate = useNavigate();
  const { login, signup, sendOtp, loading, isCheckingAuth, error, user } = useAuthStore();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setValidationError(null); // Clear error when user types
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    let ok;
    
    try {
      if (mode === "login") {
        const payload = loginSchema.parse({ email: form.email, password: form.password });
        ok = await login(payload);
        if (ok) navigate("/home");
      } else {
        if (!otpSent) {
          const payload = sendOtpSchema.parse({ email: form.email });
          ok = await sendOtp(payload);
          if (ok) setOtpSent(true);
        } else {
          const payload = signupSchema.parse({
            name: form.name,
            email: form.email,
            password: form.password,
            otp: form.otp,
            role: "user"
          });
          ok = await signup(payload);
          if (ok) navigate("/home");
        }
      }
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const zodError = err as any;
        setValidationError(zodError.errors[0].message);
        toast.error(zodError.errors[0].message);
      }
    }
  };

  if (isCheckingAuth || user) {
    return <Loading />;
  }

  return (
    <div className="min-h-dvh w-screen bg-base-100 text-base-content flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-base-200/80 backdrop-blur-md border border-base-300 rounded-3xl p-8 shadow-2xl">
          {/* Logo & title */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center text-2xl shadow-inner text-primary font-bold">
              <GraduationCap size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-xs text-base-content/50 text-center">
              {mode === "login"
                ? "Sign in to continue your learning journey"
                : "Join LMS and start learning the MERN stack"}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="tabs tabs-box bg-base-300/50 p-1 rounded-2xl w-full flex mb-6 border border-base-300">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setOtpSent(false);
              }}
              className={`tab flex-1 rounded-xl text-sm font-bold transition-all ${
                mode === "login"
                  ? "tab-active bg-primary text-primary-content!"
                  : ""
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setOtpSent(false);
              }}
              className={`tab flex-1 rounded-xl text-sm font-bold transition-all ${
                mode === "signup"
                  ? "tab-active bg-primary text-primary-content!"
                  : ""
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error */}
          {(error || validationError) && (
            <div className="alert alert-error alert-soft rounded-2xl text-xs mb-4 p-3 border border-error/20">
              ⚠️ {validationError || error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name — signup only */}
            {mode === "signup" && (
              <label className="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-colors">
                <User size={16} className="text-base-content/40 shrink-0" />
                <input
                  name="name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                />
              </label>
            )}

            {/* Email */}
            <label className="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-colors">
              <Mail size={16} className="text-base-content/40 shrink-0" />
              <input
                name="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                required
                className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
              />
            </label>

            {/* Password */}
            <label className="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-colors">
              <Lock size={16} className="text-base-content/40 shrink-0" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-base-content/40 hover:text-base-content transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </label>

            {/* OTP Input - only visible when OTP is sent during signup */}
            {mode === "signup" && otpSent && (
              <label className="input input-bordered rounded-2xl flex items-center gap-2 bg-base-100 border-base-300 focus-within:border-primary transition-colors">
                <Lock size={16} className="text-base-content/40 shrink-0" />
                <input
                  name="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={form.otp}
                  onChange={handleChange}
                  required
                  className="grow text-sm bg-transparent outline-none placeholder:text-base-content/30"
                />
              </label>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary rounded-2xl font-bold mt-2 w-full shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-transform"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : mode === "login" ? (
                "Sign In →"
              ) : otpSent ? (
                "Verify & Create Account →"
              ) : (
                "Send OTP →"
              )}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-base-content/40 mt-6">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setOtpSent(false);
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setOtpSent(false);
                  }}
                  className="text-primary font-bold hover:underline"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
