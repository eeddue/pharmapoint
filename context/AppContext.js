import { createContext, useContext, useEffect, useState } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./socket";
import { getStoredProducts } from "../helpers";
import { AppState } from "react-native";

const AppContext = createContext({});

SplashScreen.preventAutoHideAsync();

export default function AppContextProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const [user, launched] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("launched"),
      ]);

      setLaunched(launched);
      if (user) {
        setUser(JSON.parse(user));
      }
      await SplashScreen.hideAsync();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const products = await getStoredProducts();
      setCartItems(products);
    })();
  }, []);

  useEffect(() => {
    if (user && location) {
      socket.connect();
      socket.emit("add_user", user._id);
    }
  }, [user, location]);

  useEffect(() => {
    socket.on("online_users", (users) => setOnlineUsers(users));
  }, [socket]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (user) {
        if (nextAppState === "active") {
          socket.connect();
          socket.emit("add_user", user._id);
        } else {
          socket.disconnect();
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, [user]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cartItems,
        setCartItems,
        setLaunched,
        launched,
        location,
        setLocation,
        onlineUsers,
      }}
    >
      {Platform.OS === "android" ? (
        <View
          style={{
            flex: 1,
            paddingTop: StatusBar.currentHeight,
          }}
        >
          {children}
        </View>
      ) : (
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      )}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
