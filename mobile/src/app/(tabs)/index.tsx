import { View, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Txt } from "@/components/common/Typography";
import { toast } from "@/utils/toast";
import { useRouter } from "expo-router";

import { HStack, VStack } from "@/components/ui/layout/Stack";
import IconButton from "@/components/ui/buttons/IconButton";
import Avatar from "@/components/ui/data-display/Avatar";
import SearchBar from "@/components/ui/inputs/SearchBar";
import Spinner from "@/components/ui/feedback/Spinner";
import BottomModal from "@/components/ui/BottomModal";
import JobCard from "@/components/jobs/JobCard";
import JobCardSkeleton from "@/components/skeletons/JobCardSkeleton";
import Button from "@/components/ui/buttons/Button";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

import { useJobStore } from "@/store/useJobStore";
import { useAuthStore } from "@/store/useAuthStore";
import ScrollContainer from "@/components/ui/layout/ScrollContainer";

export default function JobsFeed() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { user } = useAuthStore();
  const {
    jobs,
    isLoading,
    filters,
    setFilters,
    fetchJobs,
    totalJobs,
    savedJobs,
    hasFetched,
    fetchSavedJobs,
  } = useJobStore();

  const [refreshing, setRefreshing] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.q || "");

  // Local state for filters in modal before applying
  const [localFilters, setLocalFilters] = useState({
    location: filters.location,
    employmentType: filters.employmentType,
    experienceLevel: filters.experienceLevel,
  });

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchJobs(), fetchSavedJobs()]);
    setRefreshing(false);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setFilters({ q: text, page: 1 });
    fetchJobs({ q: text, page: 1 });
  };

  const applyFilters = () => {
    setFilters({ ...localFilters, page: 1 });
    fetchJobs({ ...localFilters, page: 1 });
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setLocalFilters({
      location: "All",
      employmentType: "All",
      experienceLevel: "All",
    });
  };

  const isJobSaved = (jobId: string) =>
    savedJobs.some((s) => s.jobId?._id === jobId || s.jobId === jobId);

  const FilterSection = ({ title, options, selected, onSelect }: any) => (
    <VStack className="mb-6">
      <Txt variant="xl" className="font-bold mb-3">
        {title}
      </Txt>
      <HStack spacing={8} className="flex-wrap" style={{ rowGap: 8 }}>
        {options.map((opt: string) => {
          const isSelected = selected === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onSelect(opt)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: isSelected ? colors.primary : colors.base300,
                backgroundColor: isSelected
                  ? colors.primary + "15"
                  : "transparent",
              }}
            >
              <Txt
                variant="base"
                style={{
                  color: isSelected ? colors.primary : colors.baseContent,
                  fontWeight: isSelected ? "600" : "400",
                }}
              >
                {opt}
              </Txt>
            </TouchableOpacity>
          );
        })}
      </HStack>
    </VStack>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Header */}
      <View className="z-50 bg-base-100">
        <View
          style={{ paddingTop: insets.top > 0 ? insets.top + 10 : 20 }}
          className="px-6 border-b border-base-300/30 pb-4"
        >
          <HStack justify="space-between" align="center" className="mb-4">
            <VStack>
              <Txt variant="2xl" className="font-extrabold tracking-tight">
                Discover Jobs
              </Txt>
              <Txt variant="base" className="opacity-70 mt-1">
                Find your next dream job
              </Txt>
            </VStack>
            <TouchableOpacity 
              onPress={() => router.push("/ai/mentor-chat")}
              className="w-11 h-11 rounded-full items-center justify-center bg-primary/10 border border-primary/20"
            >
              <Ionicons name="sparkles" size={20} color={colors.primary} />
            </TouchableOpacity>
          </HStack>

          <HStack spacing={12} align="center">
            <View style={{ flex: 1 }}>
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={(e) => handleSearch(e.nativeEvent.text)}
                placeholder="Search jobs..."
              />
            </View>
            <IconButton
              icon="options"
              variant="primary"
              onPress={() => {
                setLocalFilters({
                  location: filters.location,
                  employmentType: filters.employmentType,
                  experienceLevel: filters.experienceLevel,
                });
                setIsFilterModalOpen(true);
              }}
            />
          </HStack>
        </View>
      </View>

      {/* Job Feed */}
      {(!hasFetched || (isLoading && jobs.length === 0 && !refreshing)) ? (
        <View style={{ flex: 1, padding: 16 }}>
          {[1, 2, 3, 4].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <JobCard
              job={item}
              isSaved={isJobSaved(item._id)}
              onPress={() => router.push(`/job/${item._id}`)}
            />
          )}
          onEndReached={() => {
            if (jobs.length < totalJobs) {
              setFilters({ page: (filters.page || 1) + 1 });
              fetchJobs({ page: (filters.page || 1) + 1 });
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && jobs.length > 0 ? (
              <View style={{ paddingVertical: 20 }}>
                <Spinner size="sm" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <VStack align="center" justify="center" style={{ marginTop: 40 }}>
              <MaterialIcons
                name="search-off"
                size={64}
                color={colors.baseContent}
                style={{ opacity: 0.3 }}
              />
              <Txt variant="xl" className="mt-4 font-bold">
                No jobs found
              </Txt>
              <Txt variant="base" className="opacity-70 mt-2 text-center">
                Try adjusting your search or filters to find what you're looking
                for.
              </Txt>
            </VStack>
          }
        />
      )}

      {/* Filters Modal */}
      <BottomModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        heightPercent={0.8}
      >
        <ScrollContainer style={{ paddingBottom: insets.bottom + 24 }}>
          <Txt variant="2xl" className="font-bold mb-6 text-center">
            Filter Jobs
          </Txt>
          <FilterSection
            title="Location"
            options={["All", "Remote", "On-site", "Hybrid"]}
            selected={localFilters.location}
            onSelect={(val: string) =>
              setLocalFilters({ ...localFilters, location: val })
            }
          />
          <FilterSection
            title="Employment Type"
            options={[
              "All",
              "Full-time",
              "Part-time",
              "Contract",
              "Internship",
            ]}
            selected={localFilters.employmentType}
            onSelect={(val: string) =>
              setLocalFilters({ ...localFilters, employmentType: val })
            }
          />
          <FilterSection
            title="Experience Level"
            options={[
              "All",
              "Entry Level",
              "Mid Level",
              "Senior Level",
              "Director",
            ]}
            selected={localFilters.experienceLevel}
            onSelect={(val: string) =>
              setLocalFilters({ ...localFilters, experienceLevel: val })
            }
          />

          <HStack spacing={16} className="mt-4">
            <Button
              label="Reset"
              variant="outline"
              onPress={resetFilters}
              style={{ flex: 1 }}
            />
            <Button
              label="Apply Filters"
              variant="primary"
              onPress={applyFilters}
              style={{ flex: 1 }}
            />
          </HStack>
        </ScrollContainer>
      </BottomModal>
    </View>
  );
}
