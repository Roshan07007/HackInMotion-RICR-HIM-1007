import React from "react";
import { X, FileText } from "lucide-react";
import { useResumeStore } from "../../store/useResumeStore";

interface DocViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocViewerModal = ({ isOpen, onClose }: DocViewerModalProps) => {
  const { analysisResult } = useResumeStore();

  if (!isOpen || !analysisResult) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-base-300/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-base-100 rounded-2xl shadow w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-base-200 bg-base-200/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-lg">Document Viewer</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-base-200/30 p-4">
          {analysisResult.documentUrl ? (
            <iframe
              src={analysisResult.documentUrl}
              className="w-full h-full rounded-lg border border-base-300 bg-base-100"
              title="Resume Document"
            />
          ) : (
            <div className="bg-base-100 p-6 rounded-lg border border-base-300 whitespace-pre-wrap font-mono text-sm shadow-inner h-full overflow-y-auto">
              {analysisResult.resumeText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
