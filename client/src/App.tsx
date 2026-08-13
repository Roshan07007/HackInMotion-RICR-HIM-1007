import React, { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Personalize from "./pages/Personalize";
import AiMentor from "./pages/AiMentor";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import SavedJobs from "./pages/SavedJobs";
import InterviewSetup from "./pages/InterviewSetup";
import VideoInterviewRoom from "./pages/VideoInterviewRoom";
import InterviewReport from "./pages/InterviewReport";
import Scroll from "./components/common/Scroll";
import Loading from "./components/common/Loading";
import useLenis from "./hooks/useLenis";
import { useAuthStore } from "./store/useAuthStore";
import NotFound from "./components/common/NotFound";
import Unauthorized from "./components/common/Unauthorized";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import SidebarLayout from "./components/layout/SidebarLayout";
import Landing from "./pages/Landing";

const App = () => {
  const { getMe, isCheckingAuth } = useAuthStore();

  // Initialize Lenis smooth scroll
  // useLenis();

  useEffect(() => {
    getMe();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-base-100">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Toaster position="top-right" />
      <Scroll />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Auth Page Routes */}
        <Route
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/personalize" element={<Personalize />} />
          <Route path="/mentor" element={<AiMentor />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/saved" element={<SavedJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/interview" element={<InterviewSetup />} />
          <Route path="/interview/:id/report" element={<InterviewReport />} />
        </Route>

        {/* Fullscreen Video Interview Route */}
        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/interview/:id" element={<VideoInterviewRoom />} />
        </Route>

        {/* 404 Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
