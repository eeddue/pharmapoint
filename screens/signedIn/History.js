import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import AccessDenied from "../../components/AccessDenied";

const History = () => {
  const { user } = useAppContext();

  if (!user) return <AccessDenied />;
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>History</Text>
      </View>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 20, ...FONTS.Regular, color: COLORS.ltblack }}>
          Coming soon
        </Text>
      </View>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 20,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
