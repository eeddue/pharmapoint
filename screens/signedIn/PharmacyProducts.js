import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { COLORS, FONTS } from "../../constants";
import ProductItem from "../../components/ProductItem";

const PharmacyProducts = ({ route }) => {
  const { pharmacy } = route.params;
  const navigation = useNavigation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      await axios
        .get(`/products/${pharmacy._id}`)
        .then(({ data }) => setProducts(data.products))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    });

    return () => unsub;
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
          bounces={false}
          data={products}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No products found.</Text>
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ProductItem index={index} product={item} />
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
