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
import { COLORS, FONTS } from "../../constants";
import KeyboardWrapper from "../../components/KeyboardWrapper";
import { AppIcon } from "../../constants/icons";

const Verify = ({ navigation }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    navigation.navigate("Reset");
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
          expire in 30 minutes.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            editable={!loading}
            placeholder="123456"
            style={styles.input}
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
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
