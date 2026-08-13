import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { CheckCircle2, XCircle, FileType, LayoutList } from "lucide-react";

const AtsReadiness = () => {
  const { analysisResult } = useResumeStore();

  if (!analysisResult) return null;

  const { atsSimulation } = analysisResult;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <FileType className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                ATS Compatibility Simulation
              </h2>
              <p className="text-base-content/60 text-sm">
                How well applicant tracking systems can read your resume.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Passed Checks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                Passed Checks
              </h3>
              <ul className="space-y-3">
                {atsSimulation.passedChecks.map((check, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-success/5 p-3 rounded-lg border border-success/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-base-content/90 text-sm leading-relaxed">
                      {check}
                    </span>
                  </li>
                ))}
                {atsSimulation.passedChecks.length === 0 && (
                  <p className="text-sm text-base-content/50 italic">
                    No passed checks found.
                  </p>
                )}
              </ul>
            </div>

            {/* Failed Checks */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-error">
                <XCircle className="w-5 h-5" />
                Failed Checks & Warnings
              </h3>
              <ul className="space-y-3">
                {atsSimulation.failedChecks.map((check, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 bg-error/5 p-3 rounded-lg border border-error/20"
                  >
                    <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                    <span className="text-base-content/90 text-sm leading-relaxed">
                      {check}
                    </span>
                  </li>
                ))}
                {atsSimulation.failedChecks.length === 0 && (
                  <div className="flex items-center gap-2 bg-success/10 text-success p-4 rounded-xl font-medium">
                    <CheckCircle2 className="w-5 h-5" />
                    Your resume is perfectly ATS compliant!
                  </div>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-base-200/50 p-4 rounded-xl border border-base-300 flex items-start gap-3">
            <LayoutList className="w-5 h-5 text-base-content/50 shrink-0 mt-0.5" />
            <p className="text-sm text-base-content/70">
              <strong className="text-base-content">Note:</strong> This is a
              simulation based on common ATS parsing rules (like Workday,
              Greenhouse, Lever). We cannot guarantee exact behavior across all
              proprietary systems, but fixing these warnings will dramatically
              improve your parse rate everywhere.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsReadiness;
