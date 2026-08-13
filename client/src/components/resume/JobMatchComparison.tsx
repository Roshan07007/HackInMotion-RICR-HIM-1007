import React from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { Check, X, AlertTriangle } from "lucide-react";

const JobMatchComparison = () => {
  const { analysisResult } = useResumeStore();

  if (!analysisResult) return null;

  const { skillMatch } = analysisResult;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="card bg-base-100 shadow border border-base-200">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="card-title text-2xl">Skills Analysis</h2>
            <div className="badge badge-primary badge-lg">
              {skillMatch.keywordCoveragePercentage}% Coverage
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Strong Matches */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-success">
                <Check className="w-5 h-5" />
                Strong Matches
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillMatch.strongMatches.map((skill, idx) => (
                  <div
                    key={idx}
                    className="badge badge-success badge-outline gap-1 py-3 px-4 font-medium"
                  >
                    <Check className="w-3 h-3" />
                    {skill}
                  </div>
                ))}
                {skillMatch.strongMatches.length === 0 && (
                  <p className="text-sm text-base-content/50 italic">
                    No strong matches found.
                  </p>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-error">
                <X className="w-5 h-5" />
                Missing Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillMatch.missingSkills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="badge badge-error badge-outline gap-1 py-3 px-4 font-medium"
                  >
                    <X className="w-3 h-3" />
                    {skill}
                  </div>
                ))}
                {skillMatch.missingSkills.length === 0 && (
                  <p className="text-sm text-base-content/50 italic">
                    You have all the required skills!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Weak Evidence */}
          {skillMatch.weakEvidence.length > 0 && (
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Skills Needing Better Evidence
              </h3>
              <div className="space-y-3">
                {skillMatch.weakEvidence.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-warning/10 border border-warning/30 rounded-lg p-4"
                  >
                    <span className="font-bold text-warning-content bg-warning px-2 py-1 rounded text-sm mr-2">
                      {item.skill}
                    </span>
                    <span className="text-sm text-base-content/80">
                      {item.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobMatchComparison;
