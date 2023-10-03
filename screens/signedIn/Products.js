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
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";

import { COLORS, FONTS, SHADOW } from "../../constants";
import { categories } from "../../data";
import ProductItem from "../../components/ProductItem";

const Products = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");

  useEffect(() => {
    (async () => {
      const response = await getProducts();
      setProducts(response);
      setLoading(false);
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

  const getProducts = async () => {
    try {
      const { data } = await axios.get("/products");
      return data.products;
    } catch (error) {
      console.log(error, "Products");
      return [];
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const response = await getProducts();
    setProducts(response);
    setRefreshing(false);
  };

  const searchProducts = async () => {
    Keyboard.dismiss();
    if (!name.trim().length) return;
    setSearching(true);
    await axios
      .get(`/products?name=${name.trim()}`)
      .then(({ data }) => setProducts(data.products))
      .catch((error) => console.log(error))
      .finally(() => setSearching(false));
  };

  const handleVisible = () => setVisible((prev) => !prev);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <TextInput
          placeholder="Search product..."
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Pressable
            style={styles.search}
            onPress={handleVisible}
            disabled={searching || loading || refreshing}
          >
            <Icons.Ionicons name="filter" size={25} color={COLORS.ltblack} />
          </Pressable>
          <Pressable
            style={styles.search}
            onPress={searchProducts}
            disabled={searching || loading || refreshing}
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
      </View>

      {loading ? (
        <ActivityIndicator
          size={25}
          color={COLORS.red}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={name.trim().length ? filtered : products}
          keyExtractor={(_, index) => index}
          renderItem={({ item, index }) => (
            <ProductItem index={index} product={item} />
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

      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={handleVisible} />
          <View style={styles.categories}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Select category</Text>
              <Pressable style={styles.close} onPress={handleVisible}>
                <Icons.Feather name="x" size={20} color={COLORS.black} />
              </Pressable>
            </View>
            {/* all categories */}

            {category && (
              <Text
                style={{ margin: 10, ...FONTS.SemiBold, color: COLORS.red }}
              >
                {category}
              </Text>
            )}
            <FlatList
              contentContainerStyle={{ padding: 10 }}
              data={categories}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                const isSelected = item === category;
                const handlePress = () => {
                  setCategory(item);
                  handleVisible();
                };
                return (
                  <TouchableOpacity
                    onPress={handlePress}
                    style={[
                      styles.category,
                      {
                        backgroundColor: isSelected
                          ? COLORS.gray
                          : COLORS.white,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? COLORS.red : COLORS.black },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
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
    backgroundColor: COLORS.gray,
    paddingHorizontal: 15,
    color: COLORS.ltblack,
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
  categories: {
    flex: 1,
    backgroundColor: COLORS.white,
    ...SHADOW,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  modalHeader: {
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.gray,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalText: {
    fontSize: 17,
    ...FONTS.SemiBold,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  category: {
    height: 50,
    justifyContent: "center",
    padding: 10,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    ...FONTS.Regular,
  },
});
