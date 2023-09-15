import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 16) return "Good afternoon!";
  return "Good evening!";
};

export const addProductToStore = async (product) => {
  try {
    const products = await getStoredProducts();
    products.push({ ...product, count: 1 });
    await AsyncStorage.setItem("products", JSON.stringify(products));
    return products;
  } catch (error) {
    return console.log(error);
  }
};

export const removeProductFromStore = async (productId) => {
  try {
    const products = await getStoredProducts();

    const filtered = products.filter((prod) => prod.id !== productId);
    await AsyncStorage.setItem("products", JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.log(error);
  }
};

export const getStoredProducts = async () => {
  try {
    const products = await AsyncStorage.getItem("products");
    return products !== null ? JSON.parse(products) : [];
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (type, productId) => {
  try {
    let products = await getStoredProducts();
    let product = products.find((prod) => prod.id === productId);
    if (type === "add") {
      product.count += 1;
    } else {
      if (product.count === 1) {
        products = products.filter((prod) => prod.id !== productId);
      } else {
        product.count -= 1;
      }
    }
    await AsyncStorage.setItem("products", JSON.stringify(products));

    return products;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission to access location was denied");
    return;
  }

  let { coords } = await Location.getCurrentPositionAsync({
    enableHighAccuracy: true,
  });

  return coords;
};

export const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  } else {
    return null;
  }
};
