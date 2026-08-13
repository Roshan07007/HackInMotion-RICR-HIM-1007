import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import RenderHtml from "react-native-render-html";
import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import { toast } from "@/utils/toast";

import { HStack, VStack } from "@/components/ui/layout/Stack";
import IconButton from "@/components/ui/buttons/IconButton";
import Button from "@/components/ui/buttons/Button";
import Badge from "@/components/ui/data-display/Badge";
import Spinner from "@/components/ui/feedback/Spinner";
import CircularProgress from "@/components/ui/feedback/CircularProgress";
import JobDetailSkeleton from "@/components/skeletons/JobDetailSkeleton";

import { useJobStore } from "@/store/useJobStore";
import { jobService } from "@/services/job.service";
import ScreenHeader from "@/components/common/ScreenHeader";
import ScrollContainer from "@/components/ui/layout/ScrollContainer";

export default function JobDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const {
    toggleSaveJob,
    fetchSavedJobs,
    savedJobs,
    appliedJobs,
    applyToJob,
    fetchAppliedJobs,
  } = useJobStore();

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [matchScore, setMatchScore] = useState<any>(null);
  const [isScoring, setIsScoring] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setIsLoading(true);
      const res = await jobService.getJobById(id as string);
      setJob(res.data);
    } catch (error) {
      toast.error("Error", "Failed to fetch job details");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleMatchResume = async () => {
    try {
      setIsScoring(true);
      const res = await jobService.calculateMatchScore(id as string);
      setMatchScore(res.data);
    } catch (error: any) {
      toast.error(
        "Error",
        error.response?.data?.error || "Failed to calculate match score",
      );
    } finally {
      setIsScoring(false);
    }
  };

  const handleApply = async () => {
    try {
      await applyToJob(id as string);
      // store handles toast
    } catch (error) {
      // handled in store
    }
  };

  const isSaved = savedJobs.some((s) => s.jobId?._id === id || s.jobId === id);
  const isApplied = appliedJobs.some(
    (s) => s.jobId?._id === id || s.jobId === id,
  );

  if (isLoading || !job) {
    return <JobDetailSkeleton />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Header */}
      <ScreenHeader
        title={job.companyName}
        actions={
          <IconButton
            icon="bookmark"
            size="sm"
            variant={isSaved ? "warning" : "outline"}
            onPress={() => toggleSaveJob(id as string, isSaved)}
          />
        }
      />

      <ScrollContainer
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Job Header Info */}
        <VStack className="mb-6">
          <Txt variant="3xl" className="font-extrabold mb-2">
            {job.title}
          </Txt>
          <HStack align="center" className="mb-4">
            <MaterialIcons name="business" size={18} color={colors.primary} />
            <Txt variant="base" className="ml-2 font-semibold text-primary">
              {job.companyName}
            </Txt>
            {job.source && job.source !== "Internal" && (
              <View className="ml-3 bg-base-200 px-2 py-1 rounded-md">
                <Txt variant="caption" className="opacity-70">
                  {job.source}
                </Txt>
              </View>
            )}
          </HStack>

          <HStack spacing={16} className="flex-wrap" style={{ rowGap: 12 }}>
            <HStack align="center" spacing={4}>
              <MaterialIcons
                name="location-on"
                size={18}
                color={colors.baseContent}
                style={{ opacity: 0.6 }}
              />
              <Txt variant="base" className="opacity-80">
                {job.location}
              </Txt>
            </HStack>
            <HStack align="center" spacing={4}>
              <MaterialIcons
                name="work"
                size={18}
                color={colors.baseContent}
                style={{ opacity: 0.6 }}
              />
              <Txt variant="base" className="opacity-80">
                {job.employmentType}
              </Txt>
            </HStack>
            <HStack align="center" spacing={4}>
              <MaterialIcons
                name="schedule"
                size={18}
                color={colors.baseContent}
                style={{ opacity: 0.6 }}
              />
              <Txt variant="base" className="opacity-80">
                {job.experienceLevel}
              </Txt>
            </HStack>
            {job.salaryRange && (
              <HStack align="center" spacing={4}>
                <MaterialIcons
                  name="payments"
                  size={18}
                  color={colors.baseContent}
                  style={{ opacity: 0.6 }}
                />
                <Txt variant="base" className="opacity-80">
                  {job.salaryRange}
                </Txt>
              </HStack>
            )}
          </HStack>
        </VStack>

        {/* AI Match Score Section */}
        <View className="bg-primary/5 border border-primary/20 rounded-2xl p-5 mb-8">
          <HStack align="center" justify="space-between" className="mb-3">
            <HStack align="center" spacing={8}>
              <MaterialIcons
                name="auto-awesome"
                size={24}
                color={colors.primary}
              />
              <Txt variant="xl" className="font-bold text-primary">
                AI Resume Match
              </Txt>
            </HStack>
            {!matchScore && !isScoring && (
              <Button
                label="Calculate"
                variant="primary"
                size="sm"
                onPress={handleMatchResume}
              />
            )}
          </HStack>

          {isScoring ? (
            <HStack align="center" justify="center" className="py-4">
              <Spinner size="sm" />
              <Txt variant="base" className="ml-3 font-medium opacity-70">
                Analyzing resume...
              </Txt>
            </HStack>
          ) : matchScore ? (
            <VStack>
              <HStack align="center" spacing={16} className="mb-4">
                <CircularProgress
                  progress={matchScore.overallScore}
                  size={80}
                  strokeWidth={8}
                  color={
                    matchScore.overallScore >= 80
                      ? colors.success
                      : matchScore.overallScore >= 60
                        ? colors.warning
                        : colors.error
                  }
                />
                <VStack style={{ flex: 1 }}>
                  <Txt variant="base" className="font-semibold mb-1">
                    {matchScore.overallScore >= 80
                      ? "Great Match!"
                      : matchScore.overallScore >= 60
                        ? "Good Match"
                        : "Needs Improvement"}
                  </Txt>
                  <Txt variant="caption" className="opacity-70 leading-snug">
                    {matchScore.overallScore >= 80
                      ? "Your profile strongly aligns with this role."
                      : "There are some gaps in your profile for this role."}
                  </Txt>
                </VStack>
              </HStack>

              {/* Score Breakdown */}
              <View className="bg-base-100 rounded-xl p-4 mb-4 border border-base-300/30">
                <Txt
                  variant="sm"
                  className="font-bold mb-3 text-base-content/80"
                >
                  Score Breakdown
                </Txt>
                <HStack justify="space-between">
                  <VStack align="center">
                    <Txt variant="caption" className="opacity-70 mb-1">
                      Skills
                    </Txt>
                    <Txt
                      variant="base"
                      className="font-bold"
                      style={{
                        color:
                          matchScore.breakdown?.skills >= 80
                            ? colors.success
                            : matchScore.breakdown?.skills >= 60
                              ? colors.warning
                              : colors.error,
                      }}
                    >
                      {matchScore.breakdown?.skills ?? 0}%
                    </Txt>
                  </VStack>
                  <VStack align="center">
                    <Txt variant="caption" className="opacity-70 mb-1">
                      Experience
                    </Txt>
                    <Txt
                      variant="base"
                      className="font-bold"
                      style={{
                        color:
                          matchScore.breakdown?.experience >= 80
                            ? colors.success
                            : matchScore.breakdown?.experience >= 60
                              ? colors.warning
                              : colors.error,
                      }}
                    >
                      {matchScore.breakdown?.experience ?? 0}%
                    </Txt>
                  </VStack>
                  <VStack align="center">
                    <Txt variant="caption" className="opacity-70 mb-1">
                      Keywords
                    </Txt>
                    <Txt
                      variant="base"
                      className="font-bold"
                      style={{
                        color:
                          matchScore.breakdown?.keywords >= 80
                            ? colors.success
                            : matchScore.breakdown?.keywords >= 60
                              ? colors.warning
                              : colors.error,
                      }}
                    >
                      {matchScore.breakdown?.keywords ?? 0}%
                    </Txt>
                  </VStack>
                </HStack>
              </View>

              {/* Missing Skills */}
              {matchScore.missingSkills &&
                matchScore.missingSkills.length > 0 && (
                  <VStack className="mb-4">
                    <Txt
                      variant="sm"
                      className="font-bold mb-2 text-base-content/80"
                    >
                      Missing Skills
                    </Txt>
                    <View
                      style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                    >
                      {matchScore.missingSkills.map(
                        (skillItem: any, index: number) => (
                          <View
                            key={index}
                            className="flex-row items-center bg-base-100 border border-base-300/30 px-3 py-1.5 rounded-full"
                          >
                            <Txt variant="caption" className="font-medium mr-2">
                              {skillItem.skill}
                            </Txt>
                            <View
                              className={`px-1.5 py-0.5 rounded ${skillItem.importance === "Required" ? "bg-error/10" : "bg-warning/10"}`}
                            >
                              <Txt
                                variant="caption"
                                style={{
                                  fontSize: 10,
                                  color:
                                    skillItem.importance === "Required"
                                      ? colors.error
                                      : colors.warning,
                                }}
                              >
                                {skillItem.importance}
                              </Txt>
                            </View>
                          </View>
                        ),
                      )}
                    </View>
                  </VStack>
                )}

              {/* Recommendations */}
              {matchScore.recommendations &&
                matchScore.recommendations.length > 0 && (
                  <VStack>
                    <Txt
                      variant="sm"
                      className="font-bold mb-2 text-base-content/80"
                    >
                      Recommendations
                    </Txt>
                    <VStack spacing={8}>
                      {matchScore.recommendations.map(
                        (rec: string, index: number) => (
                          <HStack key={index} align="flex-start" spacing={8}>
                            <MaterialIcons
                              name="lightbulb"
                              size={16}
                              color={colors.warning}
                              style={{ marginTop: 2 }}
                            />
                            <Txt
                              variant="caption"
                              className="opacity-80 flex-1 leading-snug"
                            >
                              {rec}
                            </Txt>
                          </HStack>
                        ),
                      )}
                    </VStack>
                  </VStack>
                )}
            </VStack>
          ) : (
            <Txt variant="base" className="opacity-70 mt-1 leading-snug">
              See how well your profile matches this role using AI analysis.
            </Txt>
          )}
        </View>

        {/* Description */}
        <VStack className="mb-8">
          <Txt variant="xl" className="font-bold mb-4">
            Job Description
          </Txt>
            <RenderHtml
              contentWidth={width - 48}
              source={{ html: job.description || "" }}
              baseStyle={{
                color: colors.baseContent,
                fontSize: 16,
                lineHeight: 26,
                opacity: 0.8,
              }}
              tagsStyles={{
                p: { marginBottom: 12 },
                h1: {
                  fontWeight: "bold",
                  fontSize: 24,
                  marginBottom: 12,
                  color: colors.baseContent,
                  opacity: 1,
                },
                h2: {
                  fontWeight: "bold",
                  fontSize: 20,
                  marginBottom: 10,
                  color: colors.baseContent,
                  opacity: 1,
                },
                li: { marginBottom: 6 },
              }}
            />
        </VStack>

        {/* Skills */}
        <VStack className="mb-8">
          <Txt variant="xl" className="font-bold mb-4">
            Required Skills
          </Txt>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {job.skills?.map((skill: string) => (
              <View
                key={skill}
                className="border border-base-300 rounded-full px-4 py-2 bg-base-200"
              >
                <Txt variant="base" className="font-medium">
                  {skill}
                </Txt>
              </View>
            ))}
          </View>
        </VStack>
      </ScrollContainer>

      {/* Bottom Actions */}
      <View
        style={{ paddingBottom: insets.bottom + 16, paddingTop: 16 }}
        className="px-6 bg-base-100 border-t border-base-300/30"
      >
        <Button
          label={isApplied ? "Applied Successfully" : "Apply Now"}
          variant={isApplied ? "success" : "primary"}
          leftIcon={isApplied ? "checkmark-circle" : "send"}
          onPress={handleApply}
          disabled={isApplied}
        />
      </View>
    </View>
  );
}
