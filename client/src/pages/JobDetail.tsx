import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobStore } from "../store/useJobStore";
import { useUiStore } from "../store/useUiStore";
import { jobService } from "../services/jobService";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Building,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import Loading from "../components/common/Loading";
import { CircularProgress } from "../components/common/CircularProgress";
import toast from "react-hot-toast";

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    toggleSaveJob,
    fetchSavedJobs,
    savedJobs,
    appliedJobs,
    applyToJob,
    fetchAppliedJobs,
  } = useJobStore();
  const { setHeaderTitle, setBreadcrumbs } = useUiStore();

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matchScore, setMatchScore] = useState<any>(null);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    setHeaderTitle("Job Details");
    fetchJobDetails();
    fetchSavedJobs();
    fetchAppliedJobs();

    return () => setBreadcrumbs(null);
  }, [id, setHeaderTitle, setBreadcrumbs]);

  useEffect(() => {
    if (job) {
      setBreadcrumbs([{ label: "Jobs", path: "/jobs" }, { label: job.title }]);
    }
  }, [job, setBreadcrumbs]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getJobById(id!);
      setJob(res.data);
    } catch (error) {
      toast.error("Failed to fetch job details");
      navigate("/jobs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchResume = async () => {
    try {
      setIsScoring(true);
      const res = await jobService.calculateMatchScore(id!);
      setMatchScore(res.data);
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || "Failed to calculate match score",
      );
    } finally {
      setIsScoring(false);
    }
  };

  const handleDeepAnalysis = () => {
    // Navigate to resume analyzer with this job context
    // This assumes ResumeAnalyzer handles reading location.state
    navigate("/resume-analyzer", {
      state: { targetJobId: id, targetJobTitle: job.title },
    });
  };

  const handleApply = async (e: React.MouseEvent) => {
    try {
      await applyToJob(id!);
    } catch (error) {
      // handled in store
    }
  };

  if (isLoading || !job) {
    return <Loading />;
  }

  const isSaved = savedJobs.some((s) => s.jobId?._id === id || s.jobId === id);
  const appliedRecord = appliedJobs.find(
    (a) => a.jobId?._id === id || a.jobId === id,
  );
  const hasAppliedOrOpened = !!appliedRecord;

  return (
    <div className="h-[calc(100vh-70px)] overflow-y-auto bg-base-200/20 fade-in">
      {/* Header Banner */}
      <div className="bg-base-100 border-b border-base-200 sticky top-0 z-20 pt-4 md:pt-8 pb-6 px-4 md:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
              <p className="text-lg text-base-content/70 mt-1 flex items-center gap-2">
                <Building className="w-5 h-5" />
                {job.companyName}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-base-content/70 font-medium">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> {job.employmentType}
              </span>
              {job.salaryRange && (
                <span className="flex items-center gap-1.5">
                  <IndianRupee className="w-4 h-4" /> {job.salaryRange}
                </span>
                
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Posted 2 days ago
              </span>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            {job.applicationUrl ? (
              <a
                href={job.applicationUrl}
                target="_blank"
                rel="noreferrer"
                onClick={handleApply}
                className={`btn ${hasAppliedOrOpened ? "btn-success btn-outline" : "btn-primary"}`}
              >
                {hasAppliedOrOpened ? "Opened External" : "Apply Now"}{" "}
                <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            ) : (
              <button
                onClick={handleApply}
                disabled={hasAppliedOrOpened}
                className={`btn ${hasAppliedOrOpened ? "btn-success" : "btn-primary"}`}
              >
                {hasAppliedOrOpened ? "Applied" : "Apply Now"}
              </button>
            )}

            <button
              onClick={() => toggleSaveJob(id!, isSaved)}
              className={`btn btn-outline ${isSaved ? "btn-primary" : ""}`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4 fill-primary/20" /> Saved
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" /> Save Job
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-8">
          <section className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">About the role</h2>
              <div className="prose prose-sm md:prose-base max-w-none text-base-content/80 whitespace-pre-wrap">
                {job.description}
              </div>
            </div>
          </section>

          <section className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {job.responsibilities.map((req: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base-content/80"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Requirements</h2>
              <ul className="space-y-3">
                {job.requirements.map((req: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-base-content/80"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Right Column - AI Insights & Match */}
        <div className="space-y-6">
          {/* AI Resume Match Card */}
          <div className="card bg-gradient-to-br from-primary/10 to-base-100 shadow border border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="card-body relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-lg">Resume Match</h3>
              </div>

              {!matchScore ? (
                <div className="text-center py-6">
                  <p className="text-sm text-base-content/70 mb-4">
                    Find out how well your resume matches this role using our AI
                    scoring engine.
                  </p>
                  <button
                    onClick={handleMatchResume}
                    disabled={isScoring}
                    className="btn btn-primary w-full"
                  >
                    {isScoring ? <Loading className="w-6 h-6" /> : "Calculate Match"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col items-center pt-4">
                    <CircularProgress
                      value={matchScore.overallScore}
                      size="lg"
                      color={
                        matchScore.overallScore >= 80
                          ? "text-success"
                          : matchScore.overallScore >= 60
                            ? "text-warning"
                            : "text-error"
                      }
                    />
                    <p className="font-medium mt-2">
                      {matchScore.overallScore >= 80
                        ? "Strong Match"
                        : matchScore.overallScore >= 60
                          ? "Good Potential"
                          : "Needs Improvement"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/70">Skills Match</span>
                      <span className="font-medium">
                        {matchScore.breakdown.skills}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/70">Experience</span>
                      <span className="font-medium">
                        {matchScore.breakdown.experience}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-base-content/70">Keywords</span>
                      <span className="font-medium">
                        {matchScore.breakdown.keywords}%
                      </span>
                    </div>
                  </div>

                  {matchScore.missingSkills &&
                    matchScore.missingSkills.length > 0 && (
                      <div className="bg-base-200/50 rounded-lg p-4 text-sm">
                        <p className="font-semibold mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {matchScore.missingSkills.map(
                            (ms: any, i: number) => (
                              <span
                                key={i}
                                className="badge badge-sm badge-error badge-outline"
                              >
                                {ms.skill}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  <button
                    onClick={handleDeepAnalysis}
                    className="btn btn-outline btn-primary w-full gap-2"
                  >
                    Improve My Resume <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* AI Job Insights */}
          {job.aiInsights && (
            <div className="card bg-base-100 shadow-sm border border-base-200">
              <div className="card-body">
                <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  AI Job Insights
                </h3>

                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wider">
                      Critical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.aiInsights.criticalSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="badge badge-primary bg-primary/10 text-primary border-primary/20 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-base-content/70 mb-2 uppercase tracking-wider">
                      Important Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.aiInsights.importantSkills.map((skill: string) => (
                        <span
                          key={skill}
                          className="badge badge-outline border-base-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-base-200/50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-base-content/70 mb-1">
                      Experience Required
                    </h4>
                    <p className="font-medium">
                      {job.aiInsights.experienceRequired}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
