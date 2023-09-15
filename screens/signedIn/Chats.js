import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, FONTS } from "../../constants";
import ChatItem from "../../components/ChatItem";
import { chats as chatsList } from "../../data";
import { useAppContext } from "../../context/AppContext";
import AccessDenied from "../../components/AccessDenied";

const Chats = () => {
  const [chats, setChats] = useState([...chatsList]);
  const [fetching, setFetching] = useState(true);
  const { user } = useAppContext();

  useEffect(() => {
    setFetching(false);
  }, []);

  // if (!user) return <AccessDenied />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Chats</Text>
      </View>
      {fetching ? (
        <ActivityIndicator size={30} color={COLORS.red} />
      ) : (
        <FlatList
          data={chats}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Your have no chats.</Text>
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatItem chat={item} />}
          contentContainerStyle={{ flex: 1 }}
          bounces={false}
        />
      )}
    </View>
  );
};

export default Chats;

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
