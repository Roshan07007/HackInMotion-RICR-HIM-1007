import { Ionicons } from "@expo/vector-icons";

export interface TabConfig {
  name: string;
  title: string;
  baseIcon: keyof typeof Ionicons.glyphMap;
}

export const tabNavigationConfig: TabConfig[] = [
  {
    name: "index",
    title: "Home",
    baseIcon: "home",
  },
  {
    name: "analyzer",
    title: "AI Scan",
    baseIcon: "scan",
  },
  {
    name: "saved",
    title: "Saved",
    baseIcon: "bookmark",
  },
  {
    name: "profile",
    title: "Profile",
    baseIcon: "person-circle",
  },
];

export const getTabConfig = (routeName: string) => {
  return tabNavigationConfig.find((tab) => tab.name === routeName);
};
