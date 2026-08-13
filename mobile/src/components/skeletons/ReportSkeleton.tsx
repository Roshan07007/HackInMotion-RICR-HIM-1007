import React from "react";
import { View, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { HStack, VStack } from "../ui/layout/Stack";

export default function ReportSkeleton() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  
  const pulseStyle = { backgroundColor: colors.base300, opacity: 0.5 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Skeleton Header */}
      <View className="pt-14 pb-4 px-4 border-b border-base-300/30 flex-row items-center justify-between">
        <View className="w-10 h-10 rounded-full" style={pulseStyle} />
        <View className="h-6 w-32 rounded" style={pulseStyle} />
        <View className="w-10 h-10 rounded-full" style={pulseStyle} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Score Ring Section */}
        <View className="items-center mb-8">
          <View className="w-32 h-32 rounded-full mb-4" style={pulseStyle} />
          <View className="h-8 w-40 rounded mb-2" style={pulseStyle} />
          <View className="h-4 w-60 rounded" style={pulseStyle} />
        </View>

        {/* Action Buttons */}
        <HStack spacing={12} className="mb-8">
          <View className="h-12 flex-1 rounded-xl" style={pulseStyle} />
          <View className="h-12 flex-1 rounded-xl" style={pulseStyle} />
        </HStack>

        {/* Video Player Skeleton */}
        <VStack className="mb-8">
          <View className="h-6 w-32 rounded mb-4" style={pulseStyle} />
          <View className="h-48 w-full rounded-2xl" style={pulseStyle} />
        </VStack>

        {/* Feedback Section */}
        <VStack className="mb-8">
          <View className="h-6 w-48 rounded mb-4" style={pulseStyle} />
          <View className="p-4 rounded-2xl bg-base-200">
            <View className="h-4 w-full rounded mb-3" style={pulseStyle} />
            <View className="h-4 w-11/12 rounded mb-3" style={pulseStyle} />
            <View className="h-4 w-full rounded mb-3" style={pulseStyle} />
            <View className="h-4 w-4/5 rounded" style={pulseStyle} />
          </View>
        </VStack>

        {/* Transcript Section */}
        <VStack>
          <View className="h-6 w-32 rounded mb-4" style={pulseStyle} />
          <View className="p-4 rounded-2xl bg-base-200">
            <View className="h-4 w-full rounded mb-3" style={pulseStyle} />
            <View className="h-4 w-3/4 rounded mb-3" style={pulseStyle} />
            <View className="h-4 w-5/6 rounded" style={pulseStyle} />
          </View>
        </VStack>
      </ScrollView>
    </View>
  );
}
