import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import Card from "../ui/data-display/Card";
import { HStack, VStack } from "../ui/layout/Stack";

export default function JobCardSkeleton() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <View className="mb-4">
      <Card style={{ padding: 16 }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <HStack justify="space-between" align="flex-start" className="mb-4">
            <VStack style={{ flex: 1, paddingRight: 12 }}>
              <View className="h-6 rounded mb-2 w-3/4 bg-base-300" />
              <View className="h-4 rounded w-1/2 bg-base-300" />
            </VStack>
            <View className="w-10 h-10 rounded-full bg-base-300" />
          </HStack>

          <HStack spacing={16} className="mb-5 flex-wrap" style={{ rowGap: 8 }}>
            <View className="h-4 rounded w-20 bg-base-300" />
            <View className="h-4 rounded w-24 bg-base-300" />
            <View className="h-4 rounded w-16 bg-base-300" />
          </HStack>

          <HStack justify="space-between" align="center">
            <View className="h-5 rounded w-24 bg-base-300" />
            <View className="h-8 rounded w-24 bg-base-300" />
          </HStack>
        </Animated.View>
      </Card>
    </View>
  );
}
