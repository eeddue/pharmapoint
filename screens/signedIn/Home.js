import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { TextInput } from "react-native";

import { COLORS, FONTS } from "../../constants";
import { SearchIcon } from "../../constants/icons";
import { getGreeting } from "../../helpers";
import PharmacyItem from "../../components/PharmacyItem";
import ProductItem from "../../components/ProductItem";
import { getHomeItems } from "../../api";

const Home = ({ navigation }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [products, setProducts] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      const { pharmacies, products } = await getHomeItems();
      setPharmacies(pharmacies);
      setProducts(products);
      setLoading(false);
    });

    return unsub;
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const { pharmacies, products } = await getHomeItems();
    setPharmacies(pharmacies);
    setProducts(products);
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 50 }}>
      {/* greating */}

      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.date}>{new Date().toDateString()}</Text>

      {/* header to search */}
      <View style={styles.header}>
        <TextInput
          placeholder="Search for products..."
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor={COLORS.ltblack}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Products", { name })}
        >
          <Image source={SearchIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {loading ? (
          <ActivityIndicator
            size={25}
            color={COLORS.red}
            style={{ marginTop: 30 }}
          />
        ) : (
          <FlatList
            data={pharmacies}
            keyExtractor={(item) => item._id}
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
                  keyExtractor={(item) => item._id}
                  renderItem={({ item, index }) => (
                    <ProductItem index={index} product={item} />
                  )}
                  numColumns={2}
                  gap={10}
                  ListEmptyComponent={
                    <Text style={styles.empty}>No products found you.</Text>
                  }
                />
              </View>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[COLORS.red]}
                tintColor={COLORS.red}
              />
            }
            ListEmptyComponent={
              <Text style={styles.empty}>No pharmacies found near you.</Text>
            }
          />
        )}
      </View>
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
    color: COLORS.black,
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
    marginBottom: 20,
  },
  input: {
    height: 50,
    flex: 1,
    borderRadius: 10,
    backgroundColor: COLORS.gray,
    padding: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  button: {
    height: 50,
    width: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  icon: {
    width: 30,
    height: 30,
    tintColor: COLORS.red,
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
  empty: {
    textAlign: "center",
    ...FONTS.Regular,
    marginTop: 50,
    color: COLORS.ltblack,
    fontSize: 12,
  },
});
