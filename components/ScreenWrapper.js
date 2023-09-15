import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";

const ScreenWrapper = ({ children }) => {
  if (Platform.OS === "android") return;
  <View style={{ flex: 1, paddingTop: StatusBar.currentHeight }}>
    {children}
  </View>;

  return <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>;
};

export default ScreenWrapper;

const styles = StyleSheet.create({});
