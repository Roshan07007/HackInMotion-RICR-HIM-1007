import { api } from "../config/api";

export interface JobFilters {
  q?: string;
  location?: string;
  employmentType?: string;
  experienceLevel?: string;
  page?: number;
  limit?: number;
}

export const jobService = {
  getJobs: (filters: JobFilters) => {
    const params = new URLSearchParams();
    if (filters.q) params.append("q", filters.q);
    if (filters.location) params.append("location", filters.location);
    if (filters.employmentType)
      params.append("employmentType", filters.employmentType);
    if (filters.experienceLevel)
      params.append("experienceLevel", filters.experienceLevel);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return api.get(`/jobs?${params.toString()}`);
  },

  getJobById: (id: string) => api.get(`/jobs/${id}`),

  saveJob: (id: string) => api.post(`/jobs/${id}/save`),

  removeSavedJob: (id: string) => api.delete(`/jobs/${id}/save`),

  getSavedJobs: () => api.get("/jobs/saved"),

  applyJob: (id: string) => api.post(`/jobs/${id}/apply`),

  getAppliedJobs: () => api.get("/jobs/applied"),

  calculateMatchScore: (id: string) => api.get(`/jobs/${id}/match`),
};
