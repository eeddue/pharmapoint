import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS, SHADOW } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { addProductToStore, removeProductFromStore } from "../../helpers";
import PharmacyItem from "../../components/PharmacyItem";

const Product = ({ route, navigation }) => {
  const { product } = route.params;
  const { storedProducts, setStoredProducts } = useAppContext();
  const isInStore = storedProducts?.some((prod) => prod.id === product.id);
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    if (isInStore) {
      await removeProductFromStore(product.id).then((res) =>
        setStoredProducts(res)
      );
    } else {
      await addProductToStore(product).then((res) => setStoredProducts(res));
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Pressable
        disabled={loading}
        onPress={() => navigation.goBack()}
        style={styles.goback}
      >
        <Icons.Ionicons name="arrow-back" size={25} />
      </Pressable>
      <ScrollView>
        <View style={styles.imageView}>
          <Image source={{ uri: product.img }} style={styles.image} />
        </View>
        <View style={{ padding: 10 }}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category.name}</Text>
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>Ksh {parseInt(product.price)}</Text>
        </View>

        <View style={{ padding: 10 }}>
          <PharmacyItem pharmacy={product.owner} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <Pressable
          disabled={loading}
          style={[styles.button, isInStore && styles.isadded]}
          onPress={handlePress}
        >
          {loading ? (
            <ActivityIndicator
              size="small"
              color={isInStore ? COLORS.red : COLORS.white}
            />
          ) : (
            <Text
              style={[
                styles.buttonText,
                { color: isInStore ? COLORS.red : COLORS.white },
              ]}
            >
              {isInStore ? "Remove from cart" : "Add to cart"}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  goback: {
    position: "absolute",
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    zIndex: 10,
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
  },
  imageView: {
    height: 300,
    backgroundColor: COLORS.gray,
  },
  image: {
    width: "100%",
    height: "100%",
    // resizeMode: "contain",
  },
  name: {
    ...FONTS.Bold,
    fontSize: 20,
  },
  category: {
    ...FONTS.Regular,
    marginVertical: 5,
  },
  desc: {
    ...FONTS.Regular,
    fontSize: 15,
  },
  price: {
    ...FONTS.Bold,
    fontSize: 14,
    color: COLORS.red,
    marginVertical: 10,
  },
  footer: {
    padding: 10,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  },
  button: {
    height: 50,
    borderRadius: 5,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
  },
  isadded: {
    borderColor: COLORS.red,
    borderWidth: 1,
    backgroundColor: COLORS.white,
  },
  buttonText: {
    fontSize: 14,
    color: COLORS.white,
    ...FONTS.Regular,
  },
});
