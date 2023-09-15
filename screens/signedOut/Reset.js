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

const Reset = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [cPass, setCPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    navigation.navigate("Login");
  };

  return (
    <KeyboardWrapper>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white, padding: 10 }}
      >
        <Image source={AppIcon} style={styles.image} />
        <Text style={styles.bigText}>Reset your password.</Text>
        <Text style={styles.desc}>
          Provide a strong and secure password for your account.
        </Text>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            editable={!loading}
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            editable={!loading}
            placeholder="Confirm Password"
            style={styles.input}
            value={cPass}
            onChangeText={setCPass}
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
            <Text style={styles.buttonText}>Finish</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default Reset;

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
