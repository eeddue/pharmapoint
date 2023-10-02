import { SafeAreaView, StatusBar, View } from "react-native";
import React from "react";

const ScreenWrapper = ({ children, style }) => {
  if (Platform.OS === "android") return;
  <View
    style={{
      flex: 1,
      paddingTop: StatusBar.currentHeight,
      ...style,
    }}
  >
    {children}
  </View>;

  return <SafeAreaView style={{ flex: 1, ...style }}>{children}</SafeAreaView>;
};

export default ScreenWrapper;
