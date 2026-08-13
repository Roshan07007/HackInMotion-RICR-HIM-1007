import React, { useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { AlertCircle, ArrowRight, Wand2, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { Tabs } from "../common/Tabs";

const BulletAnalyzer = () => {
  const { analysisResult } = useResumeStore();
  const [activeTab, setActiveTab] = useState<
    "conservative" | "impactFocused" | "technical"
  >("impactFocused");

  if (!analysisResult || analysisResult.bulletAnalysis.length === 0)
    return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Wand2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Bullet Point AI Enhancer</h2>
          <p className="text-base-content/60 text-sm">
            We analyzed your experience bullets and generated stronger
            alternatives.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {analysisResult.bulletAnalysis.map((bullet, idx) => (
          <div
            key={idx}
            className="card bg-base-100 shadow border border-base-200 overflow-hidden"
          >
            {/* Top: Original Analysis */}
            <div className="p-6 bg-base-200/30 border-b border-base-200">
              <h4 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-2">
                Original Bullet
              </h4>
              <p className="text-lg font-medium text-base-content mb-4">
                "{bullet.original}"
              </p>

              <div className="flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex items-start gap-2 text-error bg-error/5 p-3 rounded-lg flex-1">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-semibold block">Problem:</span>
                    <span>{bullet.problem}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-warning bg-warning/5 p-3 rounded-lg flex-1">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <span className="font-semibold block">
                      Missing Elements:
                    </span>
                    <ul className="list-disc list-inside">
                      {bullet.missing.map((m, i) => (
                        <li key={i}>{m}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: AI Suggestions */}
            <div className="p-6 bg-base-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <SparklesIcon /> AI Suggestions
                </h4>

                <Tabs
                  tabs={[
                    {
                      label: "Conservative",
                      id: "conservative",
                    },
                    {
                      label: "Impact Focused",
                      id: "impactFocused",
                    },
                    {
                      label: "Technical",
                      id: "technical",
                    },
                  ]}
                  activeTab={activeTab}
                  onChange={(id: any) => setActiveTab(id)}
                />
              </div>

              <div className="relative group bg-primary/5 border border-primary/20 rounded-xl p-5 hover:border-primary/50 transition-colors">
                <p className="text-lg text-base-content pr-12">
                  {bullet.options[activeTab]}
                </p>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopy(bullet.options[activeTab])}
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 text-xs text-base-content/50 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Structure used:{" "}
                <span className="font-semibold">
                  {bullet.suggestedStructure}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SparklesIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export default BulletAnalyzer;
