import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";

import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import Button from "@/components/ui/buttons/Button";
import Input from "@/components/ui/inputs/Input";
import ScrollContainer from "@/components/ui/layout/ScrollContainer";
import Tabs from "@/components/ui/navigation/Tabs";
import ConfirmationToast from "@/components/common/ConfirmationToast";
import { toast } from "@/utils/toast";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/config/api";

const TABS = [
  { id: "new", label: "New Interview", icon: "add-circle-outline" },
  { id: "history", label: "History", icon: "time-outline" },
];

export default function InterviewSetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("new");

  // Setup Form State
  const [jobRole, setJobRole] = useState(user?.preferences?.jobRoles?.[0] || "");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("5");
  const [loading, setLoading] = useState(false);

  // History State
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Confirmation state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data } = await api.get("/video-interview/history");
      setHistory(data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Error", "Failed to load interview history");
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleStartInterview = async () => {
    if (!jobRole.trim()) {
      toast.error("Error", "Job Role is required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        jobRole,
        companyName,
        jobDescription,
        resumeText,
        numberOfQuestions: parseInt(numberOfQuestions) || 5,
        type: "self",
      };

      const { data } = await api.post("/video-interview/init", payload);
      const interviewId = data.data._id;

      toast.success("Success", "Interview initialized!");
      // Navigate to the interview room
      router.push(`/interview/${interviewId}` as any);
    } catch (error: any) {
      console.error(error);
      toast.error("Error", error.response?.data?.error || "Failed to initialize interview");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setSelectedId(id);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    try {
      await api.delete(`/video-interview/${selectedId}`);
      toast.success("Success", "Deleted successfully");
      setHistory((prev) => prev.filter((item) => item._id !== selectedId));
    } catch (error) {
      toast.error("Error", "Failed to delete interview");
    } finally {
      setSelectedId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const renderNewInterview = () => (
    <ScrollContainer contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
      <VStack className="pb-10">
        <View
          className="w-20 h-20 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: colors.primary + "20" }}
        >
          <Ionicons name="videocam" size={40} color={colors.primary} />
        </View>

        <Txt variant="xl" className="font-extrabold mb-1">
          Customize Your Interview
        </Txt>
        <Txt variant="base" className="opacity-70 mb-6">
          Configure the AI parameters for a tailored mock interview experience.
        </Txt>

        <View className="w-full mb-6">
          <Input
            label="Target Job Role *"
            placeholder="e.g. Frontend Developer"
            value={jobRole}
            onChangeText={setJobRole}
            leftIcon="briefcase-outline"
          />
          <Input
            label="Company Name (Optional)"
            placeholder="e.g. Google, Stripe"
            value={companyName}
            onChangeText={setCompanyName}
            leftIcon="business-outline"
          />
          <Input
            label="Number of Questions"
            placeholder="5"
            value={numberOfQuestions}
            onChangeText={setNumberOfQuestions}
            keyboardType="number-pad"
            leftIcon="help-circle-outline"
          />
          <Input
            label="Job Description (Optional)"
            placeholder="Paste job description here..."
            value={jobDescription}
            onChangeText={setJobDescription}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: "top" }}
          />
          <Input
            label="Resume / Context (Optional)"
            placeholder="Paste resume text or key points..."
            value={resumeText}
            onChangeText={setResumeText}
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: "top" }}
          />
        </View>

        <Button
          label={loading ? "Initializing..." : "Launch Interview Room"}
          variant="primary"
          icon={loading ? undefined : "rocket-launch"}
          onPress={handleStartInterview}
          isLoading={loading}
          disabled={!jobRole || loading}
          isFullWidth
        />
      </VStack>
    </ScrollContainer>
  );

  const renderHistory = () => (
    <View style={{ flex: 1, padding: 16 }}>
      {loadingHistory ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : history.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="document-text-outline" size={64} color={colors.baseContent + "40"} />
          <Txt variant="lg" className="font-bold mt-4 text-center">
            No interview history found
          </Txt>
          <Txt variant="base" className="opacity-60 text-center mt-2">
            Complete your first mock interview to see it here.
          </Txt>
          <Button
            label="Start One Now"
            variant="outline"
            onPress={() => setActiveTab("new")}
            style={{ marginTop: 24 }}
          />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {history.map((item) => {
            const isEvaluated = item.status === "evaluated";
            const rating = item.overallReport?.hireabilityRating;
            let badgeColor = colors.base200;
            let textColor = colors.baseContent;

            if (isEvaluated) {
              if (rating?.includes("Strong")) {
                badgeColor = colors.success + "20";
                textColor = colors.success;
              } else if (rating?.includes("Reject") || rating?.includes("Weak")) {
                badgeColor = colors.error + "20";
                textColor = colors.error;
              } else {
                badgeColor = colors.info + "20";
                textColor = colors.info;
              }
            } else {
              badgeColor = colors.warning + "20";
              textColor = colors.warning;
            }

            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => router.push(`/interview/report/${item._id}` as any)}
                className="mb-4 bg-base-100 border border-base-300 rounded-2xl p-4 shadow-sm"
              >
                <HStack justify="space-between" align="center" className="mb-2">
                  <VStack style={{ flex: 1 }}>
                    <Txt variant="lg" className="font-bold">
                      {item.jobRole} Interview
                    </Txt>
                    <Txt variant="sm" className="opacity-60 mt-0.5">
                      {formatDate(item.createdAt)}
                    </Txt>
                  </VStack>
                  <TouchableOpacity
                    onPress={() => handleDelete(item._id)}
                    className="w-10 h-10 items-center justify-center bg-error/10 rounded-full ml-2"
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                </HStack>

                <HStack align="center" justify="flex-start" className="mt-2">
                  <View
                    style={{ backgroundColor: badgeColor }}
                    className="px-3 py-1 rounded-full flex-row items-center"
                  >
                    {!isEvaluated && <Ionicons name="time-outline" size={14} color={textColor} style={{ marginRight: 4 }} />}
                    <Txt variant="xs" style={{ color: textColor, fontWeight: "bold" }}>
                      {isEvaluated ? rating || "Evaluated" : "In Progress"}
                    </Txt>
                  </View>
                </HStack>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Header & Tabs */}
      <View
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
        className="px-6 bg-base-100 border-b border-base-300/30 pb-4 z-10"
      >
        <Txt variant="2xl" className="font-extrabold tracking-tight mb-4">
          Mock Interviews
        </Txt>
        
        <Tabs
          tabs={TABS}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="button"
        />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>{activeTab === "new" ? renderNewInterview() : renderHistory()}</View>
      
      {showConfirmation && (
        <ConfirmationToast
          name="Delete Record"
          message="Are you sure you want to delete this interview record?"
          fun={confirmDelete}
          setShow={setShowConfirmation}
        />
      )}
    </View>
  );
}
