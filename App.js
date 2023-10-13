import "react-native-gesture-handler";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppContextProvider from "./context/AppContext";
import AppNavigation from "./navigation/AppNavigation";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

axios.defaults.baseURL =
  "https://pharmapoint-822e63c79731.herokuapp.com/api/v1";

export default function App() {
  const [fontsLoaded] = useFonts({
    Regular: require("./assets/fonts/Poppins-Regular.ttf"),
    Bold: require("./assets/fonts/Poppins-Bold.ttf"),
    SemiBold: require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "white" }}
      onLayout={onLayoutRootView}
    >
      <AppContextProvider>
        <NavigationContainer>
          <AppNavigation />
          <Toast />
          <StatusBar style="dark" />
        </NavigationContainer>
      </AppContextProvider>
    </View>
  );
}
