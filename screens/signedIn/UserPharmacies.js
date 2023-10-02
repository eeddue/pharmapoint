import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import PharmacyItem from "../../components/PharmacyItem";

const UserPharmacies = ({ navigation }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAppContext();
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      await axios
        .get("/pharmacies/mine", { headers })
        .then(({ data }) => setPharmacies(data.pharmacies))
        .catch((error) => alert(error.response.data.msg))
        .finally(() => setLoading(false));
    });
    return () => {
      unsub;
    };
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await axios
      .get("/pharmacies/mine", { headers })
      .then(({ data }) => setPharmacies(data.pharmacies))
      .catch((error) => alert(error.response.data.msg))
      .finally(() => setRefreshing(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Your pharmacies</Text>
        <Pressable
          onPress={() =>
            navigation.navigate("CreatePharmacy", { pharmacy: null })
          }
        >
          <Icons.AntDesign name="plus" size={22} />
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          size={30}
          color={COLORS.red}
          style={{ margin: 30 }}
        />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <PharmacyItem index={index} pharmacy={item} />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No pharmacies found.</Text>
          )}
          contentContainerStyle={{ padding: 10 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.red]}
              tintColor={COLORS.red}
            />
          }
        />
      )}
    </View>
  );
};

export default UserPharmacies;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: 15,
    ...FONTS.SemiBold,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
