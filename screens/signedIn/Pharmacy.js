import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Rating } from "react-native-ratings";
import * as Icons from "@expo/vector-icons";
import openMap from "react-native-open-maps";
import axios from "axios";

import { COLORS, FONTS, SHADOW } from "../../constants";
import PharmacyItem from "../../components/PharmacyItem";
import PharmacyProducts from "./PharmacyProducts";
import Reviews from "./Reviews";
import { useAppContext } from "../../context/AppContext";
import { showToast } from "../../helpers";

const Tab = createMaterialTopTabNavigator();

const Pharmacy = ({ route, navigation }) => {
  const { pharmacy } = route.params;
  const { user, location } = useAppContext();
  const [reviewing, setReviewing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const isMine =
    user?._id === pharmacy.owner._id || user?.pharmacies.includes(pharmacy._id);

  const handleMaps = async () => {
    if (!location)
      return showToast(
        "error",
        "No location.",
        "Switch on the location of your phone."
      );

    openMap({
      start: `${location.latitude},${location.longitude}`,
      end: `${parseFloat(pharmacy.location.latitude)},${parseFloat(
        pharmacy.location.longitude
      )}`,
      provider: "google",
    });
  };

  const goToChat = () => {
    user
      ? navigation.navigate("Chat", { receiver: pharmacy.owner })
      : navigation.navigate("Login");
  };

  const handleSubmit = async () => {
    if (!review.trim())
      return showToast("error", "Field required", "Write a review to submit.");

    setReviewing(true);
    await axios
      .post(
        "/reviews",
        {
          reviewee: pharmacy._id,
          reviewer: user._id,
          description: review.trim(),
          rating,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      .then(() => {
        setReview("");
        setVisible((prev) => !prev);
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setReviewing(false));
  };

  const handlePress = () => {
    if (!user) return navigation.navigate("Login");
    if (isMine) return navigation.navigate("PharmacyDetails", { pharmacy });
    return setVisible((prev) => !prev);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Pharmacy</Text>

        <Pressable onPress={handlePress}>
          {isMine ? (
            <Icons.Feather name="edit" size={20} color={COLORS.black} />
          ) : (
            <Icons.AntDesign name="star" size={20} color={"orange"} />
          )}
        </Pressable>
      </View>

      {/* pharmacy item */}
      <View style={{ padding: 10 }}>
        <PharmacyItem pharmacy={pharmacy} />
      </View>
      <View style={{ height: 10 }} />

      {/* tab navigator */}
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

      {/* bottom actions - chat and visit */}
      {!isMine ? (
        <View style={styles.actions}>
          <Pressable
            onPress={goToChat}
            style={[styles.action, { backgroundColor: COLORS.red }]}
          >
            <Icons.Ionicons name="chatbox" color={COLORS.white} size={15} />
            <Text style={[styles.actionText, { color: COLORS.white }]}>
              Chat
            </Text>
          </Pressable>
          <Pressable
            style={[styles.action, { backgroundColor: COLORS.gray }]}
            onPress={handleMaps}
          >
            <Icons.Ionicons name="location-sharp" size={20} />
            <Text style={styles.actionText}>Visit</Text>
          </Pressable>
        </View>
      ) : null}

      {/* leave a review modal */}
      <Modal transparent animationType="slide" visible={visible}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setVisible((prev) => !prev)}
          disabled={reviewing}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.modal}
        >
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHheaderText}>
                  Leave a review about this pharmacy?
                </Text>
                <Pressable
                  onPress={() => setVisible((prev) => !prev)}
                  style={styles.close}
                  disabled={reviewing}
                >
                  <Icons.Feather name="x" size={25} />
                </Pressable>
              </View>
              <Rating
                onFinishRating={(rating) => setRating(rating)}
                style={{ paddingVertical: 10 }}
                imageSize={25}
                startingValue={rating}
                isDisabled={false}
                ratingColor="orange"
                type="custom"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter review..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                autoFocus
                value={review}
                onChangeText={setReview}
                editable={!reviewing}
              />
              <TouchableOpacity
                style={[styles.button]}
                activeOpacity={0.5}
                onPress={handleSubmit}
                disabled={reviewing}
              >
                {reviewing ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>Submit</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
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
    fontSize: 15,
  },
  label: {
    fontSize: 16,
    ...FONTS.SemiBold,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray,
  },
  action: {
    height: 50,
    borderRadius: 5,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  actionText: {
    ...FONTS.SemiBold,
    fontSize: 15,
  },

  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOW,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    padding: 10,
  },
  modalHeader: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  modalHheaderText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  input: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 10,
    minHeight: 150,
    ...FONTS.Regular,
    marginTop: 20,
  },
  button: {
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  buttonText: {
    ...FONTS.SemiBold,
    fontSize: 14,
    color: COLORS.white,
  },
});
