import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS, FONTS } from "../constants";
import { useNavigation } from "@react-navigation/native";
import commaNumber from "comma-number";

const Product = ({ product, index }) => {
  const isEven = index % 2 === 0;
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate("Product", { product })}
      style={[
        styles.item,
        { marginRight: isEven ? 5 : 0, marginLeft: isEven ? 0 : 5 },
      ]}
    >
      <View style={styles.avatarView}>
        <Image source={{ uri: product.img }} style={styles.image} />
      </View>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>Ksh {commaNumber(product.price)}</Text>
    </TouchableOpacity>
  );
};

export default Product;

const styles = StyleSheet.create({
  item: {
    width: Dimensions.get("window").width / 2 - 15,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
  },
  avatarView: {
    height: 150,
    width: "100%",
    backgroundColor: COLORS.gray,
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 10,
  },
  image: {
    resizeMode: "contain",
    aspectRatio: 1,
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
  flexView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  button: {
    width: 50,
    height: 30,
    borderColor: COLORS.gray,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
