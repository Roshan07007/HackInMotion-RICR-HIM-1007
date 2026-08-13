import React, { useEffect, useState } from "react";
import { setHeader } from "../utils/setHeader";
import UploadSection from "../components/resume/UploadSection";
import ScoreDashboard from "../components/resume/ScoreDashboard";
import JobMatchComparison from "../components/resume/JobMatchComparison";
import BulletAnalyzer from "../components/resume/BulletAnalyzer";
import AtsReadiness from "../components/resume/AtsReadiness";
import ActionPlan from "../components/resume/ActionPlan";
import { useResumeStore } from "../store/useResumeStore";
import {
  ChevronLeft,
  LayoutDashboard,
  Target,
  Wand2,
  FileType,
  ListTodo,
  History,
} from "lucide-react";
import LottieIcon from "../components/common/LottieIcon";
import ScanAnimation from "../assets/animations/scan.json";
import { Tabs } from "../components/common/Tabs";
import { useUiStore } from "../store/useUiStore";
import { ResumeHistoryModal } from "../components/resume/ResumeHistoryModal";

import { LoadingProgress } from "../components/resume/LoadingProgress";

const ResumeAnalyzer = () => {
  const { analysisResult, isAnalyzing, reset } = useResumeStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const tabs = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "skills", label: "Skills Match", icon: <Target size={18} /> },
    { id: "bullets", label: "Bullet AI", icon: <Wand2 size={18} /> },
    { id: "ats", label: "ATS Readiness", icon: <FileType size={18} /> },
    { id: "action", label: "Action Plan", icon: <ListTodo size={18} /> },
  ];

  const { setBreadcrumbs } = useUiStore();

  useEffect(() => {
    if (analysisResult) {
      setBreadcrumbs([
        {
          label: (
            <span className="flex items-center gap-1">
              <ChevronLeft size={16} />
              Resume Analyzer
            </span>
          ),
          onClick: reset,
        },
        {
          label: "Analysis Report",
        },
      ]);
      setHeader(
        "Analysis Report",
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="box"
          dropdown={true}
        />
      );
    } else {
      setBreadcrumbs(null);
      setHeader(
        "Resume Analyzer",
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="btn btn-sm btn-primary btn-soft gap-2 "
        >
          <History className="w-4 h-4" />
          History
        </button>
      );
    }
  }, [
    analysisResult,
    activeTab,
    setBreadcrumbs,
  ]);

  // Clean up store on unmount
  useEffect(() => {
    return () => {
      reset();
      setBreadcrumbs(null);
      setHeader("Dashboard", null);
    };
  }, [reset, setBreadcrumbs]);

  if (isAnalyzing) {
    return (
      <>
        <LoadingProgress />
        <ResumeHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      </>
    );
  }

  if (!analysisResult) {
    return (
      <>
        <div className="h-[calc(100vh-70px)] overflow-y-auto bg-base-200/20">
          <UploadSection />
        </div>
        <ResumeHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="h-[calc(100vh-70px)] flex flex-col bg-base-200/20 fade-in">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === "overview" && <ScoreDashboard />}
          {activeTab === "skills" && <JobMatchComparison />}
          {activeTab === "bullets" && <BulletAnalyzer />}
          {activeTab === "ats" && <AtsReadiness />}
          {activeTab === "action" && <ActionPlan />}
        </div>
      </div>

      <ResumeHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default ResumeAnalyzer;
