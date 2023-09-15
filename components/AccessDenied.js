import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { AccessIcon } from "../constants/icons";
import { COLORS, FONTS } from "../constants";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const AccessDenied = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={AccessIcon}
          style={{ width: width * 0.7, height: width * 0.7 }}
        />
      </View>
      <View style={styles.bottom}>
        <Text style={styles.bigText}>Access denied</Text>
        <Text style={styles.smallText}>
          You must be logged in to access this feature. Continue to login.
        </Text>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default AccessDenied;

const styles = StyleSheet.create({
  bottom: {
    flex: 1,
    backgroundColor: COLORS.red,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
  },
  bigText: {
    textAlign: "center",
    color: COLORS.white,
    ...FONTS.SemiBold,
    fontSize: 20,
  },
  smallText: {
    textAlign: "center",
    color: COLORS.white,
    ...FONTS.Regular,
    fontSize: 14,
    marginVertical: 15,
    opacity: 0.8,
  },
  button: {
    height: 45,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    ...FONTS.SemiBold,
    color: COLORS.red,
  },
});
