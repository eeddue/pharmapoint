import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";

import { COLORS, FONTS } from "../../constants";
import ChatItem from "../../components/ChatItem";
import { useAppContext } from "../../context/AppContext";
import AccessDenied from "../../components/AccessDenied";

const Inbox = ({ navigation }) => {
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user, chats, setChats } = useAppContext();

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      const response = await getChats();
      setChats(response);
      setFetching(false);
    });

    return unsub;
  }, [navigation]);

  const getChats = async () => {
    if (!user) return;
    const headers = { Authorization: `Bearer ${user.token}` };
    try {
      const { data } = await axios.get("/chats", { headers });
      return data.chats;
    } catch (error) {
      console.log(error, "chats");
      return [];
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const response = await getChats();
    setChats(response);
    setRefreshing(false);
  };

  if (!user) return <AccessDenied />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inbox</Text>
      </View>
      {fetching ? (
        <ActivityIndicator
          size={30}
          color={COLORS.red}
          style={{ marginVertical: 10 }}
        />
      ) : (
        <FlatList
          data={chats}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Inbox is empty.</Text>
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <ChatItem chat={item} />}
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              onRefresh={onRefresh}
              refreshing={refreshing}
              tintColor={COLORS.red}
              colors={[COLORS.red]}
            />
          }
        />
      )}
    </View>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 15,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
