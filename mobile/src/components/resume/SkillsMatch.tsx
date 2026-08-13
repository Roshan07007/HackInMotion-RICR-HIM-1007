import React from "react";
import { View, ScrollView } from "react-native";
import { Txt } from "@/components/common/Typography";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";
import { ResumeAnalysisData } from "@/store/useResumeStore";

interface SkillsMatchProps {
  analysisResult: ResumeAnalysisData;
}

export default function SkillsMatch({ analysisResult }: SkillsMatchProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const { skillMatch, matchExplanations } = analysisResult;

  const Badge = ({ label, type }: { label: string, type: 'success' | 'error' | 'warning' }) => (
    <View 
      style={{ 
        backgroundColor: colors[type] + '15', 
        borderColor: colors[type] + '30',
        borderWidth: 1,
      }} 
      className="px-3 py-1.5 rounded-full mr-2 mb-2"
    >
      <Txt variant="sm" style={{ color: colors[type] }}>{label}</Txt>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
      
      {/* Overview Card */}
      <View className="bg-base-200 rounded-2xl p-5 mb-6 border border-base-300">
        <HStack align="center" spacing={12} className="mb-4">
          <View className="w-10 h-10 rounded-full items-center justify-center bg-primary/10">
            <MaterialIcons name="radar" size={24} color={colors.primary} />
          </View>
          <VStack>
            <Txt variant="lg" className="font-bold">Keyword Coverage</Txt>
            <Txt variant="sm" className="opacity-70">{skillMatch.keywordCoveragePercentage}% Match with Job Description</Txt>
          </VStack>
        </HStack>
        
        <View className="w-full h-2 bg-base-100 rounded-full overflow-hidden">
          <View 
            className="h-full rounded-full bg-primary" 
            style={{ width: `${skillMatch.keywordCoveragePercentage}%` }} 
          />
        </View>
      </View>

      {/* Strong Matches */}
      <View className="mb-6">
        <HStack align="center" spacing={8} className="mb-3">
          <MaterialIcons name="check-circle" size={20} color={colors.success} />
          <Txt variant="lg" className="font-bold">Verified Skills</Txt>
        </HStack>
        <View className="flex-row flex-wrap">
          {skillMatch.strongMatches.map((skill, idx) => (
            <Badge key={`strong-${idx}`} label={skill} type="success" />
          ))}
          {skillMatch.strongMatches.length === 0 && (
            <Txt variant="base" className="opacity-60 italic">No strong matches found.</Txt>
          )}
        </View>
      </View>

      {/* Missing Skills */}
      <View className="mb-6">
        <HStack align="center" spacing={8} className="mb-3">
          <MaterialIcons name="cancel" size={20} color={colors.error} />
          <Txt variant="lg" className="font-bold">Missing Skills</Txt>
        </HStack>
        <View className="flex-row flex-wrap">
          {skillMatch.missingSkills.map((skill, idx) => (
            <Badge key={`missing-${idx}`} label={skill} type="error" />
          ))}
          {skillMatch.missingSkills.length === 0 && (
            <Txt variant="base" className="opacity-60 italic">No critical skills missing!</Txt>
          )}
        </View>
      </View>

      {/* Weak Evidence */}
      {skillMatch.weakEvidence.length > 0 && (
        <View className="mb-8">
          <HStack align="center" spacing={8} className="mb-3">
            <MaterialIcons name="warning" size={20} color={colors.warning} />
            <Txt variant="lg" className="font-bold">Weak Evidence</Txt>
          </HStack>
          {skillMatch.weakEvidence.map((item, idx) => (
            <View key={idx} className="bg-warning/10 p-4 rounded-xl border border-warning/20 mb-3">
              <Txt variant="base" className="font-bold mb-1" style={{ color: colors.warning }}>{item.skill}</Txt>
              <Txt variant="sm" className="opacity-80 leading-relaxed">{item.reason}</Txt>
            </View>
          ))}
        </View>
      )}

      {/* Match Explanations */}
      <View className="mb-4">
        <Txt variant="xl" className="font-bold mb-4">Detailed Analysis</Txt>
        {matchExplanations.map((explanation, idx) => (
          <View key={idx} className="bg-base-200 p-4 rounded-xl mb-3 border border-base-300">
            <Txt variant="base" className="font-bold mb-2">{explanation.category}</Txt>
            <Txt variant="sm" className="opacity-70 leading-relaxed">{explanation.explanation}</Txt>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}
