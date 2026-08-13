import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setHeader } from "../utils/setHeader";
import { api } from "../config/api";
import toast from "react-hot-toast";
import { Briefcase, Building, FileText, Bot, Trash2, Clock, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { formatDate } from "../utils/formatDate";
import Loading from "../components/common/Loading";
import { Tabs } from "../components/common/Tabs";

const InterviewSetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<"new" | "history">("new");
  
  // Setup Form State
  const [jobRole, setJobRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const tabs = [
      { id: "new", label: "New Interview" },
      { id: "history", label: "History" }
    ];
    
    setHeader(
      "Mock Interviews", 
      <Tabs tabs={tabs} variant="box" activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />
    );

    return () => setHeader();
  }, [activeTab]);

  useEffect(() => {
    // Auto-fill from navigation state or preferences
    const state = location.state as any;

    if (state?.jobRole) {
      setJobRole(state.jobRole);
    } else if (user?.preferences?.desiredJobs?.length) {
      setJobRole(user.preferences.desiredJobs[0]);
    }
    
    if (state?.companyName) {
      setCompanyName(state.companyName);
    } else if (user?.preferences?.desiredCompanies?.length) {
      setCompanyName(user.preferences.desiredCompanies[0]);
    }

    if (state?.jobDescription) {
      setJobDescription(state.jobDescription);
    }
    
    if (state?.resumeText) {
      setResumeText(state.resumeText);
    }
  }, [user, location.state]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get("/video-interview/history");
      setHistory(data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load interview history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleStartInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobRole.trim()) {
      toast.error("Job Role is required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jobRole,
        companyName,
        jobDescription,
        resumeText,
        numberOfQuestions,
        type: "self"
      };

      const { data } = await api.post("/video-interview/init", payload);
      const interviewId = data.data._id;
      
      toast.success("Interview initialized successfully!");
      navigate(`/interview/${interviewId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to initialize interview");
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent navigating to report
    if (!window.confirm("Are you sure you want to delete this interview record?")) return;
    
    try {
      await api.delete(`/video-interview/${id}`);
      toast.success("Deleted successfully");
      setHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      toast.error("Failed to delete interview");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL interview history? This cannot be undone.")) return;
    
    try {
      await api.delete("/video-interview/history");
      toast.success("All history cleared");
      setHistory([]);
    } catch (error) {
      toast.error("Failed to delete all history");
    }
  };

  return (
    <div className=" mx-auto px-2 md:px-4 py-4 animate-in fade-in zoom-in-95 duration-300">

      {activeTab === "new" ? (
        <div className="bg-base-200/50 border border-base-300 rounded-xl p-4 md:p-6 shadow">
          <div className="flex items-center gap-4 mb-4 pb-4 border-b border-base-300">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary shrink-0">
              <Bot size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Customize Your Interview</h1>
              <p className="text-base-content/60 text-sm mt-1">
                Configure the AI parameters for a tailored mock interview experience.
              </p>
            </div>
          </div>

          <form onSubmit={handleStartInterview} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Briefcase size={16} className="text-primary" /> Target Job Role <span className="text-error">*</span>
                  </span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Frontend Developer" 
                  className="input input-bordered w-full rounded-xl bg-base-100" 
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Building size={16} className="text-primary" /> Company Name
                  </span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Google, Stripe" 
                  className="input input-bordered w-full rounded-xl bg-base-100" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            <div className="">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> Number of Questions
                  </span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  max="20"
                  className="input input-bordered w-full rounded-xl bg-base-100" 
                  value={numberOfQuestions}
                  onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                  required
                />
              </div>
            </div>
            </div>


            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Job Description (Optional)
                </span>
               
              </label>
              <textarea 
                className="textarea textarea-bordered h-24 rounded-xl bg-base-100" 
                placeholder="Paste the target job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>
            </div>
            
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold flex items-center gap-2">
                  <FileText size={16} className="text-primary" /> Resume / Background Context (Optional)
                </span>
                
              </label>
              <textarea 
                className="textarea textarea-bordered h-24 rounded-xl bg-base-100" 
                placeholder="Paste your resume text or specific projects you want to be asked about..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              ></textarea>
            </div>

            <div className="pt-4 border-t border-base-300 flex justify-end">
              <button 
                type="submit" 
                className="btn btn-primary rounded-full px-8 shadow-lg shadow-primary/20"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Launch Interview Room"
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-base-200/50 border border-base-300 rounded-xl p-4 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-base-300">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Past Interviews
            </h2>
            {history.length > 0 && (
              <button 
                onClick={handleDeleteAll}
                className="btn btn-sm btn-outline btn-error rounded-full text-xs"
              >
                Delete All
              </button>
            )}
          </div>

          {loadingHistory ? (
            <div className="flex justify-center p-8"><span className="loading loading-spinner"></span></div>
          ) : history.length === 0 ? (
            <div className="text-center p-12 text-base-content/50">
              No interview history found.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => navigate(`/interview/${item._id}/report`)}
                  className="bg-base-100 hover:bg-base-200 border border-base-300 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.jobRole} Interview</h3>
                    <p className="text-sm text-base-content/60 mt-1">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 w-full md:w-auto mt-2 md:mt-0 pt-2 md:pt-0 border-t border-base-200 md:border-t-0">
                    {item.status === "evaluated" ? (
                      <div className="flex flex-col items-start md:items-end">
                        <span className="text-xs text-base-content/50 mb-1">Recommendation</span>
                        <span className={`badge ${item.overallReport?.hireabilityRating?.includes("Strong") ? 'badge-success' : item.overallReport?.hireabilityRating?.includes("Reject") ? 'badge-error' : 'badge-info'}`}>
                          {item.overallReport?.hireabilityRating || "Evaluated"}
                        </span>
                      </div>
                    ) : (
                      <span className="badge badge-warning gap-1">
                        <Clock size={12} /> In Progress
                      </span>
                    )}
                    
                    <button 
                      onClick={(e) => handleDelete(e, item._id)}
                      className="btn btn-error btn-soft btn-circle"
                      title="Delete Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewSetup;
