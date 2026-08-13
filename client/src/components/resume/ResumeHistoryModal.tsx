import React, { useEffect, useState } from "react";
import { History, X, ChevronRight, FileText, Trash2 } from "lucide-react";
import { aiService } from "../../services/aiService";
import { useResumeStore } from "../../store/useResumeStore";
import toast from "react-hot-toast";
import { CircularProgress } from "../common/CircularProgress";

interface HistoryItem {
  _id: string;
  jobRole: string;
  companyName?: string;
  createdAt: string;
  scores: {
    overallMatch: number;
  };
}

interface ResumeHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeHistoryModal = ({
  isOpen,
  onClose,
}: ResumeHistoryModalProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [isClearing, setIsClearing] = useState(false);

  const { setAnalysisResult } = useResumeStore();

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await aiService.getResumeHistory();
      setHistory(res.data.data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
      toast.error("Failed to load history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = async (id: string) => {
    try {
      setLoadingId(id);
      const res = await aiService.getResumeAnalysisById(id);
      setAnalysisResult(res.data.data);
      onClose();
      toast.success("Loaded historical analysis");
    } catch (error) {
      console.error("Failed to load analysis:", error);
      toast.error("Failed to load analysis details");
    } finally {
      setLoadingId(null);
    }
  };

  const handleClearHistory = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all history? This will also remove the uploaded resumes. This action cannot be undone.",
      )
    )
      return;

    try {
      setIsClearing(true);
      await aiService.clearResumeHistory();
      setHistory([]);
      toast.success("All history cleared successfully");
    } catch (error) {
      console.error("Failed to clear history:", error);
      toast.error("Failed to clear history");
    } finally {
      setIsClearing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-base-300/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-base-100 rounded-2xl shadow w-full max-w-4xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-base-200 shrink-0">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Analysis History</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center p-8 text-base-content/50 flex flex-col items-center">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>No past analyses found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelect(item._id)}
                  disabled={loadingId !== null}
                  className="w-full text-left bg-base-200/50 hover:bg-base-200 p-4 rounded-xl border border-base-300 hover:border-primary/30 transition-all flex items-center justify-between group"
                >
                  <div className="flex-1 pr-4">
                    <h4 className="font-semibold truncate">{item.jobRole}</h4>
                    <div className="flex items-center gap-2 text-sm text-base-content/60 mt-1">
                      {item.companyName && (
                        <>
                          <span className="truncate max-w-[120px]">
                            {item.companyName}
                          </span>
                          <span>•</span>
                        </>
                      )}
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

                    {loadingId === item._id ? (
                      <span className="loading loading-spinner loading-sm text-primary"></span>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-base-content/30 group-hover:text-primary transition-colors" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-base-200 bg-base-100 flex justify-end shrink-0">
          <button
            className="btn btn-error btn-sm btn-outline gap-2"
            onClick={handleClearHistory}
            disabled={history.length === 0 || isClearing || isLoading}
          >
            {isClearing ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {isClearing ? "Clearing..." : "Delete All History"}
          </button>
        </div>
      </div>
    </div>
  );
};
