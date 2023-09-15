import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Icons from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../constants";
import { CartMinusIcon, CartPlusIcon } from "../constants/icons";

const Navbar = ({ title, isInStore }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.nav}>
      <Pressable onPress={() => navigation.goBack()}>
        <Icons.Ionicons name="arrow-back" size={25} />
      </Pressable>
      <Text numberOfLines={1} style={styles.title}>
        {title}
      </Text>
      <Pressable style={styles.button}>
        <Image
          style={styles.image}
          source={isInStore ? CartMinusIcon : CartPlusIcon}
        />
      </Pressable>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 15,
    ...FONTS.Regular,
  },
  button: {
    width: 60,
    height: 40,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 25,
    height: 25,
    tintColor: COLORS.red,
  },
});
