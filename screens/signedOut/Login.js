import {
  ActivityIndicator,
  Alert,
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
import { COLORS, FONTS } from "../../constants";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { AppIcon } from "../../constants/icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import validator from "validator";
import { useAppContext } from "../../context/AppContext";
import { showToast } from "../../helpers";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();

  const handlePress = async () => {
    if (!email || !password)
      return showToast("error", "Fields missing.", "All fields are required.");

    if (!validator.isEmail(email))
      return showToast(
        "error",
        "Invalid email.",
        "Provide a valid email address."
      );

    setLoading(true);
    await axios
      .post("/auth/login", { email, password })
      .then(async ({ data }) => {
        const dataToStore = { token: data.token, ...data.user };
        await AsyncStorage.setItem("user", JSON.stringify(dataToStore));
        setUser(dataToStore);
        navigation.navigate("Bottom");
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardWrapper>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 10 }}
      >
        <Image source={AppIcon} style={styles.image} />
        <Text style={styles.bigText}>Login to continue</Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            editable={!loading}
            placeholder="abc@example.com"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={(val) => setEmail(val.trim().toLowerCase())}
          />
        </View>
        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            editable={!loading}
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={(val) => setPassword(val.trim())}
            secureTextEntry
          />
        </View>
        <Pressable
          disabled={loading}
          style={{ alignSelf: "flex-end", marginVertical: 15 }}
          onPress={() => navigation.navigate("Forgot")}
        >
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          disabled={loading}
          onPress={handlePress}
        >
          {loading ? (
            <ActivityIndicator size={20} color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ ...FONTS.Regular, marginRight: 5 }}>
            Have no account?
          </Text>
          <Pressable
            disabled={loading}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.link}>Register</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default Login;

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

  label: {
    fontSize: 14,
    ...FONTS.SemiBold,
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
