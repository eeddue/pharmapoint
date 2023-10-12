import { RefreshControl } from "react-native";
import React from "react";
import { COLORS } from "../constants";

const RefreshComponent = ({ refreshing, onRefresh }) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[COLORS.red]}
      tintColor={COLORS.red}
    />
  );
};

export default RefreshComponent;
