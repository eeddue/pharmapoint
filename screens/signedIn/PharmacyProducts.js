import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants";
import Product from "../../components/Product";
import axios from "axios";

const PharmacyProducts = ({ route }) => {
  const { pharmacy } = route.params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      await axios
        .get(`/products?owner=${pharmacy.id}`)
        .then(({ data }) => setProducts(data))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    })();
  }, []);

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {loading ? (
        <ActivityIndicator
          color={COLORS.red}
          size={25}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={products}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Your have no chats.</Text>
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Product index={index} product={item} />
          )}
          contentContainerStyle={{
            backgroundColor: COLORS.white,
            padding: 10,
          }}
          numColumns={2}
          gap={10}
        />
      )}
    </View>
  );
};

export default PharmacyProducts;

const styles = StyleSheet.create({
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
