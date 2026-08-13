import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import LottieIcon from "../common/LottieIcon";
import ScanAnimation from "../../assets/animations/scan.json";

const LOADING_STEPS = [
  "Extracting text from document...",
  "Identifying key skills & experiences...",
  "Comparing against job requirements...",
  "Running ATS compatibility checks...",
  "Generating actionable insights...",
  "Finalizing report...",
];

export const LoadingProgress = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // We want to progress through the steps over the typical wait time (e.g., 20-30s)
    // Step 0 -> 1: fast (2s)
    // Step 1 -> 2: medium (3s)
    // Step 2 -> 3: long (6s)
    // Step 3 -> 4: long (6s)
    // Step 4 -> 5: medium (4s)
    
    const timings = [2000, 3000, 6000, 6000, 4000, 10000];
    
    if (currentStep < LOADING_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, timings[currentStep] || 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] items-center justify-center fade-in bg-base-200/20 p-4">
      <LottieIcon animation={ScanAnimation} className="w-48 h-48 mb-4" />
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
        Analyzing Resume
      </h2>

      <div className="w-full max-w-sm bg-base-100 p-6 rounded-2xl shadow border border-base-200 space-y-4">
        {LOADING_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isCompleted
                  ? "text-success"
                  : isCurrent
                  ? "text-primary font-medium"
                  : "text-base-content/30"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-base-content/20 shrink-0" />
              )}
              <span className={`text-sm ${isCurrent ? "animate-pulse" : ""}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
