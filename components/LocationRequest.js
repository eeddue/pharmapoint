import { Image, TouchableOpacity, StyleSheet, Text, View } from "react-native";
import React from "react";
import { COLORS, FONTS } from "../constants";
import { AppIcon } from "../constants/icons";

const LocationRequest = ({ getLocation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, marginTop: -20 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <Image source={AppIcon} style={styles.image} />
        <Text style={styles.text}>
          This app requires location permission for usage. Please allow location
          access to continue.
        </Text>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={getLocation}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Allow</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequest;

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 10,
    ...FONTS.Regular,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    height: 45,
    backgroundColor: COLORS.red,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    borderRadius: 10,
    width: "100%",
  },
  buttonText: {
    fontSize: 15,
    ...FONTS.SemiBold,
    color: COLORS.white,
  },
  image: {
    width: 200,
    alignSelf: "center",
    height: 200,
    alignSelf: "center",
    marginVertical: 30,
  },
});
