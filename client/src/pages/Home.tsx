import React, { useEffect, useState } from "react";
import { useUiStore } from "../store/useUiStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  PlayCircle,
  Briefcase,
  Bot,
  ChevronRight,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import { api } from "../config/api";
import { aiService } from "../services/aiService";
import { jobService } from "../services/jobService";
import { CircularProgress } from "../components/common/CircularProgress";

const Home = () => {
  const { setHeaderTitle, setHeaderActions } = useUiStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    mockInterviews: 0,
    resumeAnalyses: 0,
    savedJobs: 0,
  });

  const [recentInterviews, setRecentInterviews] = useState<any[]>([]);
  const [recentResumes, setRecentResumes] = useState<any[]>([]);

  useEffect(() => {
    setHeaderTitle("Dashboard");
    setHeaderActions(null);

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [interviewsRes, resumesRes, jobsRes] = await Promise.all([
          api.get("/video-interview/history"),
          aiService.getResumeHistory(),
          jobService.getSavedJobs(),
        ]);

        const interviews = interviewsRes.data.data || [];
        const resumes = resumesRes.data.data || [];
        const savedJobs = jobsRes.data.jobs || [];

        setStats({
          mockInterviews: interviews.length,
          resumeAnalyses: resumes.length,
          savedJobs: savedJobs.length,
        });

        // Get top 3 most recent
        setRecentInterviews(interviews.slice(0, 3));
        setRecentResumes(resumes.slice(0, 3));
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [setHeaderTitle, setHeaderActions]);

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <div className="mx-auto p-4 md:p-6 pb-20 space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Welcome Banner */}
      {/* <div className="bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 rounded-3xl p-8 border border-base-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {firstName}! 👋</h1>
          <p className="text-base-content/70 max-w-xl">
            {stats.mockInterviews > 0 || stats.resumeAnalyses > 0
              ? "You're making great progress. Keep up the momentum!"
              : "Let's kickstart your career journey. Try optimizing your resume or taking a mock interview to get started."}
          </p>
        </div>
        
        <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -mb-10 pointer-events-none"></div>
      </div> */}

      {/* Quick Actions */}
      <div>
        {/* <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={20} /> Quick Actions
        </h2> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/resume-analyzer"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-primary/50 hover:shadow transition-all group"
          >
            <div className="card-body p-6 items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold">Resume Analyzer</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Optimize your CV for ATS
              </p>
            </div>
          </Link>

          <Link
            to="/interview"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-secondary/50 hover:shadow-md transition-all group"
          >
            <div className="card-body p-6 items-center text-center">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlayCircle className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-bold">Mock Interview</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Practice with AI interviewer
              </p>
            </div>
          </Link>

          <Link
            to="/jobs"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-accent/50 hover:shadow-md transition-all group"
          >
            <div className="card-body p-6 items-center text-center">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-bold">Find Jobs</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Discover tailored opportunities
              </p>
            </div>
          </Link>

          <Link
            to="/ai-mentor"
            className="card bg-base-100 shadow-sm border border-base-200 hover:border-info/50 hover:shadow-md transition-all group"
          >
            <div className="card-body p-6 items-center text-center">
              <div className="w-12 h-12 rounded-full bg-info/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6 text-info" />
              </div>
              <h3 className="font-bold">AI Mentor</h3>
              <p className="text-xs text-base-content/60 mt-1">
                Get personalized career advice
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Stats & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="text-primary" size={20} /> Your Progress
          </h2>

          <div className="stats stats-vertical shadow border border-base-200 w-full bg-base-100">
            <div className="stat">
              <div className="stat-figure text-primary">
                <PlayCircle size={28} />
              </div>
              <div className="stat-title">Mock Interviews</div>
              <div className="stat-value text-primary">
                {stats.mockInterviews}
              </div>
              <div className="stat-desc">Completed sessions</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-secondary">
                <FileText size={28} />
              </div>
              <div className="stat-title">Resume Analyses</div>
              <div className="stat-value text-secondary">
                {stats.resumeAnalyses}
              </div>
              <div className="stat-desc">Scanned documents</div>
            </div>

            <div className="stat">
              <div className="stat-figure text-accent">
                <Briefcase size={28} />
              </div>
              <div className="stat-title">Saved Jobs</div>
              <div className="stat-value text-accent">{stats.savedJobs}</div>
              <div className="stat-desc">Opportunities tracked</div>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Mock Interviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Award className="text-primary" size={20} /> Recent Interviews
              </h2>
              <Link
                to="/interview"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center p-8 bg-base-200/30 rounded-2xl border border-base-200">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : recentInterviews.length > 0 ? (
              <div className="space-y-3">
                {recentInterviews.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/interview/${item._id}/report`)}
                    className="bg-base-100 hover:bg-base-200/50 p-4 rounded-2xl border border-base-200 hover:border-primary/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-base">{item.jobRole}</h4>
                      <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                        {item.companyName && <span>{item.companyName} • </span>}
                        <span>
                          {new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.overallReport?.hireabilityRating ? (
                        <div
                          className={`badge ${
                            item.overallReport.hireabilityRating ===
                            "Strong Hire"
                              ? "badge-success"
                              : item.overallReport.hireabilityRating === "Hire"
                                ? "badge-info"
                                : item.overallReport.hireabilityRating ===
                                    "Weak Hire"
                                  ? "badge-warning"
                                  : "badge-error"
                          }`}
                        >
                          {item.overallReport.hireabilityRating}
                        </div>
                      ) : (
                        <div className="badge badge-ghost">Pending</div>
                      )}
                      <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-base-200/30 rounded-2xl border border-base-200 border-dashed">
                <p className="text-base-content/60">No recent interviews.</p>
                <Link to="/interview" className="btn btn-primary btn-sm mt-3">
                  Start One Now
                </Link>
              </div>
            )}
          </div>

          {/* Recent Resume Analyses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="text-primary" size={20} /> Recent Resume
                Scans
              </h2>
              <Link
                to="/resume-analyzer"
                className="text-sm font-medium text-primary hover:underline flex items-center"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center p-8 bg-base-200/30 rounded-2xl border border-base-200">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : recentResumes.length > 0 ? (
              <div className="space-y-3">
                {recentResumes.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => {
                      // Navigate to resume analyzer (since there's no dedicated single resume route, we can just send them there for now)
                      navigate("/resume-analyzer");
                    }}
                    className="bg-base-100 hover:bg-base-200/50 p-4 rounded-2xl border border-base-200 hover:border-primary/30 transition-all flex items-center justify-between group cursor-pointer shadow-sm"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="font-bold text-base">{item.jobRole}</h4>
                      <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                        {item.companyName && <span>{item.companyName} • </span>}
                        <span>
                          {new Date(item.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <CircularProgress
                        value={Math.round(item.scores.overallMatch)}
                        color={
                          item.scores.overallMatch >= 80
                            ? "text-success"
                            : item.scores.overallMatch >= 60
                              ? "text-warning"
                              : "text-error"
                        }
                        size="md"
                      />
                      <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-base-200/30 rounded-2xl border border-base-200 border-dashed">
                <p className="text-base-content/60">No recent resume scans.</p>
                <Link
                  to="/resume-analyzer"
                  className="btn btn-primary btn-sm mt-3"
                >
                  Scan Resume
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
