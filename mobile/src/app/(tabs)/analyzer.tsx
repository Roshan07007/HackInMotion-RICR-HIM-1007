import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import * as DocumentPicker from "expo-document-picker";

import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import Button from "@/components/ui/buttons/Button";
import IconButton from "@/components/ui/buttons/IconButton";
import Input from "@/components/ui/inputs/Input";
import { toast } from "@/utils/toast";
import { aiService } from "@/services/ai.service";
import { useResumeStore } from "@/store/useResumeStore";
import { useAuthStore } from "@/store/useAuthStore";

// Import new modular components
import ScoreDashboard from "@/components/resume/ScoreDashboard";
import SkillsMatch from "@/components/resume/SkillsMatch";
import BulletAI from "@/components/resume/BulletAI";
import AtsReadiness from "@/components/resume/AtsReadiness";
import ActionPlan from "@/components/resume/ActionPlan";
import ScrollContainer from "@/components/ui/layout/ScrollContainer";

const TABS = [
  { id: "overview", label: "Dashboard", icon: "dashboard" },
  { id: "skills", label: "Skills", icon: "psychology" },
  { id: "bullets", label: "Bullet AI", icon: "auto-fix-high" },
  { id: "ats", label: "ATS Check", icon: "fact-check" },
  { id: "action", label: "Action Plan", icon: "format-list-numbered" },
];

export default function ResumeAnalyzerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const { user } = useAuthStore();

  const [jobRole, setJobRole] = useState(
    user?.preferences?.jobRoles?.[0] || "",
  );
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const { analysisResult, setAnalysisResult, reset } = useResumeStore();

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (err) {
      toast.error("Error", "Failed to pick document");
    }
  };

  const analyzeResume = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      reset(); // Clear previous

      const formData = new FormData();
      formData.append("resume", {
        uri: selectedFile.uri,
        name: selectedFile.name || "resume.pdf",
        type: selectedFile.mimeType || "application/pdf",
      } as any);

      formData.append("jobRole", jobRole || "Software Engineer");
      if (companyName) formData.append("companyName", companyName);
      if (location) formData.append("location", location);
      if (jobDescription) formData.append("jobDescription", jobDescription);

      const res = await aiService.deepAnalyzeResume(formData);

      if (res.data?.success) {
        setAnalysisResult(res.data.data);
        toast.success("Success", "Resume analyzed successfully");
      } else {
        toast.error("Error", "Analysis failed");
      }
    } catch (error: any) {
      toast.error(
        "Error",
        error.response?.data?.message || "Failed to analyze resume",
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  const renderTabContent = () => {
    if (!analysisResult) return null;

    switch (activeTab) {
      case "overview":
        return <ScoreDashboard analysisResult={analysisResult} />;
      case "skills":
        return <SkillsMatch analysisResult={analysisResult} />;
      case "bullets":
        return <BulletAI analysisResult={analysisResult} />;
      case "ats":
        return <AtsReadiness analysisResult={analysisResult} />;
      case "action":
        return <ActionPlan analysisResult={analysisResult} />;
      default:
        return <ScoreDashboard analysisResult={analysisResult} />;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Custom Header */}
      <View className="z-50 bg-base-100 pb-2">
        <View
          style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
          className="px-6 pb-2"
        >
          <Txt variant="2xl" className="font-extrabold tracking-tight">
            Resume Analyzer
          </Txt>
          <Txt variant="base" className="opacity-70 mt-1">
            AI-powered feedback to land your dream job
          </Txt>
        </View>
      </View>

      {!analysisResult ? (
        <ScrollContainer contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <VStack className="items-center pb-20">
            <View
              className="w-24 h-24 mx-auto rounded-full items-center justify-center mb-6"
              style={{ backgroundColor: colors.primary + "20" }}
            >
              <MaterialIcons
                name="document-scanner"
                size={48}
                color={colors.primary}
              />
            </View>

            <Txt variant="2xl" className="font-extrabold text-center ">
              AI Resume Scan
            </Txt>
            <Txt
              variant="base"
              className="opacity-70 text-center  px-6 leading-loose"
            >
              Upload your resume
            </Txt>

            {selectedFile ? (
              <View className="w-full bg-base-200 p-4 rounded-2xl border border-primary/30 mb-6 flex-row items-center justify-between">
                <HStack align="center" spacing={12} style={{ flex: 1 }}>
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={32}
                    color={colors.error}
                  />
                  <VStack style={{ flex: 1 }}>
                    <Txt
                      variant="base"
                      className="font-bold truncate"
                      numberOfLines={1}
                    >
                      {selectedFile.name}
                    </Txt>
                    <Txt variant="caption" className="opacity-60">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </Txt>
                  </VStack>
                </HStack>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => setSelectedFile(null)}
                />
              </View>
            ) : (
              <Button
                label="Select PDF Resume"
                variant="outline"
                icon="cloud-upload"
                onPress={pickDocument}
                isFullWidth
                style={{ marginBottom: 24 }}
              />
            )}

            <View className="w-full mb-6">
              <Input
                label="Target Job Role *"
                placeholder="e.g. Software Engineer"
                value={jobRole}
                onChangeText={setJobRole}
                leftIcon="briefcase-outline"
              />
              <Input
                label="Target Company (Optional)"
                placeholder="e.g. Acme Corp"
                value={companyName}
                onChangeText={setCompanyName}
                leftIcon="business-outline"
              />
              <Input
                label="Location (Optional)"
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChangeText={setLocation}
                leftIcon="location-outline"
              />
              <Input
                label="Job Description (Optional)"
                placeholder="Paste job description here for better matching..."
                value={jobDescription}
                onChangeText={setJobDescription}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: "top" }}
              />
            </View>

            <Button
              label={loading ? "Analyzing..." : "Analyze Resume"}
              variant="primary"
              icon={loading ? undefined : "auto-awesome"}
              onPress={analyzeResume}
              isLoading={loading}
              disabled={!selectedFile || !jobRole || loading}
              isFullWidth
            />
          </VStack>
        </ScrollContainer>
      ) : (
        <View style={{ flex: 1 }}>
          {/* Custom Horizontal Tab Bar */}
          <View className="bg-base-100 border-b border-base-300/50">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 12 }}
            >
              <HStack spacing={0}>
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <TouchableOpacity
                      key={tab.id}
                      onPress={() => setActiveTab(tab.id)}
                      className="px-4 py-3.5 flex-row items-center"
                      style={{
                        borderBottomWidth: 2,
                        borderBottomColor: isActive
                          ? colors.primary
                          : "transparent",
                      }}
                    >
                      <MaterialIcons
                        name={tab.icon as any}
                        size={18}
                        color={
                          isActive ? colors.primary : colors.baseContent + "60"
                        }
                        style={{ marginRight: 6 }}
                      />
                      <Txt
                        variant="sm"
                        className="font-bold"
                        style={{
                          color: isActive
                            ? colors.primary
                            : colors.baseContent + "90",
                        }}
                      >
                        {tab.label}
                      </Txt>
                    </TouchableOpacity>
                  );
                })}
              </HStack>
            </ScrollView>
          </View>

          {/* Render Active Tab Content */}
          <View style={{ flex: 1 }}>
            {renderTabContent()}
          </View>

          {/* Floating Action Button to Reset */}
          <View className="absolute bottom-6 right-6">
            <TouchableOpacity
              onPress={() => {
                reset();
                setSelectedFile(null);
                setActiveTab("overview");
              }}
              className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
              style={{
                backgroundColor: colors.base200,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                borderWidth: 1,
                borderColor: colors.base300,
              }}
            >
              <MaterialIcons
                name="restart-alt"
                size={26}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
