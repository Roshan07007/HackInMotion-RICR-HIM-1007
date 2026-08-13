import axios from "axios";

export const fetchAdzunaJobs = async (filters: any) => {
  try {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_Key;

    if (!appId || !appKey) {

      return [];
    }

    const { q, location, page = "1" } = filters;
    let url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&results_per_page=20`;
    
    if (q) {
      url += `&what=${encodeURIComponent(q)}`;
    }
    
    if (location && location !== "All") {
      url += `&where=${encodeURIComponent(location)}`;
    }

    const response = await axios.get(url, {
      headers: {
        "Accept": "application/json"
      },
      timeout: 10000 // 10s timeout
    });

    const jobs = response.data.results;

    return jobs.map((job: any) => ({
      // We prefix the id so we can identify external jobs
      externalId: `adzuna_${job.id}`,
      title: job.title,
      companyName: job.company?.display_name || "Unknown Company",
      location: job.location?.display_name || "India",
      employmentType: job.contract_time === "contract" ? "Contract" : "Full time",
      experienceLevel: "Mid level", // Adzuna doesn't explicitly return level in a standardized way
      salaryRange: job.salary_min && job.salary_max ? `₹${(job.salary_min/100000).toFixed(1)}L - ₹${(job.salary_max/100000).toFixed(1)}L` : undefined,
      skills: [], // Adzuna doesn't return an array of skills, we'd need AI to extract this from desc
      description: job.description,
      responsibilities: [],
      requirements: [],
      applicationUrl: job.redirect_url,
      source: "Adzuna"
    }));
  } catch (error) {
    console.error("Adzuna API error:", error);
    return [];
  }
};
