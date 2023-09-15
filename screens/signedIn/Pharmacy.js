import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { COLORS, FONTS } from "../../constants";
import * as Icons from "@expo/vector-icons";
import PharmacyItem from "../../components/PharmacyItem";
import PharmacyProducts from "./PharmacyProducts";
import Reviews from "./Reviews";
import { useAppContext } from "../../context/AppContext";
import { getCurrentLocation } from "../../helpers";

const Tab = createMaterialTopTabNavigator();

const Pharmacy = ({ route, navigation }) => {
  const { pharmacy } = route.params;
  const { location, setLocation } = useAppContext();

  const handleNext = async () => {
    if (!location) {
      await getCurrentLocation()
        .then((coords) => {
          setLocation(coords);
          navigation.navigate("Maps", {
            destination: {
              latitude: pharmacy.location.lat,
              longitude: pharmacy.location.lon,
            },
          });
        })
        .catch((error) => console.log(error));
    } else {
      navigation.navigate("Maps", {
        destination: {
          latitude: pharmacy.location.lat,
          longitude: pharmacy.location.lon,
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Pharmacy</Text>
        <Pressable onPress={handleNext}>
          <Text style={[styles.headerText, { color: COLORS.red }]}>Go</Text>
        </Pressable>
      </View>
      <View style={{ padding: 10 }}>
        <PharmacyItem pharmacy={pharmacy} />
      </View>
      <View style={{ height: 10 }} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.red,
          tabBarInactiveTintColor: COLORS.ltblack,
          tabBarIndicatorStyle: { backgroundColor: COLORS.red },
          tabBarPressColor: COLORS.gray,
          tabBarStyle: {
            borderBottomColor: COLORS.gray,
            borderBottomWidth: 1,
            elevation: 0,
          },
        }}
      >
        <Tab.Screen
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={[
                  styles.label,
                  { color: focused ? COLORS.red : COLORS.ltblack },
                ]}
              >
                Products
              </Text>
            ),
          }}
          name="PharmacyProducts"
          component={PharmacyProducts}
          initialParams={{ pharmacy }}
        />
        <Tab.Screen
          options={{
            tabBarLabel: ({ focused }) => (
              <Text
                style={[
                  styles.label,
                  { color: focused ? COLORS.red : COLORS.ltblack },
                ]}
              >
                Reviews
              </Text>
            ),
          }}
          name="Reviews"
          component={Reviews}
          initialParams={{ pharmacy }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Pharmacy;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 20,
  },
  label: {
    fontSize: 16,
    ...FONTS.SemiBold,
  },
});
