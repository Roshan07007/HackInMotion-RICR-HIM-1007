import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  FileText,
  BarChart3,
  Video,
} from "lucide-react";
import { setHeader } from "../utils/setHeader";
import { useUiStore } from "../store/useUiStore";
import Loading from "../components/common/Loading";
// Import your api setup, for now we will just use a placeholder
import { api } from "../config/api";
import toast from "react-hot-toast";

const InterviewReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { setBreadcrumbs } = useUiStore();

  useEffect(() => {
    setHeader("Interview Report", null);
    setBreadcrumbs([
      { label: "Mock Interviews", path: "/interview" },
      { label: "Report" },
    ]);

    // Fetch report data
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/video-interview/${id}`);
        setReportData(data.data);
      } catch (error) {
        console.error("Failed to fetch interview report", error);
        toast.error("Failed to load interview report");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
    return () => {
      setHeader();
      setBreadcrumbs(null);
    };
  }, [id, setBreadcrumbs]);

  if (loading) return <Loading />;
  if (!reportData)
    return <div className="p-8 text-center">Report not found.</div>;

  const { overallReport, transcript, jobRole, status, videoUrl } = reportData;

  // Placeholder data if AI hasn't evaluated yet
  if (status !== "evaluated" || !overallReport) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-xl font-bold mb-4">
          Interview Pending Evaluation
        </div>
        <p className="text-base-content/60 mb-6">
          The AI is currently processing your interview transcript.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case "Strong Hire":
        return "badge-success";
      case "Hire":
        return "badge-info";
      case "Weak Hire":
        return "badge-warning";
      case "Reject":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className=" mx-auto p-4 md:p-6 pb-20 animate-in fade-in zoom-in-95 duration-300">
      {/* <button 
        onClick={() => navigate(-1)} 
        className="btn btn-ghost btn-sm mb-6 flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Back
      </button> */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Scores & Summary */}

        {/* Right Column: Strengths/Weaknesses & Transcript */}
        <div className="lg:col-span-2 space-y-6 order-2 md:order-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-success/10 border border-success/20 rounded-3xl p-4 sm:p-6">
              <h3 className="font-bold text-success flex items-center gap-2 mb-4">
                <CheckCircle2 size={18} />
                Key Strengths
              </h3>
              <ul className="space-y-2">
                {overallReport.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-success mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-error/10 border border-error/20 rounded-3xl p-4 sm:p-6">
              <h3 className="font-bold text-error flex items-center gap-2 mb-4">
                <XCircle size={18} />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {overallReport.weaknesses.map((w: string, i: number) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <span className="text-error mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Video Recording */}
          {videoUrl && (
            <div className="bg-base-200/50 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-sm">
              <h3 className="font-bold flex items-center gap-2 mb-4">
                <Video size={18} className="text-primary" />
                Interview Recording
              </h3>
              <div className="rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                />
              </div>
            </div>
          )}

          {/* Transcript Log */}
          <div className="bg-base-200/50 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-6">
              <BarChart3 size={18} className="text-primary" />
              Detailed Q&A Transcript
            </h3>

            <div className="space-y-6">
              {transcript.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl ${item.role === "assistant" ? "bg-base-300" : "bg-primary/10 border border-primary/20"}`}
                >
                  <div className="text-xs font-bold mb-2 uppercase opacity-60">
                    {item.role === "assistant" ? "Interviewer" : "Candidate"}
                  </div>
                  <p className="text-sm">{item.content}</p>

                  {item.aiFeedback && (
                    <div className="mt-4 pt-3 border-t border-base-content/10">
                      <div className="text-xs font-semibold text-primary mb-1">
                        AI Feedback:
                      </div>
                      <p className="text-xs text-base-content/70">
                        {item.aiFeedback}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6 order-1 md:order-2">
          <div className="bg-base-200/50 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-1">{jobRole} Interview</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm font-medium text-base-content/60">
                Final Recommendation:
              </span>
              <span
                className={`badge badge-lg ${getRatingBadge(overallReport.hireabilityRating)}`}
              >
                {overallReport.hireabilityRating}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Technical Score</span>
                  <span className="font-bold">
                    {overallReport.technicalScore}/100
                  </span>
                </div>
                <progress
                  className="progress progress-primary w-full"
                  value={overallReport.technicalScore}
                  max="100"
                ></progress>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Communication</span>
                  <span className="font-bold">
                    {overallReport.communicationScore}/100
                  </span>
                </div>
                <progress
                  className="progress progress-info w-full"
                  value={overallReport.communicationScore}
                  max="100"
                ></progress>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Confidence</span>
                  <span className="font-bold">
                    {overallReport.confidenceScore}/100
                  </span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={overallReport.confidenceScore}
                  max="100"
                ></progress>
              </div>
            </div>
          </div>

          <div className="bg-base-200/50 border border-base-300 rounded-3xl p-4 sm:p-6 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <FileText size={18} className="text-primary" />
              Executive Summary
            </h3>
            <p className="text-sm leading-relaxed text-base-content/80">
              {overallReport.executiveSummary}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewReport;
