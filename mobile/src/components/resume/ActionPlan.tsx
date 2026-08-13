import React from "react";
import { View, ScrollView } from "react-native";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { ResumeAnalysisData } from "@/store/useResumeStore";

interface ActionPlanProps {
  analysisResult: ResumeAnalysisData;
}

export default function ActionPlan({ analysisResult }: ActionPlanProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { recommendations } = analysisResult;

  const getImpactStyle = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return { color: colors.error, bg: colors.error + '15', icon: "priority-high" };
      case "medium":
        return { color: colors.warning, bg: colors.warning + '15', icon: "low-priority" };
      case "low":
        return { color: colors.info, bg: colors.info + '15', icon: "horizontal-rule" };
      default:
        return { color: colors.baseContent, bg: colors.base300, icon: "info" };
    }
  };

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
      
      <View className="bg-base-200 rounded-3xl p-6 mb-8 border border-base-300 items-center">
        <View className="w-16 h-16 rounded-full items-center justify-center bg-primary/10 mb-4">
          <MaterialIcons name="format-list-numbered" size={32} color={colors.primary} />
        </View>
        <Txt variant="2xl" className="font-extrabold text-center mb-2">Your Action Plan</Txt>
        <Txt variant="base" className="opacity-70 text-center leading-snug">
          Follow these prioritized steps to optimize your resume and increase your chances of landing an interview.
        </Txt>
      </View>

      {recommendations.map((rec, idx) => {
        const impactStyle = getImpactStyle(rec.impact);
        
        return (
          <View key={idx} className="bg-base-100 rounded-2xl mb-4 border border-base-300 overflow-hidden shadow-sm">
            <View className="p-4">
              <HStack align="center" justify="space-between" className="mb-3">
                <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
                  <Txt variant="sm" className="font-bold" style={{ color: colors.primary }}>{idx + 1}</Txt>
                </View>
                <View 
                  className="px-3 py-1 rounded-full flex-row items-center" 
                  style={{ backgroundColor: impactStyle.bg }}
                >
                  <MaterialIcons name={impactStyle.icon as any} size={14} color={impactStyle.color} style={{ marginRight: 4 }} />
                  <Txt variant="xs" className="font-bold" style={{ color: impactStyle.color }}>{rec.impact} Impact</Txt>
                </View>
              </HStack>
              
              <Txt variant="lg" className="font-bold mb-2 leading-snug">{rec.action}</Txt>
              
              <View className="mt-3 bg-base-200 p-3 rounded-xl border border-base-300/50">
                <HStack align="flex-start" spacing={8} className="mb-2">
                  <View className="mt-1">
                    <MaterialIcons name="help-outline" size={16} color={colors.primary} />
                  </View>
                  <VStack style={{ flex: 1 }}>
                    <Txt variant="xs" className="font-bold opacity-60 uppercase mb-0.5">Why it matters</Txt>
                    <Txt variant="sm" className="opacity-90 leading-relaxed">{rec.why}</Txt>
                  </VStack>
                </HStack>

                <HStack align="flex-start" spacing={8}>
                  <View className="mt-1">
                    <MaterialIcons name="build" size={16} color={colors.accent} />
                  </View>
                  <VStack style={{ flex: 1 }}>
                    <Txt variant="xs" className="font-bold opacity-60 uppercase mb-0.5">How to fix it</Txt>
                    <Txt variant="sm" className="opacity-90 leading-relaxed">{rec.how}</Txt>
                  </VStack>
                </HStack>
              </View>
            </View>
          </View>
        );
      })}

    </ScrollView>
  );
}
