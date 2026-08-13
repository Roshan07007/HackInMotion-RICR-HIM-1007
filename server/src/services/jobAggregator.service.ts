import { fetchAdzunaJobs } from "./providers/adzuna.js";
import { fetchArbeitnowJobs } from "./providers/arbeitnow.js";
import Job from "../models/job.model.js";

export const getAggregatedJobs = async (filters: any) => {
  // Run both providers in parallel
  const [adzunaJobs, arbeitnowJobs] = await Promise.all([
    fetchAdzunaJobs(filters),
    fetchArbeitnowJobs(filters)
  ]);

  // Combine and sort (can improve sorting based on text match later)
  let combinedJobs = [...adzunaJobs, ...arbeitnowJobs];

  // For Arbeitnow, which doesn't support query parameters easily via the free endpoint,
  // we do some local filtering
  if (filters.q) {
    const query = filters.q.toLowerCase();
    combinedJobs = combinedJobs.filter((job: any) => 
      job.title?.toLowerCase().includes(query) || 
      job.companyName?.toLowerCase().includes(query) ||
      job.description?.toLowerCase().includes(query)
    );
  }

  if (filters.location && filters.location !== "All") {
    const loc = filters.location.toLowerCase();
    combinedJobs = combinedJobs.filter((job: any) => 
      job.location?.toLowerCase().includes(loc) || 
      job.remote
    );
  }

  // Pagination is handled a bit differently since we are aggregating multiple APIs.
  // We'll just slice the combined results.
  const page = parseInt(filters.page || "1");
  const limit = parseInt(filters.limit || "20");
  const skip = (page - 1) * limit;

  const paginatedJobs = combinedJobs.slice(skip, skip + limit);

  // Upsert the paginated jobs to local MongoDB so they get a real _id
  // and can be referenced by savedJobs and match calculations.
  const localJobs = await Promise.all(
    paginatedJobs.map(async (jobData: any) => {
      if (jobData.externalId) {
        // Find existing or create new
        const existing = await Job.findOne({ externalId: jobData.externalId });
        if (existing) {
          return existing;
        }
        
        // Remove externalId before saving if our schema doesn't support it, 
        // or add externalId to schema. Let's assume we can just save it.
        // Actually, to be safe against strict schema, we should just save standard fields.
        const newJob = new Job({
          title: jobData.title || "Unknown Title",
          companyName: jobData.companyName || "Unknown Company",
          location: jobData.location || "Not Specified",
          employmentType: jobData.employmentType || "Full time",
          experienceLevel: jobData.experienceLevel || "Mid level",
          salaryRange: jobData.salaryRange,
          skills: jobData.skills || [],
          description: jobData.description || "No description available.",
          responsibilities: jobData.responsibilities || [],
          requirements: jobData.requirements || [],
          applicationUrl: jobData.applicationUrl,
          externalId: jobData.externalId,
          source: jobData.source || "External"
        });
        await newJob.save();
        return newJob;
      }
      return jobData; // It's already a local job
    })
  );

  return {
    jobs: localJobs,
    total: combinedJobs.length,
    page,
    pages: Math.ceil(combinedJobs.length / limit)
  };
};
