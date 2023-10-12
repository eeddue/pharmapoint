import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { COLORS, FONTS } from "../../constants";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { AppIcon } from "../../constants/icons";
import { showToast } from "../../helpers";

const Verify = ({ navigation, route }) => {
  const { email } = route.params;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (!code)
      return showToast(
        "error",
        "Field required",
        "Code is required to continue"
      );

    setLoading(true);
    try {
      await axios.post("/auth/verify", { email, code: parseInt(code) });
      navigation.navigate("Reset", { email });
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
        <Text style={styles.bigText}>Verify code</Text>
        <Text style={styles.desc}>
          Enter the password reset code we sent to your email. The code will
          expire in 30 minutes. If you don't see it, check it in your spam.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            editable={!loading}
            placeholder="123456"
            style={styles.input}
            keyboardType="numeric"
            value={code}
            onChangeText={(value) => setCode(value.trim())}
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
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default Verify;

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
});
