import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { ResumeAnalysisData } from "@/store/useResumeStore";

interface BulletAIProps {
  analysisResult: ResumeAnalysisData;
}

export default function BulletAI({ analysisResult }: BulletAIProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { bulletAnalysis } = analysisResult;
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (!bulletAnalysis || bulletAnalysis.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-6 mt-10">
        <MaterialIcons name="fact-check" size={64} color={colors.base300} />
        <Txt variant="lg" className="font-bold mt-4 text-center">No bullet points analyzed</Txt>
        <Txt variant="base" className="opacity-60 text-center mt-2">
          We couldn't extract distinct bullet points from your experience section.
        </Txt>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
      
      <View className="bg-primary/10 rounded-2xl p-5 mb-6 border border-primary/20">
        <HStack align="center" spacing={12}>
          <MaterialIcons name="auto-fix-high" size={28} color={colors.primary} />
          <VStack style={{ flex: 1 }}>
            <Txt variant="lg" className="font-bold">AI Bullet Enhancer</Txt>
            <Txt variant="sm" className="opacity-70 mt-1 leading-snug">
              Select a bullet point to view customized rewrites that maximize impact and ATS performance.
            </Txt>
          </VStack>
        </HStack>
      </View>

      {bulletAnalysis.map((bullet, idx) => {
        const isExpanded = expandedIndex === idx;
        
        return (
          <View key={idx} className="bg-base-200 rounded-2xl mb-4 border border-base-300 overflow-hidden">
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setExpandedIndex(isExpanded ? null : idx)}
              className="p-4"
            >
              <HStack align="flex-start" justify="space-between" spacing={12}>
                <View className="bg-error/10 w-8 h-8 rounded-full items-center justify-center mt-1">
                  <Txt variant="sm" className="font-bold" style={{ color: colors.error }}>{idx + 1}</Txt>
                </View>
                <VStack style={{ flex: 1 }}>
                  <Txt variant="base" className="leading-relaxed opacity-90">{bullet.original}</Txt>
                  {!isExpanded && bullet.problem && (
                    <Txt variant="sm" className="mt-2" style={{ color: colors.error }}>
                      Issue: {bullet.problem}
                    </Txt>
                  )}
                </VStack>
                <MaterialIcons 
                  name={isExpanded ? "expand-less" : "expand-more"} 
                  size={24} 
                  color={colors.baseContent + "80"} 
                />
              </HStack>
            </TouchableOpacity>

            {isExpanded && (
              <View className="px-4 pb-4 pt-2 border-t border-base-300/50 bg-base-100">
                <View className="mb-4 bg-error/5 p-3 rounded-xl border border-error/10">
                  <Txt variant="sm" className="font-bold mb-1" style={{ color: colors.error }}>Identified Issue</Txt>
                  <Txt variant="sm" className="opacity-80">{bullet.problem}</Txt>
                </View>

                <Txt variant="sm" className="font-bold mb-3 opacity-60 uppercase tracking-wider">AI Suggestions</Txt>
                
                <View className="mb-3">
                  <HStack align="center" spacing={6} className="mb-1">
                    <MaterialIcons name="bolt" size={16} color={colors.accent} />
                    <Txt variant="sm" className="font-semibold" style={{ color: colors.accent }}>Impact Focused</Txt>
                  </HStack>
                  <View className="bg-base-200 p-3 rounded-xl border border-base-300">
                    <Txt variant="sm" className="leading-relaxed">{bullet.options.impactFocused}</Txt>
                  </View>
                </View>

                <View className="mb-3">
                  <HStack align="center" spacing={6} className="mb-1">
                    <MaterialIcons name="code" size={16} color={colors.primary} />
                    <Txt variant="sm" className="font-semibold" style={{ color: colors.primary }}>Technical</Txt>
                  </HStack>
                  <View className="bg-base-200 p-3 rounded-xl border border-base-300">
                    <Txt variant="sm" className="leading-relaxed">{bullet.options.technical}</Txt>
                  </View>
                </View>

                <View>
                  <HStack align="center" spacing={6} className="mb-1">
                    <MaterialIcons name="shield" size={16} color={colors.success} />
                    <Txt variant="sm" className="font-semibold" style={{ color: colors.success }}>Conservative</Txt>
                  </HStack>
                  <View className="bg-base-200 p-3 rounded-xl border border-base-300">
                    <Txt variant="sm" className="leading-relaxed">{bullet.options.conservative}</Txt>
                  </View>
                </View>

              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}
