import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import validator from "validator";
import { COLORS, FONTS } from "../../constants";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import axios from "axios";
import { showToast } from "../../helpers";

const Register = ({ navigation }) => {
  const [selected, setSelected] = useState("customer");
  const active = (val) => selected === val;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [cPass, setCPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!email || !password || !username || !cPass)
      return showToast("error", "Fields required", "All fields are required.");

    if (!validator.isEmail(email))
      return showToast(
        "error",
        "Invalid email.",
        "Provide a valid email address."
      );

    if (password !== cPass)
      return showToast("error", "Warning", "Passwords must be the same.");

    if (password.length < 6)
      return showToast(
        "error",
        "Short password",
        "Password must be 6 or more characters."
      );

    setLoading(true);
    await axios
      .post("/auth/register", {
        username,
        email,
        password,
        role: selected,
      })
      .then(({ data }) => {
        showToast("success", "Congratulations", data.msg);
        navigation.navigate("Login");
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardWrapper>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 10 }}
      >
        <Text style={styles.bigText}>Create an account.</Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Register as</Text>
          <View style={styles.actions}>
            <Pressable
              disabled={loading}
              onPress={() => setSelected("customer")}
              style={[
                styles.action,
                {
                  backgroundColor: active("customer")
                    ? COLORS.red
                    : COLORS.gray,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: active("customer") ? COLORS.white : COLORS.label },
                ]}
              >
                Customer
              </Text>
            </Pressable>
            <Pressable
              disabled={loading}
              onPress={() => setSelected("pharmacy")}
              style={[
                styles.action,
                {
                  backgroundColor: active("pharmacy")
                    ? COLORS.red
                    : COLORS.gray,
                },
              ]}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: active("pharmacy") ? COLORS.white : COLORS.label },
                ]}
              >
                Pharmacy
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            editable={!loading}
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={(val) => setUsername(val.toLowerCase().trim())}
            maxLength={15}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            editable={!loading}
            placeholder="abc@example.com"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={(val) => setEmail(val.toLowerCase().trim())}
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

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            editable={!loading}
            placeholder="Confirm Password"
            style={styles.input}
            value={cPass}
            onChangeText={(val) => setCPass(val.trim())}
            secureTextEntry
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
            <Text style={styles.buttonText}>Create</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={{ ...FONTS.Regular, marginRight: 5 }}>
            Have an account?
          </Text>
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

export default Register;

const styles = StyleSheet.create({
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
  actions: {
    height: 45,
    borderRadius: 10,
    backgroundColor: COLORS.gray,
    flex: 1,
    flexDirection: "row",
    overflow: "hidden",
    marginTop: 3,
  },
  action: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 14,
    ...FONTS.SemiBold,
  },
});
