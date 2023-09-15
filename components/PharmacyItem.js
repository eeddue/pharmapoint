import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import PharmacyAvatar from "./PharmacyAvatar";
import { COLORS, FONTS } from "../constants";
import * as Icons from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import commaNumber from "comma-number";

const PharmacyItem = ({ pharmacy }) => {
  const navigation = useNavigation();

  const renderRating = () => {
    return (
      <View style={{ flexDirection: "row", marginRight: 5 }}>
        {[...Array(5)].map((_, index) => {
          const isChecked = index + 1 <= parseInt(pharmacy?.rating);
          return (
            <Icons.AntDesign
              key={index}
              name={isChecked ? "star" : "staro"}
              size={15}
              color={isChecked ? "orange" : COLORS.ltblack}
            />
          );
        })}
      </View>
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate("Pharmacy", { pharmacy })}
      style={styles.item}
    >
      <PharmacyAvatar avatar={pharmacy.pharm_img} />
      <View style={{ marginLeft: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {renderRating()}
          <Text style={styles.reviews}>
            ({commaNumber(pharmacy?.review_count)} reviews)
          </Text>
        </View>
        <Text style={styles.name}>{pharmacy?.pharmacy_name}</Text>
        <Text style={styles.distance}>
          2km away |{" "}
          <Text style={{ fontSize: 10 }}>{pharmacy?.working_hours}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PharmacyItem;

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    flexDirection: "row",
  },
  reviews: {
    fontSize: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  rateIcon: {
    width: 10,
    height: 10,
    marginRight: 2,
  },
  name: {
    fontSize: 13,
    marginVertical: 3,
    ...FONTS.Bold,
  },
  distance: {
    ...FONTS.Regular,
    fontSize: 12,
    color: COLORS.ltblack,
  },
});
