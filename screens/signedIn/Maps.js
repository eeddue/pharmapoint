import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, SHADOW, FONTS } from "../../constants";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { LocationIcon } from "../../constants/icons";
import { useAppContext } from "../../context/AppContext";

const GOOGLE_MAPS_APIKEY_IOS =
  Platform.OS === "android"
    ? "AIzaSyA1qtmM3mvXoTqeZfTlT7slTIbyc2RADDo"
    : "AIzaSyBxtgGL5SSY6LoNnEHBplqjSG53JF01-Wg";

const Maps = ({ route, navigation }) => {
  const { location } = useAppContext();
  const [distance, setDistance] = useState("");
  const [time, setTime] = useState("");
  const mapRef = useRef(null);

  const { destination } = route.params;

  useEffect(() => {
    mapRef?.current?.fitToCoordinates([location, destination], {
      edgePadding: {
        top: 50,
        right: 50,
        left: 50,
        bottom: 50,
      },
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.goback}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        {distance && time ? (
          <>
            <View style={styles.container}>
              <Text style={styles.headerLabels}>{parseInt(time)} mins</Text>
            </View>
            <View style={styles.container}>
              <Text style={styles.headerLabels}>{distance} km</Text>
            </View>
          </>
        ) : null}
      </View>

      <MapView ref={mapRef} initialRegion={location} style={{ flex: 1 }}>
        <Marker coordinate={destination}>
          <Image
            source={LocationIcon}
            tintColor={COLORS.red}
            style={styles.marker}
          />
        </Marker>

        <Marker coordinate={location} pinColor={COLORS.red} />

        <MapViewDirections
          origin={location}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY_IOS}
          strokeColor={COLORS.red}
          strokeWidth={3}
          onReady={({ distance, duration }) => {
            setTime(duration);
            setDistance(distance);
          }}
        />
      </MapView>
    </View>
  );
};

export default Maps;

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    flexDirection: "row",
    padding: 10,
    top: 0,
    width: "100%",
    zIndex: 100,
  },
  goback: {
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  marker: {
    width: 30,
    height: 30,
  },
  container: {
    padding: 10,
    height: 40,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  headerLabels: {
    fontSize: 14,
    ...FONTS.SemiBold,
  },
});
