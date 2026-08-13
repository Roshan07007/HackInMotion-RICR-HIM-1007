import { create } from "zustand";
import { jobService, JobFilters } from "../services/jobService";
import toast from "react-hot-toast";

interface JobState {
  jobs: any[];
  savedJobs: any[];
  appliedJobs: any[];
  totalJobs: number;
  isLoading: boolean;
  isSaving: boolean;
  hasFetched: boolean;
  filters: JobFilters;
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  fetchSavedJobs: () => Promise<void>;
  fetchAppliedJobs: () => Promise<void>;
  toggleSaveJob: (jobId: string, isSaved: boolean) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  setFilters: (filters: Partial<JobFilters>) => void;
  setPage: (page: number) => void;
  clearFilters: () => void;
}

const initialFilters: JobFilters = {
  q: "",
  location: "All",
  employmentType: "All",
  experienceLevel: "All",
  page: 1,
  limit: 20,
};

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
  totalJobs: 0,
  isLoading: false,
  isSaving: false,
  hasFetched: false,
  filters: initialFilters,

  fetchJobs: async (newFilters?: JobFilters) => {
    try {
      set({ isLoading: true });
      const currentFilters = get().filters;
      const combinedFilters = { ...currentFilters, ...newFilters };
      
      const res = await jobService.getJobs(combinedFilters);
      
      set({ 
        jobs: res.data.jobs, 
        totalJobs: res.data.total,
        filters: combinedFilters,
        hasFetched: true
      });
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to fetch jobs");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSavedJobs: async () => {
    try {
      set({ isLoading: true });
      const res = await jobService.getSavedJobs();
      set({ savedJobs: res.data });
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
      toast.error("Failed to fetch saved jobs");
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAppliedJobs: async () => {
    try {
      set({ isLoading: true });
      const res = await jobService.getAppliedJobs();
      set({ appliedJobs: res.data });
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error);
      toast.error("Failed to fetch applied jobs");
    } finally {
      set({ isLoading: false });
    }
  },

  applyToJob: async (jobId: string) => {
    try {
      set({ isSaving: true });
      const res = await jobService.applyJob(jobId);
      toast.success(res.data.message);
      get().fetchAppliedJobs();
    } catch (error: any) {
      console.error("Failed to apply:", error);
      toast.error(error.response?.data?.error || "Failed to apply");
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },



  toggleSaveJob: async (jobId: string, isSaved: boolean) => {
    try {
      set({ isSaving: true });
      if (isSaved) {
        await jobService.removeSavedJob(jobId);
        toast.success("Job removed from saved");
      } else {
        await jobService.saveJob(jobId);
        toast.success("Job saved successfully");
      }
      
      // Update local state if needed (refetch saved jobs)
      get().fetchSavedJobs();
    } catch (error) {
      console.error("Failed to toggle save job:", error);
      toast.error("Failed to save/unsave job");
      throw error;
    } finally {
      set({ isSaving: false });
    }
  },

  setFilters: (filters: Partial<JobFilters>) => {
    // If the user is changing search, location, etc., we want to reset to page 1
    // But if they are just updating the page, we don't want to reset it
    const isOnlyPageUpdate = Object.keys(filters).length === 1 && 'page' in filters;
    const newPage = isOnlyPageUpdate ? filters.page : 1;
    
    set({ filters: { ...get().filters, ...filters, page: newPage } });
  },

  setPage: (page: number) => {
    set({ filters: { ...get().filters, page } });
  },

  clearFilters: () => {
    set({ filters: initialFilters });
  }
}));
