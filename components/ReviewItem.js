import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";
import * as Icons from "@expo/vector-icons";

const ReviewItem = ({ review }) => {
  const renderRating = () => {
    return (
      <View style={{ flexDirection: "row", marginRight: 5 }}>
        {[...Array(5)].map((_, index) => {
          const isChecked = index + 1 <= review.rating;
          return (
            <Icons.AntDesign
              key={index}
              name={isChecked ? "star" : "staro"}
              size={10}
              color={isChecked ? "orange" : COLORS.ltblack}
            />
          );
        })}
      </View>
    );
  };
  return (
    <View style={styles.item}>
      <View style={styles.avatarView}>
        <Image source={{ uri: review.image }} style={styles.image} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.flexView}>
          <Text style={styles.name}>{review.name}</Text>
          <Text style={styles.time}>6d ago</Text>
        </View>
        <Text style={styles.desc}>{review.desc}</Text>
        {renderRating()}
      </View>
    </View>
  );
};

export default ReviewItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  avatarView: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.gray,
    overflow: "hidden",
    borderColor: COLORS.gray,
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  flexView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  name: {
    ...FONTS.SemiBold,
    fontSize: 14,
  },
  time: {
    fontSize: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  desc: {
    ...FONTS.Regular,
    fontSize: 14,
    color: COLORS.ltblack,
  },
});
