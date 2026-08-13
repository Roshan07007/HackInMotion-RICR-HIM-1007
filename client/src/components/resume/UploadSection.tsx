import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle,
  Briefcase,
  Building2,
  MapPin,
  Search,
  History,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { aiService } from "../../services/aiService";
import { useResumeStore } from "../../store/useResumeStore";
import toast from "react-hot-toast";
import { ResumeHistoryModal } from "./ResumeHistoryModal";

const UploadSection = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const locationObj = useLocation();
  const state = locationObj.state as any;

  // Job context
  const [jobRole, setJobRole] = useState(state?.targetJobTitle || "");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setIsAnalyzing, setAnalysisResult } = useResumeStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile: File) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!validTypes.includes(selectedFile.type)) {
      toast.error("Please upload a PDF or DOCX file");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload your resume");
      return;
    }
    if (!jobRole.trim()) {
      toast.error("Target Job Role is required");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobRole", jobRole);
    if (companyName) formData.append("companyName", companyName);
    if (location) formData.append("location", location);
    if (jobDescription) formData.append("jobDescription", jobDescription);

    setIsAnalyzing(true);
    setAnalysisResult(null); // Clear previous results

    try {
      toast.loading("Analyzing your resume deeply...", { id: "analyze" });
      const response = await aiService.deepAnalyzeResume(formData);
      if (response.data?.success) {
        setAnalysisResult(response.data.data);
        toast.success("Analysis complete!", { id: "analyze" });
      } else {
        toast.error("Analysis failed", { id: "analyze" });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to analyze resume", {
        id: "analyze",
      });
    } finally {
      setIsAnalyzing(false); // Reset loading state
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: File Upload */}
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">1. Upload Resume</h2>

            <div
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer m-auto w-full h-full ${
                isDragging
                  ? "border-primary bg-primary/5 scale-[1.02]"
                  : file
                    ? "border-success bg-success/5"
                    : "border-base-300 hover:border-primary/50 hover:bg-base-200/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  e.target.files && handleFileChange(e.target.files[0])
                }
              />

              {file ? (
                <div className="flex flex-col items-center space-y-4 animate-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{file.name}</p>
                    <p className="text-sm text-base-content/60">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    className="btn btn-sm btn-ghost text-error mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <UploadCloud className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Click or drag & drop
                    </p>
                    <p className="text-sm text-base-content/60 mt-1">
                      PDF or DOCX (Max 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Job Context */}
        <div className="card bg-base-100 shadow border border-base-200">
          <div className="card-body">
            <h2 className="card-title text-xl mb-4">2. Target Role Setup</h2>

            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Job Title (Required)
                  </span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Developer"
                    className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      Company (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="text"
                      placeholder="e.g. Google"
                      className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">
                      Location (Optional)
                    </span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                    <input
                      type="text"
                      placeholder="e.g. Remote, NY"
                      className="input input-bordered w-full pl-10 bg-base-200/50 focus:bg-base-100 transition-colors"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    Job Description (Highly Recommended)
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-32 bg-base-200/50 focus:bg-base-100 transition-colors resize-none"
                  placeholder="Paste the full job description here for maximum analysis accuracy..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <button
          className="btn btn-primary btn-lg px-12 rounded-full shadow-lg shadow-primary/30 hover:-translate-y-1 transition-transform"
          onClick={handleAnalyze}
          disabled={!file || !jobRole.trim()}
        >
          <Search className="w-5 h-5 mr-2" />
          Run Deep Analysis
        </button>
      </div>
    </div>
  );
};

export default UploadSection;
