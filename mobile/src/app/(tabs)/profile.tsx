import { View, ScrollView, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useColorScheme } from "nativewind";
import { Txt } from "../../components/common/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import Avatar from "@/components/ui/data-display/Avatar";
import Button from "@/components/ui/buttons/Button";
import Switch from "@/components/ui/inputs/Switch";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomModal from "@/components/ui/BottomModal";
import { ToastAndroid, Platform } from "react-native";
import React, { useState } from "react";
import { toast } from "@/utils/toast";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const LOCK_DURATIONS = [
  { label: "Immediately", value: 0 },
  { label: "After 1 minute", value: 1 },
  { label: "After 5 minutes", value: 5 },
  { label: "After 15 minutes", value: 15 },
];

export default function Profile() {
  const { user, logout, isBiometricEnabled, setBiometricEnabled, lockDuration, setLockDuration } = useAuthStore();
  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleToggleTheme = () => {
    const newTheme = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(newTheme);
    AsyncStorage.setItem("theme", newTheme);
  };

  const handleLogout = async () => {
    await logout();
  };

  const [lockDurationModalOpen, setLockDurationModalOpen] = useState(false);

  const toggleBiometric = async (value: boolean) => {
    try {
      await setBiometricEnabled(value);
      if (Platform.OS === 'android') {
        ToastAndroid.show(`App Lock ${value ? 'Enabled' : 'Disabled'}`, ToastAndroid.SHORT);
      } else {
        toast.success(`App Lock ${value ? 'Enabled' : 'Disabled'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.base100 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Header */}
        <View style={{ paddingTop: insets.top + 20, paddingBottom: 32, paddingHorizontal: 24, backgroundColor: colors.primary + '10' }} className="rounded-b-[40px] items-center border-b border-primary/20">
          <View className="relative mb-4">
            <View className="w-28 h-28 rounded-full items-center justify-center border-4 shadow-lg overflow-hidden" style={{ borderColor: colors.base100, backgroundColor: colors.base200, shadowColor: colors.primary }}>
              <Avatar
                url={user?.avatar?.url}
                size={104}
                initials={user?.name?.charAt(0)}
              />
            </View>
            <TouchableOpacity 
              onPress={() => router.push("/(auth)/edit-profile")}
              className="absolute bottom-0 right-0 p-2 rounded-full border-2"
              style={{ backgroundColor: colors.secondary, borderColor: colors.base100 }}
            >
              <Ionicons name="pencil" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          <VStack align="center">
            <Txt variant="2xl" className="text-2xl font-bold mb-1">
              {user?.name || "User Name"}
            </Txt>
            <HStack align="center" spacing={6} className="mt-1 opacity-70">
              <MaterialIcons name="security" size={14} color={colors.primary} />
              <Txt variant="caption" className="font-medium text-primary">
                {user?.role === "admin" ? "Administrator" : "Standard User"}
              </Txt>
            </HStack>
          </VStack>
        </View>

        <View style={{ padding: 24 }}>
          {/* Personal Info */}
          <View className="bg-base-200 rounded-2xl p-6 mb-6 shadow-sm">
            <HStack justify="space-between" align="center" className="mb-4">
              <Txt variant="xl" className="font-bold">Personal Information</Txt>
              <TouchableOpacity onPress={() => router.push("/(auth)/edit-profile")}>
                <Txt variant="caption" className="text-primary font-bold">Edit</Txt>
              </TouchableOpacity>
            </HStack>
            
            <VStack spacing={16}>
              <HStack align="center" spacing={12}>
                <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                  <Ionicons name="person" size={20} color={colors.baseContent} style={{ opacity: 0.6 }} />
                </View>
                <VStack>
                  <Txt variant="caption" className="opacity-60 mb-0.5">Full Name</Txt>
                  <Txt variant="base" className="font-medium">{user?.name}</Txt>
                </VStack>
              </HStack>

              <HStack align="center" spacing={12}>
                <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                  <Ionicons name="mail" size={20} color={colors.baseContent} style={{ opacity: 0.6 }} />
                </View>
                <VStack>
                  <Txt variant="caption" className="opacity-60 mb-0.5">Email Address</Txt>
                  <Txt variant="base" className="font-medium">{user?.email}</Txt>
                </VStack>
              </HStack>

              <HStack align="center" spacing={12}>
                <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                  <Ionicons name="call" size={20} color={colors.baseContent} style={{ opacity: 0.6 }} />
                </View>
                <VStack>
                  <Txt variant="caption" className="opacity-60 mb-0.5">Phone Number</Txt>
                  <Txt variant="base" className="font-medium">{user?.phone || "Not provided"}</Txt>
                </VStack>
              </HStack>
            </VStack>
          </View>

          {/* Bio & Socials */}
          {(user?.bio || user?.github || user?.linkedin || user?.website || user?.otherLink) && (
            <View className="bg-base-200 rounded-2xl p-6 mb-6 shadow-sm">
              <Txt variant="xl" className="font-bold mb-4">About & Links</Txt>
              
              {user.bio && (
                <VStack className="mb-4">
                  <Txt variant="caption" className="opacity-60 mb-1 uppercase tracking-wider font-semibold">Bio</Txt>
                  <Txt variant="base" className="leading-5">{user.bio}</Txt>
                </VStack>
              )}

              {(user.github || user.linkedin || user.website || user.otherLink) && (
                <VStack spacing={12}>
                  <Txt variant="caption" className="opacity-60 uppercase tracking-wider font-semibold">Social Links</Txt>
                  <View className="flex-row flex-wrap gap-2">
                    {user.github && (
                      <TouchableOpacity onPress={() => Linking.openURL(user.github!)} className="bg-base-100 border border-base-300 px-3 py-2 rounded-xl flex-row items-center gap-2">
                        <Ionicons name="logo-github" size={16} color={colors.baseContent} />
                        <Txt variant="sm" className="font-medium">GitHub</Txt>
                      </TouchableOpacity>
                    )}
                    {user.linkedin && (
                      <TouchableOpacity onPress={() => Linking.openURL(user.linkedin!)} className="bg-base-100 border border-base-300 px-3 py-2 rounded-xl flex-row items-center gap-2">
                        <Ionicons name="logo-linkedin" size={16} color={colors.baseContent} />
                        <Txt variant="sm" className="font-medium">LinkedIn</Txt>
                      </TouchableOpacity>
                    )}
                    {user.website && (
                      <TouchableOpacity onPress={() => Linking.openURL(user.website!)} className="bg-base-100 border border-base-300 px-3 py-2 rounded-xl flex-row items-center gap-2">
                        <Ionicons name="globe-outline" size={16} color={colors.baseContent} />
                        <Txt variant="sm" className="font-medium">Website</Txt>
                      </TouchableOpacity>
                    )}
                    {user.otherLink && (
                      <TouchableOpacity onPress={() => Linking.openURL(user.otherLink!)} className="bg-base-100 border border-base-300 px-3 py-2 rounded-xl flex-row items-center gap-2">
                        <Ionicons name="link" size={16} color={colors.baseContent} />
                        <Txt variant="sm" className="font-medium">Link</Txt>
                      </TouchableOpacity>
                    )}
                  </View>
                </VStack>
              )}
            </View>
          )}

          {/* Resume */}
          <View className="bg-base-200 rounded-2xl p-6 mb-6 shadow-sm">
            <Txt variant="xl" className="font-bold mb-4">Default Resume</Txt>
            {user?.resume?.url ? (
              <TouchableOpacity 
                onPress={() => router.push({ pathname: '/doc-viewer', params: { url: user.resume!.url! } })}
                className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
                    <Ionicons name="document-text" size={20} color={colors.primary} />
                  </View>
                  <VStack>
                    <Txt variant="base" className="font-semibold text-primary">View Current Resume</Txt>
                    <Txt variant="caption" className="opacity-60 text-primary">PDF Document</Txt>
                  </VStack>
                </View>
                <Ionicons name="open-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            ) : (
              <View className="items-center py-4 opacity-50">
                <Ionicons name="document-outline" size={32} color={colors.baseContent} className="mb-2" />
                <Txt variant="sm">No default resume uploaded</Txt>
                <Txt variant="xs" className="text-center mt-1">Edit your profile to upload one</Txt>
              </View>
            )}
          </View>

          {/* Preferences */}
          <Txt variant="xl" className="font-bold mb-4 ml-2">App Preferences</Txt>
          
          <View className="bg-base-200 rounded-2xl p-4 mb-8 shadow-sm">
            <TouchableOpacity onPress={() => router.push("/(auth)/personalize")}>
              <HStack align="center" justify="space-between" className="py-2 mb-4">
                <HStack align="center" spacing={12}>
                  <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                    <Ionicons name="options" size={20} color={colors.baseContent} />
                  </View>
                  <Txt variant="base" className="font-semibold">Job Preferences</Txt>
                </HStack>
                <Ionicons name="chevron-forward" size={20} color={colors.baseContent} style={{ opacity: 0.5 }} />
              </HStack>
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: colors.base300, opacity: 0.5, marginBottom: 12 }} />

            <HStack align="center" justify="space-between" className="py-2">
              <HStack align="center" spacing={12}>
                <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                  <Ionicons 
                    name={isDark ? "moon" : "sunny"} 
                    size={20} 
                    color={colors.baseContent} 
                  />
                </View>
                <Txt variant="base" className="font-semibold">Dark Mode</Txt>
              </HStack>
              <Switch checked={isDark} onChange={handleToggleTheme} />
            </HStack>

            <View style={{ height: 1, backgroundColor: colors.base300, opacity: 0.5, marginVertical: 12 }} />

            <HStack align="center" justify="space-between" className="py-2">
              <HStack align="center" spacing={12}>
                <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                  <Ionicons 
                    name="lock-closed" 
                    size={20} 
                    color={colors.baseContent} 
                  />
                </View>
                <Txt variant="base" className="font-semibold">App Lock</Txt>
              </HStack>
              <Switch checked={isBiometricEnabled} onChange={toggleBiometric} />
            </HStack>

            {isBiometricEnabled && (
              <>
                <View style={{ height: 1, backgroundColor: colors.base300, opacity: 0.5, marginVertical: 12 }} />
                <TouchableOpacity onPress={() => setLockDurationModalOpen(true)}>
                  <HStack align="center" justify="space-between" className="py-2">
                    <HStack align="center" spacing={12}>
                      <View className="w-10 h-10 rounded-full bg-base-300 items-center justify-center">
                        <Ionicons 
                          name="time-outline" 
                          size={20} 
                          color={colors.baseContent} 
                        />
                      </View>
                      <VStack>
                        <Txt variant="base" className="font-semibold">Lock After</Txt>
                        <Txt variant="caption" className="opacity-60">{LOCK_DURATIONS.find(d => d.value === lockDuration)?.label}</Txt>
                      </VStack>
                    </HStack>
                    <Ionicons name="chevron-forward" size={20} color={colors.baseContent} style={{ opacity: 0.5 }} />
                  </HStack>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Button
            label="Log Out"
            variant="error"
            leftIcon="log-out"
            onPress={handleLogout}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>

      {/* Lock Duration Modal */}
      <BottomModal
        isOpen={lockDurationModalOpen}
        onClose={() => setLockDurationModalOpen(false)}
        heightPercent={0.55}
      >
        <View className="px-5 pt-2 pb-4">
          <Txt variant="lg" className="font-bold mb-4">Lock After</Txt>
          {LOCK_DURATIONS.map((option, idx) => (
            <TouchableOpacity
              key={option.value}
              onPress={async () => {
                await setLockDuration(option.value);
                setLockDurationModalOpen(false);
                if (Platform.OS === 'android') {
                  ToastAndroid.show(`Lock set to: ${option.label}`, ToastAndroid.SHORT);
                } else {
                  toast.success(`Lock set to: ${option.label}`);
                }
              }}
              className="flex-row items-center justify-between py-4 px-2"
              style={{ borderBottomWidth: idx < LOCK_DURATIONS.length - 1 ? 1 : 0, borderBottomColor: colors.base300 }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: lockDuration === option.value ? colors.primary + '20' : 'transparent' }}
                  className="w-9 h-9 rounded-full items-center justify-center"
                >
                  <Ionicons
                    name={option.value === 0 ? "flash" : "timer-outline"}
                    size={20}
                    color={lockDuration === option.value ? colors.primary : colors.baseContent}
                  />
                </View>
                <Txt
                  variant="base"
                  className="font-semibold"
                  style={{ color: lockDuration === option.value ? colors.primary : colors.baseContent }}
                >
                  {option.label}
                </Txt>
              </View>
              {lockDuration === option.value && (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomModal>
    </View>
  );
}
