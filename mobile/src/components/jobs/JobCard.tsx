import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { Txt } from "../common/Typography";
import Card from "../ui/data-display/Card";
import Badge from "../ui/data-display/Badge";
import { HStack, VStack } from "../ui/layout/Stack";
import IconButton from "../ui/buttons/IconButton";
import { useJobStore } from "../../store/useJobStore";

interface JobCardProps {
  job: any;
  isSaved?: boolean;
  onPress?: () => void;
}

export default function JobCard({
  job,
  isSaved = false,
  onPress,
}: JobCardProps) {
  const { toggleSaveJob } = useJobStore();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const handleSave = async (e?: any) => {
    try {
      await toggleSaveJob(job._id, isSaved);
    } catch (error) {
      // Handled in store
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className="mb-4"
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Card style={{ padding: 16 }}>
        <HStack justify="space-between" align="flex-start" className="mb-3">
          <VStack style={{ flex: 1, paddingRight: 12 }}>
            <Txt variant="md" className="font-bold mb-1">
              {job.title}
            </Txt>
            <Txt variant="base" className="font-medium opacity-80">
              {job.companyName}
            </Txt>
          </VStack>
          <VStack align="center" spacing={8}>
            {job.source && job.source !== "Internal" && (
              <Badge label={job.source} variant="primary" soft size="sm" />
            )}
            <IconButton
              icon={isSaved ? "bookmark" : "bookmark-outline"}
              size="sm"
              variant={isSaved ? "warning" : "outline"}
              onPress={handleSave}
            />
          </VStack>
        </HStack>

        <HStack spacing={16} className="mb-4 flex-wrap" style={{ rowGap: 8 }}>
          <HStack align="center" spacing={4}>
            <MaterialIcons
              name="location-on"
              size={16}
              color={colors.baseContent}
              style={{ opacity: 0.7 }}
            />
            <Txt variant="caption" className="opacity-70">
              {job.location}
            </Txt>
          </HStack>
          <HStack align="center" spacing={4}>
            <MaterialIcons
              name="work"
              size={16}
              color={colors.baseContent}
              style={{ opacity: 0.7 }}
            />
            <Txt variant="caption" className="opacity-70">
              {job.employmentType}
            </Txt>
          </HStack>
          {job.salaryRange && (
            <HStack align="center" spacing={4}>
              <MaterialIcons
                name="payments"
                size={16}
                color={colors.baseContent}
                style={{ opacity: 0.7 }}
              />
              <Txt variant="caption" className="opacity-70">
                {job.salaryRange}
              </Txt>
            </HStack>
          )}
        </HStack>

        <View style={styles.skillsContainer}>
          {job.skills?.slice(0, 4).map((skill: string) => (
            <View
              key={skill}
              style={[
                styles.skillBadge,
                {
                  borderColor: colors.base300,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
            >
              <Txt variant="caption">{skill}</Txt>
            </View>
          ))}
          {job.skills?.length > 4 && (
            <View
              style={[
                styles.skillBadge,
                {
                  borderColor: colors.base300,
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
            >
              <Txt variant="caption" className="opacity-50">
                +{job.skills.length - 4} more
              </Txt>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillBadge: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
});
