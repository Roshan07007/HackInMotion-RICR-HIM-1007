import React from "react";
import Hero from "../components/landing/Hero";
import ProblemSection from "../components/landing/ProblemSection";
import HowItWorks from "../components/landing/HowItWorks";
import ResumeAnalysis from "../components/landing/ResumeAnalysis";
import MockInterview from "../components/landing/MockInterview";
import ProgressSection from "../components/landing/ProgressSection";
import FeatureGrid from "../components/landing/FeatureGrid";
import PhilosophySection from "../components/landing/PhilosophySection";
import FinalCTA from "../components/landing/FinalCTA";

const Landing = () => {
  return (
    <>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <ResumeAnalysis />
      <MockInterview />
      <ProgressSection />
      <FeatureGrid />
      <PhilosophySection />
      <FinalCTA />
    </>
  );
};

export default Landing;
