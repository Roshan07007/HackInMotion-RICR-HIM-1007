import React, { useEffect } from "react";
import { useJobStore } from "../store/useJobStore";
import JobCard from "../components/jobs/JobCard";
import { JobFilter } from "../components/jobs/JobFilter";
import { Pagination } from "../components/common/Pagination";
import Loading from "../components/common/Loading";
import { Briefcase } from "lucide-react";
import { useUiStore } from "../store/useUiStore";
import { useDebounce } from "../hooks/useDebounce";
import { Link } from "react-router-dom";

const Jobs = () => {
  const {
    jobs,
    savedJobs,
    fetchJobs,
    fetchSavedJobs,
    isLoading,
    filters,
    totalJobs,
    setFilters,
    setPage,
    hasFetched,
  } = useJobStore();
  const { setHeaderTitle, setHeaderActions } = useUiStore();

  // Use a local state for the debounced search to avoid spamming the API
  const debouncedQ = useDebounce(filters.q, 500);

  useEffect(() => {
    setHeaderTitle("Job Discover");
    setHeaderActions(
      <Link to="/jobs/saved" className="btn btn-primary btn-sm btn-soft gap-2">
        <Briefcase className="w-4 h-4" />
        <span className="hidden md:flex"> My Jobs</span>
      </Link>,
    );
    fetchSavedJobs();
  }, [setHeaderTitle, fetchSavedJobs]);

  useEffect(() => {
    fetchJobs();
  }, [
    debouncedQ,
    filters.location,
    filters.employmentType,
    filters.experienceLevel,
    filters.page,
    filters.limit,
  ]);

  const isJobSaved = (jobId: string) =>
    savedJobs.some((s) => s.jobId?._id === jobId || s.jobId === jobId);

  const handlePageChange = (page: number) => {
    setPage(page);
    const container = document.getElementById("jobs-scroll-container");
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      id="jobs-scroll-container"
      className="h-[calc(100vh-70px)] overflow-y-auto bg-base-200/20 p-4 md:p-8"
    >
      <div className=" mx-auto">
        {/* Mobile Header Actions */}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Job Feed - Right Column */}
          <div className="lg:col-span-3 space-y-6 relative min-h-[400px]">
            {(!hasFetched || isLoading) && (
              <Loading bgClass="absolute inset-0 bg-base-200/50 backdrop-blur-sm rounded-2xl z-10" />
            )}

            {/* Jobs List */}
            {jobs.length > 0 ? (
              <div
                className={`grid grid-cols-1 gap-4 transition-opacity duration-300 ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
              >
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={isJobSaved(job._id)}
                  />
                ))}

                <Pagination
                  currentPage={filters.page || 1}
                  totalPages={Math.max(
                    1,
                    Math.ceil(totalJobs / (filters.limit || 20)),
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            ) : (!isLoading && hasFetched) ? (
              <div className="text-center py-12 bg-base-100 rounded-xl border border-base-200">
                <h3 className="text-lg font-medium">No jobs found</h3>
                <p className="text-base-content/60 mt-2">
                  Try adjusting your filters.
                </p>
              </div>
            ) : null}
          </div>

          <div className="lg:block lg:col-span-1 order-first lg:order-last">
            <JobFilter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
