import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS, blurhash, SHADOW } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { addProductToStore, removeProductFromStore } from "../../helpers";
import PharmacyItem from "../../components/PharmacyItem";
import { CartFillIcon, CartIcon } from "../../constants/icons";

const Product = ({ route, navigation }) => {
  const { product } = route.params;
  const { cartItems, setCartItems } = useAppContext();
  const isInStore = cartItems?.some((prod) => prod._id === product._id);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [visible, setVisible] = useState(false);
  const isMine = true;

  const handleCart = async () => {
    setLoading(true);
    if (isInStore) {
      await removeProductFromStore(product.id).then((res) => setCartItems(res));
    } else {
      await addProductToStore(product).then((res) => setCartItems(res));
    }
    setLoading(false);
  };

  const handleDelete = async () => {};

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable
          disabled={loading}
          onPress={() => navigation.goBack()}
          style={styles.goback}
        >
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>

        <Text style={styles.headerText}>{product.name}</Text>

        <Pressable
          disabled={loading}
          onPress={handleCart}
          style={styles.goback}
        >
          {loading ? (
            <ActivityIndicator size={15} color={COLORS.red} />
          ) : (
            <Image
              source={isInStore ? CartFillIcon : CartIcon}
              tintColor={isInStore ? COLORS.red : COLORS.ltblack}
              style={{ width: 25, height: 25 }}
            />
          )}
        </Pressable>
      </View>

      {/* product details */}
      <ScrollView bounces={false}>
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

      {/* delete modal */}
      <Modal transparent visible={visible} animationType="slide">
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setVisible((prev) => !prev)}
        />
        <SafeAreaView style={[styles.modal, { padding: 10 }]}>
          <View style={{ padding: 10 }}>
            <View>
              <Text style={styles.bigText}>Delete product</Text>
              <Text style={styles.smallText}>
                Are you sure you want to delete{" "}
                <Text style={{ color: COLORS.red }}>{product.name}</Text> from
                it's respective pharmacy?
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                disabled={deleting}
                activeOpacity={0.5}
                onPress={() => setVisible((prev) => !prev)}
                style={[styles.action, { backgroundColor: COLORS.gray }]}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={deleting}
                activeOpacity={0.5}
                onPress={handleDelete}
                style={[styles.action, { backgroundColor: COLORS.red }]}
              >
                {deleting ? (
                  <ActivityIndicator color={COLORS.white} size={20} />
                ) : (
                  <Text style={[styles.actionText, { color: COLORS.white }]}>
                    Confirm
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  headerText: { ...FONTS.SemiBold, fontSize: 15 },
  goback: {
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  imageView: { height: 300, backgroundColor: COLORS.gray },

  image: { width: "100%", height: "100%", resizeMode: "cover" },

  name: { ...FONTS.Bold, fontSize: 20 },

  category: { ...FONTS.Regular, marginVertical: 5 },

  desc: { ...FONTS.Regular, fontSize: 15 },

  price: { ...FONTS.Bold, fontSize: 14, color: COLORS.red, marginVertical: 10 },

  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOW,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  },
  bigText: { fontSize: 20, ...FONTS.Bold, textAlign: "center" },
  smallText: {
    fontSize: 14,
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 20,
    marginBottom: 50,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: 10 },
  action: {
    height: 50,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: { fontSize: 15, ...FONTS.SemiBold },
  delete: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
