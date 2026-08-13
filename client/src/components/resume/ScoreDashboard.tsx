import React, { useState, useEffect } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { jobService } from "../../services/jobService";
import JobCard from "../jobs/JobCard";
import {
  Trophy,
  Target,
  FileSearch,
  Sparkles,
  CheckCircle2,
  Briefcase,
  FileText,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { DocViewerModal } from "../modals/DocViewerModal";
import { CircularProgress } from "../common/CircularProgress";
import Loading from "../common/Loading";

const ScoreDashboard = () => {
  const { analysisResult } = useResumeStore();
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);

  useEffect(() => {
    if (analysisResult?.jobRole) {
      const fetchJobs = async () => {
        try {
          setIsFetchingJobs(true);
          const res = await jobService.getJobs({ q: analysisResult.jobRole, limit: 3 });
          setSuggestedJobs(res.data.jobs);
        } catch (error) {
          console.error("Failed to fetch suggested jobs:", error);
        } finally {
          setIsFetchingJobs(false);
        }
      };
      fetchJobs();
    }
  }, [analysisResult?.jobRole]);

  if (!analysisResult) return null;

  const { scores } = analysisResult;

  const getColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-primary";
    if (score >= 60) return "text-warning";
    return "text-error";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Main Score Hero */}
      <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow border border-base-300 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -ml-20 -mb-20"></div>

        <div className="card-body relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm">
              <Trophy size={16} />
              Overall Match Score
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              {scores.overallMatch >= 90
                ? "Excellent Match! 🚀"
                : scores.overallMatch >= 75
                  ? "Strong Candidate 🌟"
                  : scores.overallMatch >= 60
                    ? "Good Potential 👍"
                    : "Needs Improvement 🔧"}
            </h2>
            <div className="flex flex-col w-fit gap-4 text-base-content/70">
              <p className="max-w-md">
                <strong>Job Role :</strong> {analysisResult.jobRole}
              </p>
              <button
                onClick={() => setIsDocViewerOpen(true)}
                className="btn btn-sm btn-outline btn-primary gap-2"
              >
                <FileText size={14} />
                View Document
              </button>
            </div>
          </div>

          <div className="shrink-0 scale-125 md:scale-100">
            <CircularProgress
              value={scores.overallMatch}
              label=""
              size="xl"
              color={getColor(scores.overallMatch)}
            />
          </div>
        </div>
      </div>

      {/* Score Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow border border-base-200 hover:border-primary/30 transition-colors">
          <div className="card-body items-center text-center p-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Target size={20} className="text-primary" />
            </div>
            <CircularProgress
              value={scores.skillsMatch}
              label="Skills Match"
              color={getColor(scores.skillsMatch)}
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 hover:border-primary/30 transition-colors">
          <div className="card-body items-center text-center p-6">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-2">
              <Briefcase size={20} className="text-secondary" />
            </div>
            <CircularProgress
              value={scores.experienceMatch}
              label="Experience"
              color={getColor(scores.experienceMatch)}
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 hover:border-primary/30 transition-colors">
          <div className="card-body items-center text-center p-6">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-2">
              <FileSearch size={20} className="text-accent" />
            </div>
            <CircularProgress
              value={scores.atsReadiness}
              label="ATS Readiness"
              color={getColor(scores.atsReadiness)}
            />
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-200 hover:border-primary/30 transition-colors">
          <div className="card-body items-center text-center p-6">
            <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center mb-2">
              <Sparkles size={20} className="text-info" />
            </div>
            <CircularProgress
              value={scores.impactQuantification}
              label="Impact Score"
              color={getColor(scores.impactQuantification)}
            />
          </div>
        </div>
      </div>

      {/* Explanations */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-success" />
          Why You Got This Score
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysisResult.matchExplanations.map((item, idx) => (
            <div
              key={idx}
              className="bg-base-200/50 p-4 rounded-xl border border-base-300"
            >
              <h4 className="font-semibold text-primary mb-1">
                {item.category}
              </h4>
              <p className="text-sm text-base-content/80 leading-relaxed">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Jobs Section */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Briefcase className="text-primary" /> Recommended Jobs
            </h3>
            <p className="text-base-content/70 text-sm mt-1">Based on your analyzed resume</p>
          </div>
          <Link to="/jobs" className="btn btn-primary btn-outline btn-sm gap-2">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isFetchingJobs ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : suggestedJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {suggestedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-200/30 rounded-2xl border border-base-200 border-dashed">
            <p className="text-base-content/60">No jobs found perfectly matching this role right now.</p>
            <Link to="/jobs" className="btn btn-primary mt-4">Browse All Jobs</Link>
          </div>
        )}
      </div>
      
      <DocViewerModal 
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
      />
    </div>
  );
};

export default ScoreDashboard;
