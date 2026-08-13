import axios from "axios";

export const fetchArbeitnowJobs = async (_filters: any) => {
  try {
    // Arbeitnow API URL: https://www.arbeitnow.com/api/job-board-api
    // Doesn't support strict query filtering via URL in the same way, so we fetch and filter locally if needed
    // We will just fetch the first page
    const response = await axios.get("https://www.arbeitnow.com/api/job-board-api");
    const jobs = response.data.data;

    return jobs.map((job: any) => ({
      externalId: `arbeitnow_${job.slug}`,
      title: job.title,
      companyName: job.company_name,
      location: job.location,
      employmentType: "Full time", // Arbeitnow doesn't always provide this cleanly
      experienceLevel: "Mid level", // Default fallback
      skills: job.tags || [],
      description: job.description,
      responsibilities: [], // Not separately provided
      requirements: [], // Not separately provided
      applicationUrl: job.url,
      source: "Arbeitnow",
      remote: job.remote
    }));
  } catch (error) {
    console.error("Arbeitnow API error:", error);
    return [];
  }
};
