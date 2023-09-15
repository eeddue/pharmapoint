import { createContext, useContext, useEffect, useState } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AppContext = createContext({});

SplashScreen.preventAutoHideAsync();

export default function AppContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [storedProducts, setStoredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        storedProducts,
        setStoredProducts,
        cartItems,
        setCartItems,
        setLaunched,
        launched,
        location,
        setLocation,
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
