import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Image } from "expo-image";
import { COLORS, FONTS, blurhash } from "../constants";
import * as Icons from "@expo/vector-icons";
import { updateProduct } from "../helpers";
import { useAppContext } from "../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import commaNumber from "comma-number";

const CartItem = ({ product }) => {
  const { setCartItems } = useAppContext();
  const navigation = useNavigation();

  const handleApp = async () => {
    await updateProduct("add", product.id).then((data) => setCartItems(data));
  };

  const handleReduce = () => {
    updateProduct("minus", product.id).then((data) => setCartItems(data));
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={styles.item}
      onPress={() => navigation.navigate("Product", { product })}
    >
      <View style={styles.imageView}>
        <Image
          source={{
            uri:
              product.img.url ||
              "https://api.time.com/wp-content/uploads/2021/06/Pills.jpg?quality=85&w=2703",
          }}
          style={styles.image}
          placeholder={blurhash}
          transition={500}
          contentFit="cover"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>Ksh {commaNumber(product.price)}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={[styles.action, { backgroundColor: COLORS.gray }]}
          onPress={handleReduce}
        >
          <Icons.Feather name="minus" size={20} color={COLORS.black} />
        </Pressable>
        <Text style={styles.count}>{product.count}</Text>
        <Pressable
          style={[styles.action, { backgroundColor: COLORS.red }]}
          onPress={handleApp}
        >
          <Icons.Feather name="plus" size={20} color="white" />
        </Pressable>
      </View>
    </TouchableOpacity>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    padding: 10,
    gap: 10,
    alignItems: "center",
    backgroundColor: COLORS.white,
    marginTop: 5,
  },
  imageView: {
    height: 70,
    width: 70,
    borderRadius: 5,
    backgroundColor: COLORS.gray,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  name: {
    ...FONTS.Regular,
    fontSize: 15,
    marginVertical: 5,
  },
  price: {
    ...FONTS.Bold,
    fontSize: 13,
    color: COLORS.red,
  },
  actions: {
    alignItems: "center",
    gap: 10,
    flexDirection: "row",
  },
  action: {
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  count: {
    ...FONTS.Regular,
    fontSize: 15,
  },
});
