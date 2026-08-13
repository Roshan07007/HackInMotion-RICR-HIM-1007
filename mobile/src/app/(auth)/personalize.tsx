import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import IconButton from "../../components/ui/buttons/IconButton";
import ScreenHeader from "@/components/common/ScreenHeader";
import { toast } from "@/utils/toast";
import { authService } from "@/services/auth.service";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/Colors";

export default function PersonalizeScreen() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const defaultPrefs = user?.preferences || {
    desiredJobs: [],
    skills: [],
    desiredCompanies: [],
    experienceLevel: "",
    expectedSalary: "",
  };

  const [preferences, setPreferences] = useState(defaultPrefs);

  const toggleTag = (category: 'desiredJobs' | 'skills' | 'desiredCompanies', tag: string) => {
    const list = preferences[category] || [];
    if (list.includes(tag)) {
      setPreferences({ ...preferences, [category]: list.filter((t: string) => t !== tag) });
    } else {
      setPreferences({ ...preferences, [category]: [...list, tag] });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await authService.updateMe({ preferences });
      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Preferences saved successfully!");
        router.back();
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save preferences");
    } finally {
      setLoading(false);
    }
  };

  const roles = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "Mobile Developer", "UI/UX Designer", "DevOps Engineer"];
  const techs = ["React", "React Native", "Node.js", "TypeScript", "Python", "Go", "AWS", "Docker", "MongoDB"];

  const TagGroup = ({ title, icon, tags, category }: any) => {
    const [inputValue, setInputValue] = useState("");
    
    const handleAdd = () => {
      const trimmed = inputValue.trim();
      if (trimmed && !(preferences[category] || []).includes(trimmed)) {
        setPreferences({ ...preferences, [category]: [...(preferences[category] || []), trimmed] });
      }
      setInputValue("");
    };

    return (
      <VStack className="mb-6">
        <HStack align="center" spacing={8} className="mb-3">
          <Ionicons name={icon} size={20} color={colors.primary} />
          <Txt variant="xl" className="font-bold">{title}</Txt>
        </HStack>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {[...new Set([...tags, ...(preferences[category] || [])])].map((tag: string) => {
            const list = preferences[category] || [];
            const isSelected = list.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(category, tag)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isSelected ? colors.primary : colors.base300,
                  backgroundColor: isSelected ? colors.primary + '15' : 'transparent',
                }}
              >
                <Txt variant="base" style={{ color: isSelected ? colors.primary : colors.baseContent, fontWeight: isSelected ? '600' : '400' }}>
                  {tag}
                </Txt>
              </TouchableOpacity>
            );
          })}
        </View>
        <HStack spacing={8} align="center">
          <TextInput
            placeholder={`Add custom ${title.toLowerCase()}...`}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAdd}
            style={{
              flex: 1,
              backgroundColor: isDark ? colors.base200 : colors.base200,
              color: colors.baseContent,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.base300,
            }}
            placeholderTextColor={colors.baseContent + '80'}
          />
          <IconButton 
            icon="add" 
            variant="primary" 
            onPress={handleAdd} 
            disabled={!inputValue.trim()}
          />
        </HStack>
      </VStack>
    );
  };

  return (
    <>
      <ScreenHeader 
        title="Personalize Feed" 
        actions={
          <TouchableOpacity onPress={handleSave} disabled={loading} style={{ opacity: loading ? 0.5 : 1 }}>
            <Txt variant="base" className="font-bold text-primary mr-2">Save</Txt>
          </TouchableOpacity>
        }
      />
      <ScrollContainer contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-base-100">
        <VStack className="mb-8">
          <Txt variant="2xl" className="font-extrabold mb-2">Tailor Your Experience</Txt>
          <Txt variant="base" className="opacity-70">
            Tell us what you're looking for to get the best job recommendations and AI mock interviews.
          </Txt>
        </VStack>

        <TagGroup title="Target Roles" icon="briefcase" tags={roles} category="desiredJobs" />
        <TagGroup title="Technologies" icon="code-slash" tags={techs} category="skills" />

      </ScrollContainer>
    </>
  );
}
