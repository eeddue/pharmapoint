import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AvatarIcon } from "../constants/icons";
import { COLORS } from "../constants";

const UserAvatar = ({ avatar }) => {
  return (
    <View style={styles.avatar}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={{ width: 50, height: 50 }} />
      ) : (
        <Image source={AvatarIcon} style={styles.image} />
      )}
    </View>
  );
};

export default UserAvatar;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
    overflow: "hidden",
  },
  image: {
    width: 35,
    height: 35,
    tintColor: COLORS.black,
  },
});
