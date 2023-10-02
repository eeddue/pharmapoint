import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import * as Icons from "@expo/vector-icons";
import commaNumber from "comma-number";
import { COLORS, FONTS } from "../../constants";
import PhoneInput from "react-native-phone-number-input";
import { MpesaIcon } from "../../constants/icons";

const Payment = ({ route, navigation }) => {
  const { plan } = route.params;
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");

  const handlePress = () => {};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>
          Get {plan.name.toLowerCase()} plan.
        </Text>
        <View style={{ width: 25 }} />
      </View>

      {/* details */}
      <View style={{ padding: 10 }}>
        {/* mpesa logo icon */}
        <Image source={MpesaIcon} style={styles.image} />
        <Text style={styles.text}>
          You will be charged Ksh{" "}
          <Text style={styles.amount}>{commaNumber(plan.amount)} </Text> per
          month for this plan. Enter your phone number to complete the
          transaction.
        </Text>

        <View style={{ flexDirection: "row", marginVertical: 20 }}>
          <PhoneInput
            disabled={loading}
            defaultCode="KE"
            layout="first"
            onChangeFormattedText={(text) => setPhone(text)}
            withShadow
            autoFocus
            textInputStyle={{ ...FONTS.Regular }}
            containerStyle={{ flex: 1 }}
            textContainerStyle={{ width: "100%", backgroundColor: COLORS.gray }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={handlePress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Payment;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    ...FONTS.SemiBold,
    fontSize: 15,
  },
  text: {
    ...FONTS.Regular,
  },
  amount: {
    color: COLORS.red,
    ...FONTS.SemiBold,
  },
  input: {
    backgroundColor: COLORS.red,
  },
  button: {
    height: 50,
    borderRadius: 10,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
  },
  buttonText: {
    ...FONTS.SemiBold,
    color: COLORS.white,
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 30,
  },
});
