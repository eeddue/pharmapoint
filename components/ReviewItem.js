import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";
import * as Icons from "@expo/vector-icons";
import { AvatarIcon } from "../constants/icons";
import moment from "moment";

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
        <Image source={AvatarIcon} style={styles.avatar} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.flexView}>
          <Text style={styles.name}>{review.reviewer.username}</Text>
          <Text style={styles.time}>{moment(review.createdAt).fromNow()}</Text>
        </View>
        <Text style={styles.desc}>{review.description}</Text>
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
  avatar: {
    width: 35,
    height: 35,
    tintColor: COLORS.ltblack,
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
