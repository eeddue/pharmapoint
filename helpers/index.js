import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import moment from "moment";
import commaNumber from "comma-number";

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 16) return "Good afternoon!";
  return "Good evening!";
};

export const addProductToStore = async (product) => {
  const products = await getStoredProducts();
  products.push({ ...product, count: 1 });
  await AsyncStorage.setItem("products", JSON.stringify(products));
  return products;
};

export const removeProductFromStore = async (productId) => {
  const products = await getStoredProducts();

  const filtered = products.filter((prod) => prod._id !== productId);
  await AsyncStorage.setItem("products", JSON.stringify(filtered));
  return filtered;
};

export const getStoredProducts = async () => {
  const products = await AsyncStorage.getItem("products");
  return products !== null ? JSON.parse(products) : [];
};

export const updateProduct = async (type, productId) => {
  let products = await getStoredProducts();
  let product = products.find((prod) => prod._id === productId);
  if (type === "add") {
    product.count += 1;
  } else {
    if (product.count === 1) {
      products = products.filter((prod) => prod._id !== productId);
    } else {
      product.count -= 1;
    }
  }
  await AsyncStorage.setItem("products", JSON.stringify(products));

  return products;
};

export const getCurrentLocation = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    Alert.alert("Permission to access location was denied.");
    return null;
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

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return commaNumber(distance.toFixed(1));
};

export const showToast = (type, text1, text2) => {
  return Toast.show({ type, text1, text2 });
};

export const getWorkingHours = (openingTime, closingTime) => {
  return (
    moment(openingTime).format("h:mm A") +
    " - " +
    moment(closingTime).format("h:mm A")
  );
};

export const updateLocalUser = async (type, pharmacyId) => {
  const response = await AsyncStorage.getItem("user");
  const user = await JSON.parse(response);
  let newUser = null;

  if (type === "delete") {
    newUser = {
      ...user,
      pharmacies: user.pharmacies.filter((p) => p !== pharmacyId),
    };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  } else {
    newUser = {
      ...user,
      pharmacies: [...user.pharmacies, pharmacyId],
    };
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  }
  return newUser;
};

export const formatMessages = (msgs) => {
  return msgs.map((msg) => {
    return {
      _id: msg._id,
      text: msg.message,
      createdAt: msg.createdAt,
      user: {
        _id: msg.sender,
      },
    };
  });
};

export const getFormattedDate = (date) => {
  const today = new Date().getDate();
  if (new Date(date).getDate() === today) return moment(date).format("h:mm A");
  return moment(date).fromNow();
};
