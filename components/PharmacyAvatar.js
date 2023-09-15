import { Image, StyleSheet, View } from "react-native";
import React from "react";
import { PharmacyIcon } from "../constants/icons";
import { COLORS } from "../constants";

const PharmacyAvatar = ({ avatar }) => {
  return (
    <View style={styles.avatar}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatarImage} />
      ) : (
        <Image source={PharmacyIcon} style={styles.image} />
      )}
    </View>
  );
};

export default PharmacyAvatar;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
    overflow: "hidden",
  },
  image: {
    width: 30,
    height: 30,
    tintColor: COLORS.black,
  },
  avatarImage: { width: 50, height: 50, resizeMode: "contain" },
});
