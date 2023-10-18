import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS, blurhash, SHADOW } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import {
  addProductToStore,
  removeProductFromStore,
  showToast,
} from "../../helpers";
import PharmacyItem from "../../components/PharmacyItem";
import { CartFillIcon, CartIcon } from "../../constants/icons";
import ActionsModal from "../../components/ActionsModal";

const Product = ({ route, navigation }) => {
  const { product } = route.params;
  const { user, cartItems, setCartItems } = useAppContext();
  const isInStore = cartItems?.some((prod) => prod._id === product._id);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const isMine = user?.pharmacies.includes(product.owner._id);

  const handleCart = async () => {
    setLoading(true);
    if (isInStore) {
      await removeProductFromStore(product._id).then((res) =>
        setCartItems(res)
      );
    } else {
      await addProductToStore(product).then((res) => setCartItems(res));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await axios
      .delete(`/products/${product._id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      .then(() => {
        setVisible(false);
        navigation.goBack();
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setDeleting(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.goback}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>

        <Text style={styles.headerText} numberOfLines={1}>
          {product.name}
        </Text>

        <Pressable
          disabled={loading}
          onPress={handleCart}
          style={styles.goback}
        >
          <Image
            source={isInStore ? CartFillIcon : CartIcon}
            tintColor={isInStore ? COLORS.red : COLORS.ltblack}
            style={{ width: 25, height: 25 }}
          />
        </Pressable>
      </View>

      {/* product details */}
      <ScrollView bounces={false} contentContainerStyle={{ paddingBottom: 50 }}>
        <View style={styles.imageView}>
          <Image
            source={{ uri: product.img.url }}
            style={styles.image}
            placeholder={blurhash}
            transition={500}
            contentFit="cover"
          />
        </View>
        <View style={{ padding: 10 }}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.desc}>{product.description}</Text>
          <Text style={styles.price}>Ksh {parseInt(product.price)}</Text>
        </View>

        <View style={{ padding: 10 }}>
          <PharmacyItem pharmacy={product.owner} />
        </View>
      </ScrollView>

      {isMine ? (
        <View>
          <Pressable
            disabled={loading}
            onPress={() => setVisible((prev) => !prev)}
            style={styles.delete}
          >
            <Icons.SimpleLineIcons name="trash" size={25} />
          </Pressable>
        </View>
      ) : null}

      {/* delete modal */}
      <ActionsModal
        visible={visible}
        setVisible={setVisible}
        loading={deleting}
        text={`Are you sure you want to delete ${product.name} from it's respective pharmacy?`}
        handleAction={handleDelete}
        title="Delete product"
      />
    </View>
  );
};

export default Product;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    gap: 20,
  },
  headerText: { ...FONTS.SemiBold, fontSize: 15 },
  imageView: { height: 300, backgroundColor: COLORS.gray },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  name: { ...FONTS.Bold, fontSize: 20 },
  category: { ...FONTS.Regular, marginVertical: 5 },
  desc: { ...FONTS.Regular, fontSize: 15 },
  price: { ...FONTS.Bold, fontSize: 14, color: COLORS.red, marginVertical: 10 },
  delete: {
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});
