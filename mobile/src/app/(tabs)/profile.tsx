import { View, ScrollView, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useColorScheme } from "nativewind";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Txt } from "../../components/common/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Avatar from "@/components/ui/data-display/Avatar";
import Button from "@/components/ui/buttons/Button";
import Switch from "@/components/ui/inputs/Switch";
import { HStack, VStack } from "@/components/ui/layout/Stack";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout } = useAuthStore();
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
                name={user?.name}
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
          </View>

          <Button
            label="Log Out"
            variant="error"
            icon="logout"
            onPress={handleLogout}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </View>
  );
}
