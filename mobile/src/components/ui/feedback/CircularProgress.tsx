import React from "react";
import { View } from "react-native";
import { useColorScheme } from "nativewind";
import { Colors } from "../../../constants/Colors";
import { Txt } from "../../common/Typography";

export interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export default function CircularProgress({ progress, size = 60, strokeWidth = 6, color }: CircularProgressProps) {
  const { colorScheme } = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: strokeWidth,
        borderColor: color || theme.primary,
        borderTopColor: theme.base300,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ rotate: "45deg" }], 
      }}
    >
      <View style={{ transform: [{ rotate: "-45deg" }] }}>
         <Txt color={theme.baseContent} weight="bold" style={{ fontSize: size * 0.25 }}>
           {Math.round(progress)}%
         </Txt>
      </View>
    </View>
  );
}
