import React from "react";
import { View, ScrollView } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { HStack, VStack } from "../ui/layout/Stack";
import ScreenHeader from "../common/ScreenHeader";

export default function JobDetailSkeleton() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  
  const pulseStyle = { backgroundColor: colors.base300, opacity: 0.5 };

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      {/* Skeleton Header */}
      <ScreenHeader
        title="Loading..."
        actions={<View className="w-8 h-8 rounded-full" style={pulseStyle} />}
      />

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Title & Company */}
        <VStack className="mb-6">
          <View className="h-10 w-3/4 rounded-lg mb-4" style={pulseStyle} />
          <HStack align="center" className="mb-4">
            <View className="w-5 h-5 rounded" style={pulseStyle} />
            <View className="h-5 w-1/2 rounded ml-2" style={pulseStyle} />
          </HStack>

          {/* Badges */}
          <HStack spacing={16} className="flex-wrap" style={{ rowGap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} className="h-6 w-24 rounded" style={pulseStyle} />
            ))}
          </HStack>
        </VStack>

        {/* Match Score Box */}
        <View className="bg-primary/5 border border-primary/10 rounded-2xl p-5 mb-8">
          <HStack align="center" justify="space-between" className="mb-4">
            <View className="h-6 w-1/2 rounded" style={pulseStyle} />
            <View className="h-8 w-24 rounded-lg" style={pulseStyle} />
          </HStack>
          <View className="h-12 w-full rounded" style={pulseStyle} />
        </View>

        {/* Description */}
        <VStack className="mb-8">
          <View className="h-7 w-48 rounded mb-4" style={pulseStyle} />
          <VStack spacing={12}>
            <View className="h-4 w-full rounded" style={pulseStyle} />
            <View className="h-4 w-full rounded" style={pulseStyle} />
            <View className="h-4 w-11/12 rounded" style={pulseStyle} />
            <View className="h-4 w-full rounded" style={pulseStyle} />
            <View className="h-4 w-4/5 rounded" style={pulseStyle} />
          </VStack>
        </VStack>

        {/* Skills */}
        <VStack className="mb-8">
          <View className="h-7 w-40 rounded mb-4" style={pulseStyle} />
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <View key={i} className="h-9 w-20 rounded-full" style={pulseStyle} />
            ))}
          </View>
        </VStack>
      </ScrollView>

      {/* Bottom Actions */}
      <View
        style={{ padding: 20, paddingTop: 16 }}
        className="px-6 bg-base-100 border-t border-base-300/30"
      >
        <View className="h-14 w-full rounded-xl" style={pulseStyle} />
      </View>
    </View>
  );
}
