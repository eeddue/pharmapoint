import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  Keyboard,
  Modal,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";

import { COLORS, FONTS, SHADOW } from "../../constants";
import { categories } from "../../data";
import ProductItem from "../../components/ProductItem";
import LoadingMore from "../../components/LoadingMore";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import { getProducts, searchProducts } from "../../api";

const Products = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { products, pages } = await getProducts(skip, category);
      setTotalPages(pages);
      setProducts(products);
      setLoading(false);
    })();
  }, [category]);

  const onRefresh = async () => {
    setRefreshing(true);
    setSkip(0);
    const { products, pages } = await getProducts(skip, "");
    setProducts(products);
    setTotalPages(pages);
    setRefreshing(false);
  };

  const onSearch = async () => {
    Keyboard.dismiss();
    if (!name.trim().length) return;
    setSearching(true);
    const { products, pages } = await searchProducts(name);
    setProducts(products);
    setTotalPages(pages);
    setSearching(false);
  };

  const loadMore = async () => {
    if (currentPage === totalPages || totalPages === 0) return;
    setFetching(true);

    setSkip(currentPage * 20);
    setCurrentPage((prev) => prev + 1);

    const { products: response, pages } = await getProducts(skip);

    setTotalPages(pages);
    if (response.length) {
      setProducts(products.concat(response));
    }

    setFetching(false);
  };

  const handleVisible = () => setVisible((prev) => !prev);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <TextInput
          placeholder="Search for products..."
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
            onPress={onSearch}
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

      <FlatList
        data={products}
        keyExtractor={(_, index) => index}
        renderItem={({ item, index }) => (
          <ProductItem index={index} product={item} />
        )}
        ListEmptyComponent={
          <ListEmptyComponent loading={loading} text="No products found." />
        }
        numColumns={2}
        gap={10}
        contentContainerStyle={{ padding: 10 }}
        ListFooterComponent={fetching || loading ? LoadingMore : null}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.red]}
            tintColor={COLORS.red}
          />
        }
      />

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
