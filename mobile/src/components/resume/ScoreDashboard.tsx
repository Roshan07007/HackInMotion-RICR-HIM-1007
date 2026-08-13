import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import CircularProgress from "@/components/ui/feedback/CircularProgress";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { ResumeAnalysisData } from "@/store/useResumeStore";
import { jobService } from "@/services/job.service";
import JobCard from "@/components/jobs/JobCard";
import { Job } from "@/types/job.type";

interface ScoreDashboardProps {
  analysisResult: ResumeAnalysisData;
}

export default function ScoreDashboard({ analysisResult }: ScoreDashboardProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([]);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);

  useEffect(() => {
    if (analysisResult?.jobRole) {
      const fetchJobs = async () => {
        try {
          setIsFetchingJobs(true);
          const res = await jobService.getJobs({ q: analysisResult.jobRole, limit: 3 });
          if (res.data?.jobs) {
            setSuggestedJobs(res.data.jobs);
          }
        } catch (error) {
          console.error("Failed to fetch suggested jobs:", error);
        } finally {
          setIsFetchingJobs(false);
        }
      };
      fetchJobs();
    }
  }, [analysisResult?.jobRole]);

  const { scores } = analysisResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const SubScore = ({ title, score, icon }: { title: string, score: number, icon: any }) => (
    <View className="bg-base-100 p-4 rounded-2xl flex-1 border border-base-300">
      <HStack align="center" spacing={8} className="mb-3">
        <View className="w-8 h-8 rounded-full items-center justify-center bg-primary/10">
          <MaterialIcons name={icon} size={16} color={colors.primary} />
        </View>
        <Txt variant="sm" className="font-bold flex-1" numberOfLines={1}>{title}</Txt>
      </HStack>
      <Txt variant="2xl" className="font-extrabold" style={{ color: getScoreColor(score) }}>{score}%</Txt>
      <View className="w-full h-1.5 bg-base-200 mt-2 rounded-full overflow-hidden">
        <View className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: getScoreColor(score) }} />
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
      {/* Main Score Hero */}
      <View className="bg-base-200 rounded-3xl p-6 mb-6 items-center border border-primary/20 shadow-sm relative overflow-hidden">
        <View className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full" style={{ transform: [{ translateX: 50 }, { translateY: -50 }] }} />
        <View className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full" style={{ transform: [{ translateX: -50 }, { translateY: 50 }] }} />
        
        <Txt variant="xl" className="font-bold mb-6 z-10">Overall ATS Match</Txt>
        <View className="mb-4 z-10">
          <CircularProgress 
            progress={scores.overallMatch} 
            size={160} 
            strokeWidth={16} 
            color={getScoreColor(scores.overallMatch)}
          />
        </View>
        <Txt variant="3xl" className="font-extrabold mt-2 mb-1 z-10" style={{ color: getScoreColor(scores.overallMatch) }}>
          {scores.overallMatch >= 80 ? "Excellent" : scores.overallMatch >= 60 ? "Good" : "Needs Work"}
        </Txt>
        <Txt variant="base" className="opacity-70 text-center mt-2 px-4 leading-snug z-10">
          Your resume scores in the top {100 - scores.overallMatch}% of applicants for the <Txt weight="bold">{analysisResult.jobRole}</Txt> role.
        </Txt>
      </View>

      {/* Sub Scores Grid */}
      <HStack spacing={12} className="mb-3">
        <SubScore title="Skills Match" score={scores.skillsMatch} icon="psychology" />
        <SubScore title="Experience" score={scores.experienceMatch} icon="work" />
      </HStack>
      <HStack spacing={12} className="mb-8">
        <SubScore title="Keywords" score={scores.keywordMatch} icon="manage-search" />
        <SubScore title="ATS Format" score={scores.atsReadiness} icon="fact-check" />
      </HStack>

      {/* Suggested Jobs */}
      {suggestedJobs.length > 0 && (
        <VStack>
          <HStack align="center" spacing={8} className="mb-4">
            <MaterialIcons name="work-outline" size={20} color={colors.primary} />
            <Txt variant="xl" className="font-bold">Recommended Jobs</Txt>
          </HStack>
          {suggestedJobs.map(job => (
            <View key={job._id} className="mb-4">
              <JobCard job={job} />
            </View>
          ))}
        </VStack>
      )}
    </ScrollView>
  );
}
