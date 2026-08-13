import React, { useEffect, useState } from "react";
import { useJobStore } from "../store/useJobStore";
import JobCard from "../components/jobs/JobCard";
import Loading from "../components/common/Loading";
import { Bookmark, CheckCircle, ExternalLink, Briefcase } from "lucide-react";
import { useUiStore } from "../store/useUiStore";
import { setHeader } from "../utils/setHeader";
import { Link } from "react-router-dom";
import { Tabs } from "../components/common/Tabs";

type TabId = "saved" | "applied";

const TABS = [
  { id: "saved", label: "Saved Jobs", icon: <Bookmark className="w-4 h-4" /> },
  { id: "applied", label: "Applied Jobs", icon: <CheckCircle className="w-4 h-4" /> },
];

const SavedJobs = () => {
  const { savedJobs, appliedJobs, fetchSavedJobs, fetchAppliedJobs, isLoading } = useJobStore();
  const { setBreadcrumbs } = useUiStore();

  const [activeTab, setActiveTab] = useState<TabId>("saved");

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();

    setBreadcrumbs([
      { label: "Jobs", path: "/jobs" },
      { label: "Saved & Applied Jobs" },
    ]);

    return () => {
      setBreadcrumbs(null);
      setHeader("Dashboard", null);
    };
  }, []);

  // Keep the header tab switcher in sync with active tab
  useEffect(() => {
    setHeader(
      activeTab === "saved" ? "Saved Jobs" : "Applied Jobs",
      <Tabs
        tabs={TABS}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as TabId)}
        variant="box"
        className="shrink-0"
        dropdown
      />
    );
  }, [activeTab]);

  const savedList = savedJobs.filter((s: any) => s.jobId);
  const appliedList = appliedJobs;

  return (
    <div className="h-[calc(100vh-70px)] overflow-y-auto bg-base-200/20 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {isLoading ? (
          <div className="relative h-64">
            <Loading bgClass="bg-transparent" />
          </div>
        ) : activeTab === "saved" ? (
          savedList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {savedList.map((saved: any) => (
                <JobCard key={saved._id} job={saved.jobId} isSaved={true} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Bookmark className="w-12 h-12 text-base-content/20 mx-auto mb-4" />}
              title="No saved jobs yet"
              description="When you see a job you like, click the bookmark icon to save it here for later."
            />
          )
        ) : (
          appliedList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {appliedList.map((applied: any) => {
                const job = applied.jobId;
                if (!job) return null;
                return (
                  <div key={applied._id} className="relative">
                    <JobCard job={job} isSaved={savedList.some((s: any) => s.jobId?._id === job._id)} />
                    {/* Applied status badge */}
                    {/* <span
                      className={`absolute top-4 right-16 badge badge-sm font-semibold ${
                        applied.status === "Applied"
                          ? "badge-success badge-soft"
                          : "badge-warning badge-soft"
                      }`}
                    >
                      {applied.status === "Applied" ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Applied</>
                      ) : (
                        <><ExternalLink className="w-3 h-3 mr-1" /> Opened</>
                      )}
                    </span> */}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Briefcase className="w-12 h-12 text-base-content/20 mx-auto mb-4" />}
              title="No applied jobs yet"
              description="Jobs you apply to or open via external links will appear here so you can track them."
            />
          )
        )}

      </div>
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="text-center py-16 bg-base-100 rounded-xl border border-base-200">
    {icon}
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-base-content/60 mt-2 max-w-sm mx-auto">{description}</p>
    <Link to="/jobs" className="btn btn-primary mt-6">
      Browse Jobs
    </Link>
  </div>
);

export default SavedJobs;
