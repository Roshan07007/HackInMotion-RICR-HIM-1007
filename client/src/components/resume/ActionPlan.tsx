import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import {
  ListTodo,
  AlertTriangle,
  Lightbulb,
  PlayCircle,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActionPlan = () => {
  const { analysisResult } = useResumeStore();
  const navigate = useNavigate();

  if (!analysisResult) return null;

  const { recommendations, summarySuggestions, interviewPrep } = analysisResult;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "High":
        return "badge-error";
      case "Medium":
        return "badge-warning";
      case "Low":
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "High":
        return <AlertTriangle className="w-4 h-4" />;
      case "Medium":
        return <Lightbulb className="w-4 h-4" />;
      case "Low":
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Recommendations List */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Action Plan</h2>
              <p className="text-base-content/60 text-sm">
                Prioritized steps to improve your resume before applying.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="bg-base-200/30 border border-base-200 rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">
                    {idx + 1}. {rec.action}
                  </h3>
                  <div
                    className={`badge ${getImpactColor(rec.impact)} gap-1 font-semibold py-3`}
                  >
                    {getImpactIcon(rec.impact)}
                    {rec.impact} Impact
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-base-100 p-4 rounded-lg border border-base-200">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block mb-1">
                      Why
                    </span>
                    <p className="text-sm text-base-content/80">{rec.why}</p>
                  </div>
                  <div className="bg-base-100 p-4 rounded-lg border border-base-200">
                    <span className="text-xs font-bold text-base-content/50 uppercase tracking-wider block mb-1">
                      How
                    </span>
                    <p className="text-sm text-base-content/80">{rec.how}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Professional Summary Enhancer */}
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-2">
            Professional Summary Generator
          </h2>
          <p className="text-base-content/60 mb-6">
            We rewrote your summary to better target the{" "}
            {analysisResult.jobRole} role.
          </p>

          <div className="bg-base-200/50 p-4 rounded-xl border border-base-300 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block mb-1">
              AI Analysis
            </span>
            <p className="text-sm font-medium">{summarySuggestions.analysis}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="border border-base-300 rounded-xl overflow-hidden">
              <div className="bg-base-200 px-4 py-2 border-b border-base-300 font-semibold text-sm">
                Conservative Version
              </div>
              <div className="p-4 text-base-content/80 text-sm leading-relaxed">
                {summarySuggestions.conservative}
              </div>
            </div>

            <div className="border border-primary/30 rounded-xl overflow-hidden bg-primary/5">
              <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 font-semibold text-sm text-primary flex items-center justify-between">
                <span>Strong Version</span>
                <span className="badge badge-primary badge-sm">
                  Recommended
                </span>
              </div>
              <div className="p-4 text-base-content/80 text-sm leading-relaxed">
                {summarySuggestions.strong}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interview Readiness */}
      <div className="card bg-gradient-to-br from-secondary/10 to-primary/10 shadow border border-primary/20">
        <div className="card-body flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <h2 className="text-2xl font-bold text-primary">
              Ready for the Interview?
            </h2>
            <p className="text-base-content/80">
              Based on your resume gaps and the job requirements, you should
              prepare for questions about:
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {interviewPrep.likelyTopics.map((topic, idx) => (
                <span
                  key={idx}
                  className="badge badge-outline border-primary/40 text-primary"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-center gap-3">
            <button
              onClick={() =>
                navigate("/interview", {
                  state: {
                    jobRole: analysisResult.jobRole,
                    companyName: analysisResult.companyName,
                    jobDescription: analysisResult.jobDescription,
                    resumeText: analysisResult.resumeText,
                  },
                })
              }
              className="btn btn-primary btn-lg rounded-full shadow hover:-translate-y-1 transition-transform"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Start Mock Interview
            </button>
            <p className="text-xs text-base-content/50">
              Jump straight into AI practice
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;
