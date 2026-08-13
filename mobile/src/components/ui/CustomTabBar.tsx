import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Colors } from "../../constants/Colors";
import { getTabConfig } from "../../config/tabNavigation";
import { BlurView } from "expo-blur";
import { Txt } from "./../common/Typography";

const TabItem = ({
  isFocused,
  onPress,
  onLongPress,
  iconName,
  label,
  colors,
}: any) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
      activeOpacity={0.8}
    >
      <View style={styles.tabItem}>
        <View
          style={[
            styles.iconWrapper,
            isFocused && {
              backgroundColor: colors.primary + '15',
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 24,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6
            },
          ]}
        >
          <Ionicons
            name={iconName as any}
            size={isFocused ? 20 : 24}
            color={isFocused ? colors.primary : colors.baseContent + '80'}
          />
          {isFocused && (
            <Txt style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>
              {label}
            </Txt>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CenterButton = ({ colors, onPress }: any) => {
  return (
    <View style={styles.centerButtonWrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.centerButton,
          {
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
          },
        ]}
      >
        <Ionicons name="add" size={32} color={colors.primaryContent} />
      </TouchableOpacity>
    </View>
  );
};

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
  showCenterButton = true,
  onCenterButtonPress,
}: any) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = Colors[isDark ? "dark" : "light"];

  const currentRoute = state.routes[state.index];
  const currentOptions = descriptors[currentRoute.key].options;
  if (currentOptions.tabBarStyle?.display === "none") {
    return null;
  }

  const bottomOffset = insets.bottom > 0 ? insets.bottom : 12;
  const totalTabBarHeight = bottomOffset + 70; // 70 is the height of the tab bar container

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        style={{
          position: "absolute",
          bottom: bottomOffset,
          left: 20,
          right: 20,
          borderRadius: 35,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: colors.baseContent + '10',
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
          backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)',
        }}
      >
        <BlurView
          intensity={100}
          tint={isDark ? "dark" : "light"}
          style={{
            flexDirection: "row",
            alignItems: "center",
            height: 60,
            paddingHorizontal: 8,
          }}
        >
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            if (
              options.href === null ||
              options.tabBarItemStyle?.display === "none"
            )
              return null;

            const tabConfig = getTabConfig(route.name);
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                  ? options.title
                  : tabConfig?.title || route.name;

            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const iconName = isFocused
              ? tabConfig?.baseIcon
              : `${tabConfig?.baseIcon}-outline`;

            return (
              <React.Fragment key={route.key}>
                {showCenterButton &&
                  index === Math.floor(state.routes.length / 2) && (
                    <CenterButton colors={colors} onPress={onCenterButtonPress} />
                  )}
                <TabItem
                  isFocused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  iconName={iconName}
                  label={label as string}
                  colors={colors}
                />
              </React.Fragment>
            );
          })}
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 40,
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.10,
    // shadowRadius: 10,
    elevation: 1,
    left: 0,
    right: 0,
    height: 70,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    marginTop: 6,
    position: "absolute",
    bottom: -6,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -40,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 15,
  },
});
