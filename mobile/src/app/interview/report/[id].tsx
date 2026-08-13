import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useVideoPlayer, VideoView } from "expo-video";

import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import Button from "@/components/ui/buttons/Button";
import { toast } from "@/utils/toast";
import { api } from "@/config/api";
import ReportSkeleton from "@/components/skeletons/ReportSkeleton";

export default function InterviewReportScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Hook must be called unconditionally before early returns!
  const player = useVideoPlayer(reportData?.videoUrl || null, (p) => {
    p.loop = false;
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const { data } = await api.get(`/video-interview/${id}`);
        setReportData(data.data);
      } catch (error) {
        console.error("Failed to fetch interview report", error);
        toast.error("Error", "Failed to load interview report");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  if (loading) {
    return <ReportSkeleton />;
  }

  if (!reportData) {
    return (
      <View className="flex-1 items-center justify-center bg-base-100 p-6">
        <Txt variant="lg" className="font-bold">Report not found</Txt>
        <Button label="Go Back" onPress={() => router.back()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  const { overallReport, transcript, jobRole, status, videoUrl } = reportData;
  if (status !== "evaluated" || !overallReport) {
    return (
      <View className="flex-1 items-center justify-center bg-base-100 p-6">
        <Ionicons name="time-outline" size={64} color={colors.primary} />
        <Txt variant="xl" className="font-bold mt-4 text-center">Interview Pending Evaluation</Txt>
        <Txt variant="base" className="opacity-60 text-center mt-2 mb-8">
          The AI is currently processing your interview transcript. Please check back shortly.
        </Txt>
        <Button label="Return to Dashboard" onPress={() => router.back()} />
      </View>
    );
  }

  const getRatingBadgeInfo = (rating: string) => {
    if (rating.includes("Strong")) return { bg: colors.success + "20", text: colors.success };
    if (rating.includes("Weak") || rating.includes("Reject")) return { bg: colors.error + "20", text: colors.error };
    return { bg: colors.info + "20", text: colors.info };
  };

  const badgeInfo = getRatingBadgeInfo(overallReport.hireabilityRating);

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Header */}
      <View className="z-50 bg-base-100 border-b border-base-300/50">
        <HStack
          align="center"
          className="px-4 pb-3"
          style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
        >
          <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
            <Ionicons name="arrow-back" size={24} color={colors.baseContent} />
          </TouchableOpacity>
          <VStack>
            <Txt variant="lg" className="font-bold">Interview Report</Txt>
            <Txt variant="sm" className="opacity-60">{jobRole}</Txt>
          </VStack>
        </HStack>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        {/* Video Recording */}
        {videoUrl && (
          <View className="bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm mb-6">
            <HStack align="center" spacing={8} className="mb-4">
              <Ionicons name="videocam" size={20} color={colors.primary} />
              <Txt variant="lg" className="font-bold">Interview Recording</Txt>
            </HStack>
            <View className="rounded-xl overflow-hidden bg-black w-full aspect-video border border-base-300/50">
              <VideoView
                player={player}
                style={{ width: '100%', height: '100%' }}
                allowsFullscreen
                allowsPictureInPicture
              />
            </View>
          </View>
        )}

        {/* Recommendation Badge */}
        <View className="bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm mb-6">
          <Txt variant="base" className="font-bold mb-4 opacity-80">Final Recommendation</Txt>
          <View
            style={{ backgroundColor: badgeInfo.bg, alignSelf: "flex-start" }}
            className="px-4 py-2 rounded-xl mb-6"
          >
            <Txt variant="lg" style={{ color: badgeInfo.text, fontWeight: "bold" }}>
              {overallReport.hireabilityRating}
            </Txt>
          </View>

          {/* Scores */}
          <VStack spacing={16}>
            <View>
              <HStack justify="space-between" className="mb-2">
                <Txt variant="sm" className="font-medium">Technical Score</Txt>
                <Txt variant="sm" className="font-bold">{overallReport.technicalScore}/100</Txt>
              </HStack>
              <View className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                <View style={{ width: `${overallReport.technicalScore}%`, backgroundColor: colors.primary, height: "100%" }} />
              </View>
            </View>

            <View>
              <HStack justify="space-between" className="mb-2">
                <Txt variant="sm" className="font-medium">Communication</Txt>
                <Txt variant="sm" className="font-bold">{overallReport.communicationScore}/100</Txt>
              </HStack>
              <View className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                <View style={{ width: `${overallReport.communicationScore}%`, backgroundColor: colors.info, height: "100%" }} />
              </View>
            </View>

            <View>
              <HStack justify="space-between" className="mb-2">
                <Txt variant="sm" className="font-medium">Confidence</Txt>
                <Txt variant="sm" className="font-bold">{overallReport.confidenceScore}/100</Txt>
              </HStack>
              <View className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                <View style={{ width: `${overallReport.confidenceScore}%`, backgroundColor: colors.success, height: "100%" }} />
              </View>
            </View>
          </VStack>
        </View>

        {/* Executive Summary */}
        <View className="bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm mb-6">
          <HStack align="center" spacing={8} className="mb-4">
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Txt variant="lg" className="font-bold">Executive Summary</Txt>
          </HStack>
          <Txt variant="sm" className="opacity-80 leading-relaxed">
            {overallReport.executiveSummary}
          </Txt>
        </View>

        {/* Strengths & Weaknesses */}
        <HStack spacing={16} className="mb-6">
          <View className="flex-1 bg-success/10 border border-success/20 rounded-3xl p-5">
            <HStack align="center" spacing={6} className="mb-4">
              <Ionicons name="checkmark-circle" size={18} color={colors.success} />
              <Txt variant="base" className="font-bold" style={{ color: colors.success }}>Strengths</Txt>
            </HStack>
            <VStack spacing={8}>
              {overallReport.strengths.map((s: string, i: number) => (
                <Txt key={i} variant="xs" className="opacity-80 leading-tight">
                  • {s}
                </Txt>
              ))}
            </VStack>
          </View>

          <View className="flex-1 bg-error/10 border border-error/20 rounded-3xl p-5">
            <HStack align="center" spacing={6} className="mb-4">
              <Ionicons name="close-circle" size={18} color={colors.error} />
              <Txt variant="base" className="font-bold" style={{ color: colors.error }}>Areas to Improve</Txt>
            </HStack>
            <VStack spacing={8}>
              {overallReport.weaknesses.map((w: string, i: number) => (
                <Txt key={i} variant="xs" className="opacity-80 leading-tight">
                  • {w}
                </Txt>
              ))}
            </VStack>
          </View>
        </HStack>

        {/* Transcript */}
        <View className="bg-base-200 border border-base-300 rounded-3xl p-6 shadow-sm">
          <HStack align="center" spacing={8} className="mb-6">
            <Ionicons name="chatbubbles" size={20} color={colors.primary} />
            <Txt variant="lg" className="font-bold">Detailed Q&A Transcript</Txt>
          </HStack>

          <VStack spacing={16}>
            {transcript?.map((item: any, idx: number) => {
              const isAI = item.role === "assistant";
              return (
                <View
                  key={idx}
                  className={`p-4 rounded-xl ${isAI ? "bg-base-300" : "bg-primary/10 border border-primary/20"}`}
                >
                  <Txt variant="xs" className="font-bold uppercase opacity-60 mb-2">
                    {isAI ? "Interviewer" : "Candidate"}
                  </Txt>
                  <Txt variant="sm">{item.content}</Txt>
                  {item.aiFeedback && (
                    <View className="mt-3 pt-3 border-t border-base-content/10">
                      <Txt variant="xs" className="font-bold mb-1" style={{ color: colors.primary }}>
                        AI Feedback:
                      </Txt>
                      <Txt variant="xs" className="opacity-70">{item.aiFeedback}</Txt>
                    </View>
                  )}
                </View>
              );
            })}
          </VStack>
        </View>
      </ScrollView>
    </View>
  );
}
