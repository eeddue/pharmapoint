import { Image, StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home, Inbox, Cart, History, Profile } from "../screens/signedIn";
import { COLORS, FONTS } from "../constants";
import {
  CartFillIcon,
  CartIcon,
  ChatFillIcon,
  ChatIcon,
  HistoryFillIcon,
  HistoryIcon,
  HomeFillIcon,
  HomeIcon,
  UserFillIcon,
  UserIcon,
} from "../constants/icons";
import { useAppContext } from "../context/AppContext";

const Tab = createBottomTabNavigator();

const UserHomeNavigation = () => {
  const { cartItems } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.red,
        tabBarInactiveTintColor: COLORS.ltblack,
        tabBarStyle: styles.tabStyle,
        tabBarLabelStyle: styles.labelStyle,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? HomeFillIcon : HomeIcon}
              style={[
                styles.image,
                { tintColor: focused ? COLORS.red : COLORS.ltblack },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={Inbox}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? ChatFillIcon : ChatIcon}
              style={[
                styles.image,
                { tintColor: focused ? COLORS.red : COLORS.ltblack },
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? CartFillIcon : CartIcon}
              style={[
                styles.image,
                { tintColor: focused ? COLORS.red : COLORS.ltblack },
              ]}
            />
          ),
          tabBarBadge: cartItems?.length,
          tabBarBadgeStyle: styles.badgeStyle,
        }}
      />
      {/* <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? HistoryFillIcon : HistoryIcon}
              style={[
                styles.image,
                {
                  tintColor: focused ? COLORS.red : COLORS.ltblack,
                },
              ]}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={focused ? UserFillIcon : UserIcon}
              style={[
                styles.image,
                { tintColor: focused ? COLORS.red : COLORS.ltblack },
              ]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserHomeNavigation;

const styles = StyleSheet.create({
  image: {
    width: 25,
    height: 25,
  },
  tabStyle: {
    position: "absolute",
    height: 60,
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 5,
    elevation: 0,
    paddingBottom: 7,
    backgroundColor: COLORS.white,
  },
  badgeStyle: {
    backgroundColor: COLORS.red,
    borderColor: COLORS.white,
    borderWidth: 1,
    fontSize: 12,
  },
  labelStyle: {
    ...FONTS.Regular,
  },
});
