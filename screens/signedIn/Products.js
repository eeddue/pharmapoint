import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS } from "../../constants";
import Product from "../../components/Product";

const Products = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      await axios
        .get("/products")
        .then(({ data }) => setProducts(data))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    })();
  }, []);

  useEffect(() => {
    if (products.length && name) {
      setFiltered(
        products.filter((prod) =>
          prod.name.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
  }, [name]);

  const onRefresh = async () => {
    setRefreshing(true);
    await axios
      .get("/products")
      .then(({ data }) => setProducts(data))
      .catch((error) => console.log(error))
      .finally(() => setRefreshing(false));
  };

  const searchProducts = async () => {
    Keyboard.dismiss();
    if (!name.trim().length) return;
    setSearching(true);
    await axios
      .get(`/products?name=${name.trim()}`)
      .then(({ data }) => setProducts(data))
      .catch((error) => console.log(error))
      .finally(() => setSearching(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <TextInput
          placeholder="Search"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Pressable
          style={styles.search}
          onPress={searchProducts}
          disabled={searching || loading}
        >
          {searching ? (
            <ActivityIndicator color={COLORS.red} size={25} />
          ) : (
            <Icons.Ionicons
              name="search-outline"
              size={25}
              color={COLORS.red}
            />
          )}
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          size={30}
          color={COLORS.red}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={name.trim().length ? filtered : products}
          keyExtractor={(_, index) => index}
          renderItem={({ item, index }) => (
            <Product index={index} product={item} />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No products found.</Text>
          )}
          numColumns={2}
          gap={10}
          contentContainerStyle={{ padding: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.red}
              colors={[COLORS.red]}
            />
          }
        />
      )}
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  input: {
    height: 40,
    ...FONTS.Regular,
    borderRadius: 10,
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 15,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
  search: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
