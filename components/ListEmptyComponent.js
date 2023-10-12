import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";

const ListEmptyComponent = ({ loading, text }) => {
  if (loading) return null;
  return <Text style={styles.empty}>{text}</Text>;
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
