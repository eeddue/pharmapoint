import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants";
import { Image } from "react-native";
import { SearchIcon } from "../../constants/icons";
import { TextInput } from "react-native";
import { getGreeting, getStoredProducts } from "../../helpers";
import { pharmacies, products } from "../../data";
import PharmacyItem from "../../components/PharmacyItem";
import Product from "../../components/Product";
import { useAppContext } from "../../context/AppContext";

const Home = ({ navigation }) => {
  const { setStoredProducts, storedProducts } = useAppContext();
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      const products = await getStoredProducts();
      setStoredProducts(products);
    })();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 50 }}>
      {/* greating */}
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      {/* header to search */}
      <View style={styles.header}>
        <TextInput
          placeholder="Search for medicine..."
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Products", { name })}
        >
          <Image source={SearchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={pharmacies}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: 10 }}
        ListHeaderComponent={() => (
          <View style={styles.flexView}>
            <Text style={styles.label}>Near you</Text>
            <Pressable onPress={() => navigation.navigate("Pharmacies")}>
              <Text style={styles.link}>See all</Text>
            </Pressable>
          </View>
        )}
        renderItem={({ item }) => <PharmacyItem pharmacy={item} />}
        ListFooterComponent={() => (
          <View style={{ marginTop: 50, marginBottom: 20 }}>
            <View style={styles.flexView}>
              <Text style={styles.label}>Popular products</Text>
              <Pressable onPress={() => navigation.navigate("Products")}>
                <Text style={styles.link}>See all</Text>
              </Pressable>
            </View>
            <FlatList
              data={products}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item, index }) => (
                <Product index={index} product={item} />
              )}
              numColumns={2}
              gap={10}
            />
          </View>
        )}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  greeting: {
    ...FONTS.Bold,
    marginHorizontal: 10,
    fontSize: 20,
    marginTop: 10,
  },
  date: {
    ...FONTS.Regular,
    marginHorizontal: 10,
    fontSize: 13,
    color: COLORS.ltblack,
  },
  header: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    margin: 10,
  },
  input: {
    height: 50,
    flex: 1,
    borderRadius: 5,
    backgroundColor: COLORS.gray,
    padding: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: COLORS.white,
  },
  flexView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  label: {
    ...FONTS.Bold,
    fontSize: 20,
  },
  link: {
    ...FONTS.SemiBold,
    color: COLORS.red,
  },
  products: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
