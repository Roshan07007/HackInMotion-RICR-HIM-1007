import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import Button from "../../components/ui/buttons/Button";
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
    jobRoles: [],
    technologies: [],
    targetCompanies: [],
    experienceLevel: "",
    expectedSalary: "",
  };

  const [preferences, setPreferences] = useState(defaultPrefs);

  const toggleTag = (category: 'jobRoles' | 'technologies' | 'targetCompanies', tag: string) => {
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

  const TagGroup = ({ title, icon, tags, category }: any) => (
    <VStack className="mb-6">
      <HStack align="center" spacing={8} className="mb-3">
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Txt variant="xl" className="font-bold">{title}</Txt>
      </HStack>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {tags.map((tag: string) => {
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
    </VStack>
  );

  return (
    <>
      <ScreenHeader title="Personalize Feed" />
      <ScrollContainer contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-base-100">
        <VStack className="mb-8">
          <Txt variant="2xl" className="font-extrabold mb-2">Tailor Your Experience</Txt>
          <Txt variant="base" className="opacity-70">
            Tell us what you're looking for to get the best job recommendations and AI mock interviews.
          </Txt>
        </VStack>

        <TagGroup title="Target Roles" icon="briefcase" tags={roles} category="jobRoles" />
        <TagGroup title="Technologies" icon="code-slash" tags={techs} category="technologies" />

        <Button
          label="Save Preferences"
          onPress={handleSave}
          isLoading={loading}
          variant="primary"
          icon="save-outline"
          style={{ marginTop: 24, marginBottom: 40 }}
        />
      </ScrollContainer>
    </>
  );
}
