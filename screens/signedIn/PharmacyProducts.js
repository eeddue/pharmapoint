import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { COLORS } from "../../constants";
import ProductItem from "../../components/ProductItem";
import LoadingMore from "../../components/LoadingMore";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import { getPharmacyProducts } from "../../api";

const PharmacyProducts = ({ route }) => {
  const { pharmacy } = route.params;
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      const { products, pages } = await getPharmacyProducts(pharmacy._id, skip);
      setProducts(products);
      setPages(pages);
      setCurrentPage((prev) => prev + 1);
      setLoading(false);
    });

    return unsub;
  }, []);

  const loadMore = async () => {
    if (currentPage === pages || pages === 0) return;
    setSkip(currentPage * 20);
    setCurrentPage((prev) => prev + 1);
    setFetching(true);
    const { products: more } = await getPharmacyProducts(pharmacy._id, skip);
    setProducts(products.concat(more));
    setFetching(false);
  };

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <FlatList
        bounces={false}
        data={products}
        ListEmptyComponent={
          <ListEmptyComponent loading={loading} text="No products found." />
        }
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ProductItem index={index} product={item} />
        )}
        contentContainerStyle={{
          backgroundColor: COLORS.white,
          padding: 10,
        }}
        ListFooterComponent={loading || fetching ? LoadingMore : null}
        onEndReached={loadMore}
        numColumns={2}
        gap={10}
      />
    </View>
  );
};

export default PharmacyProducts;
