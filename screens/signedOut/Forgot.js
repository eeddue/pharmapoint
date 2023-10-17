import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import validator from "validator";
import { COLORS, FONTS } from "../../constants";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { AppIcon } from "../../constants/icons";
import { showToast } from "../../helpers";

const Forgot = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!email)
      return showToast("error", "Field required", "Email is required.");

    if (!validator.isEmail(email))
      return showToast(
        "error",
        "Invalid email.",
        "Provide a valid email address."
      );

    setLoading(true);
    try {
      await axios.post("/auth/forgot", { email });
      navigation.navigate("Verify", { email });
    } catch (error) {
      showToast("error", "Error", error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardWrapper>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 10 }}
      >
        <Image source={AppIcon} style={styles.image} />
        <Text style={styles.bigText}>Forgot your password?</Text>
        <Text style={styles.desc}>
          Don't worry, it happens. Request to reset your password using the
          email address you reqistered your account with. Specify your account
          type.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            editable={!loading}
            placeholder="abc@example.com"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={(value) => setEmail(value.toLowerCase().trim())}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          disabled={loading}
          onPress={handlePress}
        >
          {loading ? (
            <ActivityIndicator size={20} color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Continue</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Pressable
            disabled={loading}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.link}>Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default Forgot;

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
    alignSelf: "center",
  },
  bigText: {
    textAlign: "center",
    fontSize: 18,
    ...FONTS.SemiBold,
    marginVertical: 20,
  },
  desc: {
    ...FONTS.Regular,
    color: COLORS.ltblack,
    textAlign: "center",
    marginHorizontal: 20,
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    ...FONTS.Regular,
    marginBottom: 3,
  },
  input: {
    ...FONTS.Regular,
    height: 45,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    color: COLORS.ltblack,
  },
  link: {
    fontSize: 14,
    color: COLORS.red,
    ...FONTS.SemiBold,
  },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
});
