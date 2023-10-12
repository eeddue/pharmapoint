import { ActivityIndicator, Text, View } from "react-native";
import React, { Component } from "react";
import { COLORS } from "../constants";

export const LoadingMore = () => {
  return (
    <ActivityIndicator
      size={30}
      color={COLORS.red}
      style={{ marginVertical: 20 }}
    />
  );
};

export default LoadingMore;
