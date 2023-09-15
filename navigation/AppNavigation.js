import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Login,
  Register,
  Forgot,
  Reset,
  Onboarding,
} from "../screens/signedOut";
import UserHomeNavigation from "./UserHomeNavigation";
import {
  Chat,
  Pharmacies,
  Pharmacy,
  Product,
  Maps,
  Products,
} from "../screens/signedIn";
import { useAppContext } from "../context/AppContext";

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const { launched } = useAppContext();
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
      initialRouteName={launched !== null ? "Bottom" : "Onboarding"}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Bottom" component={UserHomeNavigation} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Forgot" component={Forgot} />
      <Stack.Screen name="Reset" component={Reset} />
      <Stack.Screen name="Chat" component={Chat} />
      <Stack.Screen name="Pharmacies" component={Pharmacies} />
      <Stack.Screen name="Pharmacy" component={Pharmacy} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Maps" component={Maps} />
    </Stack.Navigator>
  );
};

export default AppNavigation;

const styles = StyleSheet.create({});
