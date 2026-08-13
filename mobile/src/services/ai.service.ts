import { api } from "../config/api";

export const aiService = {
  getCareerChat: (page: number = 1, limit: number = 20) =>
    api.get(`/ai/mentor/chat?page=${page}&limit=${limit}`),

  sendCareerChatMessage: (message: string) =>
    api.post("/ai/mentor/message", { message }),
    
  clearCareerChat: () => api.delete("/ai/mentor/chat"),

  deepAnalyzeResume: (formData: FormData) => 
    api.post("/ai/resume/deep-analyze", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getResumeHistory: () => api.get("/ai/resume/history"),
  
  clearResumeHistory: () => api.delete("/ai/resume/history"),
  
  getResumeAnalysisById: (id: string) => api.get(`/ai/resume/history/${id}`),
};
