import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants";
import { getStoredProducts } from "../../helpers";
import CartItem from "../../components/CartItem";
import { useAppContext } from "../../context/AppContext";

const Cart = ({ navigation }) => {
  const [fetching, setFetching] = useState(true);
  const { cartItems, setCartItems } = useAppContext();

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      const products = await getStoredProducts();
      setCartItems(products);
      setFetching(false);
    });

    return () => {
      unsub;
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cart</Text>
      </View>

      {fetching ? (
        <ActivityIndicator size={30} color={COLORS.red} />
      ) : (
        <FlatList
          data={cartItems}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Your cart is empty.</Text>
          )}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <CartItem product={item} />}
          contentContainerStyle={{ backgroundColor: COLORS.gray, flex: 1 }}
          bounces={false}
        />
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 20,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
