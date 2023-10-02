import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import commaNumber from "comma-number";
import { COLORS, FONTS } from "../../../constants";

const plans = [
  {
    name: "Free",
    amount: 0,
    pharmacies: 1,
    products: 10,
  },
  {
    name: "Basic",
    amount: 499,
    pharmacies: 3,
    products: 30,
  },
  {
    name: "Premium",
    amount: 999,
    pharmacies: 10,
    products: 60,
  },
  {
    name: "Platinum",
    amount: 1499,
    pharmacies: "Unlimited",
    products: "Unlimited",
  },
];

const Pricing = ({ navigation }) => {
  const [selected, setSelected] = useState(plans[0]);

  const handlePress = () => {
    if (selected.amount === 0) return alert("You are already on a free plan.");
    return navigation.navigate("Payment", { plan: selected });
  };
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Pricing plans</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* plans */}
      <FlatList
        contentContainerStyle={{ padding: 10 }}
        data={plans}
        keyExtractor={(item) => item.amount}
        renderItem={({ item }) => {
          const isSelected = selected.amount === item.amount;
          return (
            <TouchableOpacity
              onPress={() => setSelected(item)}
              activeOpacity={0.7}
              style={[
                styles.plan,
                { borderColor: isSelected ? COLORS.green : COLORS.gray },
              ]}
            >
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.pricing}>
                Ksh{" "}
                <Text style={{ color: COLORS.red }}>
                  {commaNumber(item.amount)}
                </Text>
                /month
              </Text>
              <Text style={[styles.benefit, { marginBottom: 3 }]}>
                {Number(item.pharmacies)
                  ? "Up to " + item.pharmacies
                  : item.pharmacies}{" "}
                pharmacies.
              </Text>
              <Text style={styles.benefit}>
                {Number(item.products)
                  ? "Up to " + item.products
                  : item.products}{" "}
                products per pharmacy.
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity
        activeOpacity={0.5}
        style={styles.continue}
        onPress={handlePress}
      >
        <Text style={styles.continutText}>
          Get {selected.name.toLowerCase()} plan
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pricing;

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
  plan: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
  },
  title: {
    fontSize: 17,
    ...FONTS.SemiBold,
  },
  pricing: {
    ...FONTS.SemiBold,
    marginVertical: 3,
  },
  benefit: {
    ...FONTS.Regular,
    color: COLORS.ltblack,
    fontSize: 13,
  },
  continue: {
    height: 50,
    borderRadius: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
  },
  continutText: {
    ...FONTS.SemiBold,
    color: COLORS.white,
  },
});
