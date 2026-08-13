import { create } from "zustand";
import { authService } from "../services/authService";

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  preferences?: {
    skills?: string[];
    desiredJobs?: string[];
    desiredCompanies?: string[];
    experienceLevel?: "beginner" | "intermediate" | "expert";
    aiCommunicationStyle?: "formal" | "casual" | "technical";
    cameraEnabled?: boolean;
    microphoneEnabled?: boolean;
    theme?: "dark" | "light" | "system";
  };
  avatar?: {
    url?: string;
    publicId?: string;
  };
  resume?: {
    url?: string;
    publicId?: string;
  };
  bio?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  otherLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

import { SendOtpPayload, SignupPayload, LoginPayload } from "../validations/auth.validation";
import { AxiosError } from "axios";

export interface AuthState {
  user: User | null;
  loading: boolean;
  isCheckingAuth: boolean;
  error: string | null;
  sendOtp: (payload: SendOtpPayload) => Promise<boolean>;
  signup: (payload: SignupPayload) => Promise<boolean>;
  login: (payload: LoginPayload) => Promise<boolean>;
  getMe: () => Promise<void>;
  optimisticUpdate: (updates: Partial<User>) => void;
  uploadAvatar: (file: File) => Promise<boolean>;
  updateProfile: (updates: Partial<User> | FormData) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  isCheckingAuth: true,
  error: null,

  sendOtp: async (payload: SendOtpPayload) => {
    set({ loading: true, error: null });
    try {
      await authService.sendOtp(payload);
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string }>;
      set({
        error: axiosError.response?.data?.message || axiosError.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signup: async (payload: SignupPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.signup(payload);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      set({ user: response.data.data, error: null, loading: false });
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string; errors?: any }>;
      // If validation error from server
      const msg = axiosError.response?.data?.errors 
        ? JSON.stringify(axiosError.response.data.errors) 
        : (axiosError.response?.data?.message || axiosError.message);
      set({
        error: msg,
        loading: false,
      });
      return false;
    }
  },

  login: async (payload: LoginPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(payload);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      set({ user: response.data.data, error: null, loading: false });
      return true;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message: string; errors?: any }>;
      const msg = axiosError.response?.data?.errors 
        ? JSON.stringify(axiosError.response.data.errors) 
        : (axiosError.response?.data?.message || axiosError.message);
      set({
        error: msg,
        loading: false,
      });
      return false;
    }
  },

  getMe: async () => {
    set({ isCheckingAuth: true });
    try {
      const { data } = await authService.getMe();
      set({ user: data.data, isCheckingAuth: false });
    } catch (err: any) {
      set({ isCheckingAuth: false });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  optimisticUpdate: (updates: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : state.user,
    }));
  },

  uploadAvatar: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await authService.updateMe(formData);
      // Set the real Cloudinary URL from server into the store
      set({ user: data.data });
      return true;
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message });
      return false;
    }
  },

  updateProfile: async (updates: Partial<User> | FormData) => {
    // Snapshot BEFORE any optimistic changes for rollback
    const previousUser = useAuthStore.getState().user;
    set({ loading: true, error: null });
    try {
      const { data } = await authService.updateMe(updates);
      set({ user: data.data, loading: false });
      return true;
    } catch (err: any) {
      // Rollback to previous state on failure
      set({
        user: previousUser,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return false;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (_) {
      // ignore errors — cookie may already be expired
    } finally {
      localStorage.removeItem("token");
      set({ loading: false });
    }
    set({
      user: null,
      error: null,
    });
  },
}));

