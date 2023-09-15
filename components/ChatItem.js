import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";
import { useNavigation } from "@react-navigation/native";

const ChatItem = ({ chat }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate("Chat", { chat })}
      style={styles.item}
    >
      <View style={styles.imageView}>
        <Image source={{ uri: chat.image }} style={styles.image} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.time}>11:23AM</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {chat.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: 5,
  },
  imageView: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.gray,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 18,
    ...FONTS.SemiBold,
  },
  message: {
    marginRight: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  time: {
    marginLeft: "auto",
    fontSize: 10,
    ...FONTS.Regular,
  },
});
