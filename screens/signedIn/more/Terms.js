import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS } from "../../../constants";

const Terms = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Terms of use</Text>
        <View style={{ width: 25 }} />
      </View>
    </View>
  );
};

export default Terms;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    ...FONTS.SemiBold,
    fontSize: 15,
  },
});
