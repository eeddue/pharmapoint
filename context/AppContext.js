import { createContext, useContext, useEffect, useState } from "react";
import { Platform, SafeAreaView, StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import socket from "./socket";
import { getCurrentLocation } from "../helpers";
// import LocationRequest from "../components/LocationRequest";

const AppContext = createContext({});

SplashScreen.preventAutoHideAsync();

export default function AppContextProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [launched, setLaunched] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      const [user, launched, location] = await Promise.all([
        AsyncStorage.getItem("user"),
        AsyncStorage.getItem("launched"),
        getCurrentLocation(),
      ]);

      setLocation(location);
      setLaunched(launched);
      if (user) {
        setUser(JSON.parse(user));
      }
      await SplashScreen.hideAsync();
    })();
  }, []);

  useEffect(() => {
    if (user !== null) {
      socket.emit("add_user", user._id);
    }
  }, [user]);

  useEffect(() => {
    socket.on("online_users", (users) => setOnlineUsers(users));

    return () => {
      socket.off("online_users");
    };
  }, [socket]);

  const handleChats = (data) => {
    const updatedChats = chats.map((chat) => {
      if (chat.users.receiver._id === data.receiver) {
        return {
          ...chat,
          messages: [chat.messages, data.message],
        };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  const onChatDeleted = (receiverId) => {
    return setChats((prev) =>
      prev.filter((chat) => chat.users.receiver._id !== receiverId)
    );
  };

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
        chats,
        setChats,
        handleChats,
        onChatDeleted,
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
