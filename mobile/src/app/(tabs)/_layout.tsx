import { Tabs, Redirect } from "expo-router";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "../../constants/Colors";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import ClassicTabBar from "../../components/ui/ClassicTabBar";

const TabLayout = () => {
  const { colorScheme } = useColorScheme();
  const insets = useSafeAreaInsets();
  const colors = Colors[colorScheme ?? "light"];
  const { user, isCheckingAuth } = useAuthStore();

  if (!isCheckingAuth && !user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      tabBar={(props) => <ClassicTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.base100 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="analyzer" options={{ title: "AI Scan" }} />
      <Tabs.Screen name="saved" options={{ title: "Saved" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
};

export default TabLayout;
