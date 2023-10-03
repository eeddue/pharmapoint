import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";
import * as Icons from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import commaNumber from "comma-number";
import { useAppContext } from "../context/AppContext";
import { calculateDistance, getWorkingHours } from "../helpers";
import { PharmacyIcon } from "../constants/icons";

const PharmacyItem = ({ pharmacy }) => {
  const navigation = useNavigation();
  const { location } = useAppContext();

  const distance = calculateDistance(
    location.latitude,
    location.longitude,
    parseFloat(pharmacy.location.latitude),
    parseFloat(pharmacy.location.longitude)
  );

  const renderRating = () => {
    return (
      <View style={{ flexDirection: "row", marginRight: 5 }}>
        {[...Array(5)].map((_, index) => {
          const isChecked =
            index + 1 <=
            parseInt(pharmacy?.total_stars) / pharmacy.review_count;
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
      <View style={styles.avatarView}>
        <Image source={PharmacyIcon} style={styles.image} />
      </View>
      <View style={{ marginLeft: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {renderRating()}
          <Text style={styles.reviews}>
            ({commaNumber(pharmacy?.review_count)} reviews)
          </Text>
        </View>
        <Text style={styles.name}>{pharmacy?.name}</Text>
        <Text style={styles.distance}>
          {distance}km away |{" "}
          <Text style={{ fontSize: 10 }}>
            {getWorkingHours(pharmacy.openingTime, pharmacy.closingTime)}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PharmacyItem;

const styles = StyleSheet.create({
  avatarView: {
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
    ...FONTS.Bold,
  },
  distance: {
    ...FONTS.Regular,
    fontSize: 10,
    color: COLORS.ltblack,
  },
});
