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
  const [chats, setChats] = useState([]);

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
      socket.emit("add_user", { userId: user._id, username: user.username });
    }
  }, [user, location]);

  useEffect(() => {
    socket.on("online_users", (users) => setOnlineUsers(users));

    socket.on("receive_message", ({ msg, users }) => {
      const isChat = chats.find((chat) =>
        chat.users.some((us) => us._id === msg.sender)
      );
      if (isChat) {
        setChats((prev) =>
          prev
            .map((chat) => {
              if (chat.users.some((us) => us._id === msg.sender))
                return { ...chat, lastMessage: msg };
              return chat;
            })
            .sort(
              (a, b) =>
                new Date(b.lastMessage.createdAt) -
                new Date(a.lastMessage.createdAt)
            )
        );
      } else {
        const newChat = {
          _id: Date.now(),
          users: users.map((user) => ({
            _id: user.userId,
            username: user.username,
          })),
          lastMessage: msg,
        };
        setChats((prev) => [newChat, ...prev]);
      }
    });

    socket.on("chat_deleted", (senderId) => {
      const filteredChats = chats.filter((chat) => {
        if (!chat.users.some((us) => us._id === senderId)) return chat;
      });
      setChats(
        filteredChats.sort(
          (a, b) =>
            new Date(b.lastMessage.createdAt) -
            new Date(a.lastMessage.createdAt)
        )
      );
    });

    return () => {
      socket.off("online_users");
      socket.off("receive_message");
      socket.off("chat_deleted");
    };
  }, [socket, chats]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (user) {
        if (nextAppState === "active") {
          socket.connect();
          socket.emit("add_user", {
            userId: user._id,
            username: user.username,
          });
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
        chats,
        setChats,
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
