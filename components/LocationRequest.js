import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS } from "../constants";
import { NoLocationIcon } from "../constants/icons";
import { getCurrentLocation, showToast } from "../helpers";
import { useAppContext } from "../context/AppContext";

const LocationRequest = () => {
  const [loading, setLoading] = useState(false);
  const { setLocation } = useAppContext();

  const handleLocation = async () => {
    setLoading(true);
    await getCurrentLocation()
      .then((location) => setLocation(location))
      .catch(() =>
        showToast("error", "There was an error.", "Please try again.")
      )
      .finally(() => setLoading(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={NoLocationIcon}
          style={{ width: 150, height: 150, tintColor: COLORS.red }}
        />
      </View>
      <View style={{ flex: 1, padding: 10, justifyContent: "center" }}>
        <Text style={styles.title}>
          This application uses your current location for the best experience.
        </Text>
        <Text style={styles.label}>
          Please allow us to access your location to continue.
        </Text>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={handleLocation}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Allow</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationRequest;

const styles = StyleSheet.create({
  title: {
    ...FONTS.SemiBold,
    margin: 10,
    textAlign: "center",
    fontSize: 18,
  },
  label: {
    ...FONTS.Regular,
    textAlign: "center",
    fontSize: 14,
    color: COLORS.ltblack,
  },
  button: {
    backgroundColor: COLORS.red,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    ...FONTS.SemiBold,
  },
});
