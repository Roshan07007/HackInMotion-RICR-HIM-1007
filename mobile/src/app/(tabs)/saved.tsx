import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { Txt } from "@/components/common/Typography";

import Tabs from "@/components/ui/navigation/Tabs";
import Spinner from "@/components/ui/feedback/Spinner";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/skeletons/JobCardSkeleton";
import { useJobStore } from "@/store/useJobStore";

export default function SavedJobsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { savedJobs, appliedJobs, fetchSavedJobs, fetchAppliedJobs, isLoading } = useJobStore();
  const [activeTab, setActiveTab] = useState("saved");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSavedJobs(), fetchAppliedJobs()]);
    setRefreshing(false);
  };

  const savedList = savedJobs.filter((s: any) => s.jobId);
  const data = activeTab === "saved" ? savedList : appliedJobs;

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Header */}
      <View
        style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
        className="px-6 bg-base-100 border-b border-base-300/30 pb-4 z-10"
      >
        <Txt variant="2xl" className="font-extrabold tracking-tight mb-4">
          My Jobs
        </Txt>
        
        <Tabs
          tabs={[
            { id: "saved", label: "Saved" },
            { id: "applied", label: "Applied" },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="button"
        />
      </View>

      {isLoading && data.length === 0 && !refreshing ? (
        <View style={{ flex: 1, padding: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || String(index)}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          renderItem={({ item }) => {
            const job = activeTab === "saved" ? item.jobId : item.jobId;
            if (!job) return null;
            return (
              <View className="relative">
                {/* {activeTab === "applied" && (
                  <View className="absolute top-4 right-4 z-10 bg-success/10 px-2 py-1 rounded border border-success/20 flex-row items-center">
                    <MaterialIcons name="check-circle" size={12} color={colors.success} style={{ marginRight: 4 }} />
                    <Txt variant="caption" className="text-success font-medium">Applied</Txt>
                  </View>
                )} */}
                <JobCard
                  job={job}
                  isSaved={activeTab === "saved"}
                  onPress={() => router.push(`/job/${job._id}`)}
                />
              </View>
            );
          }}
          ListEmptyComponent={
            <VStack align="center" justify="center" style={{ marginTop: 60 }}>
              <MaterialIcons
                name={activeTab === "saved" ? "bookmark-border" : "check-circle-outline"}
                size={64}
                color={colors.baseContent}
                style={{ opacity: 0.3 }}
              />
              <Txt variant="xl" className="mt-4 font-bold">
                No {activeTab} jobs
              </Txt>
              <Txt variant="base" className="opacity-70 mt-2 text-center px-8">
                {activeTab === "saved"
                  ? "Jobs you save will appear here so you can easily find them later."
                  : "Jobs you've applied to will be tracked here."}
              </Txt>
            </VStack>
          }
        />
      )}
    </View>
  );
}
