import React from "react";
import { View, ScrollView } from "react-native";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { ResumeAnalysisData } from "@/store/useResumeStore";

interface AtsReadinessProps {
  analysisResult: ResumeAnalysisData;
}

export default function AtsReadiness({ analysisResult }: AtsReadinessProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { atsSimulation, qualityAnalysis } = analysisResult;

  const CheckItem = ({ text, passed }: { text: string, passed: boolean }) => (
    <HStack align="flex-start" spacing={12} className="mb-4">
      <View className="mt-0.5">
        <MaterialIcons 
          name={passed ? "check-circle" : "cancel"} 
          size={20} 
          color={passed ? colors.success : colors.error} 
        />
      </View>
      <Txt variant="base" className="flex-1 opacity-90 leading-snug">{text}</Txt>
    </HStack>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
      
      {/* Simulation Results */}
      <View className="bg-base-200 rounded-3xl p-5 mb-8 border border-base-300">
        <HStack align="center" spacing={10} className="mb-6 pb-4 border-b border-base-300/50">
          <MaterialIcons name="memory" size={24} color={colors.primary} />
          <Txt variant="xl" className="font-bold">ATS Parsing Simulation</Txt>
        </HStack>

        <VStack>
          <Txt variant="sm" className="font-bold mb-4 opacity-60 uppercase tracking-wider">Failed Checks</Txt>
          {atsSimulation.failedChecks.map((check, idx) => (
            <CheckItem key={`fail-${idx}`} text={check} passed={false} />
          ))}
          {atsSimulation.failedChecks.length === 0 && (
            <Txt variant="base" className="opacity-70 italic mb-4">No parsing issues found! Perfect formatting.</Txt>
          )}
        </VStack>

        <VStack className="mt-2">
          <Txt variant="sm" className="font-bold mb-4 opacity-60 uppercase tracking-wider">Passed Checks</Txt>
          {atsSimulation.passedChecks.map((check, idx) => (
            <CheckItem key={`pass-${idx}`} text={check} passed={true} />
          ))}
          {atsSimulation.passedChecks.length === 0 && (
            <Txt variant="base" className="opacity-70 italic mb-4">No successful checks recorded.</Txt>
          )}
        </VStack>
      </View>

      {/* Quality Analysis */}
      <Txt variant="xl" className="font-bold mb-4 px-1">Content Quality Analysis</Txt>
      {qualityAnalysis.map((item, idx) => (
        <View key={idx} className="bg-base-200 p-5 rounded-2xl mb-4 border border-base-300">
          <HStack align="center" spacing={10} className="mb-2">
            <View className="bg-primary/10 w-8 h-8 rounded-full items-center justify-center">
              <MaterialIcons name="rule" size={16} color={colors.primary} />
            </View>
            <Txt variant="base" className="font-bold">{item.category}</Txt>
          </HStack>
          <Txt variant="sm" className="opacity-80 leading-relaxed ml-10">{item.feedback}</Txt>
        </View>
      ))}

    </ScrollView>
  );
}
