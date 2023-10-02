import {
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS } from "../../constants";
import PharmacyItem from "../../components/PharmacyItem";

const Pharmacies = ({ navigation }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [name, setName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await getPharmacies();
      setPharmacies(response);
      setLoading(false);
    })();
  }, []);

  const getPharmacies = async () => {
    try {
      const { data } = await axios.get("/pharmacies");
      return data.pharmacies;
    } catch (error) {
      console.log(error, "pharmacies");
      return [];
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const response = await getPharmacies();
    setPharmacies(response);
    setRefreshing(false);
  };

  const searchProducts = async () => {
    setSearching(true);
    await axios
      .get(`/pharmacies?name=${name.trim()}`)
      .then(({ data }) => setPharmacies(data.pharmacies))
      .catch((error) => console.log(error))
      .finally(() => setSearching(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <TextInput
          placeholder="Search"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <Pressable
          style={styles.search}
          onPress={searchProducts}
          disabled={loading || searching || !name.trim().length}
        >
          {searching ? (
            <ActivityIndicator color={COLORS.red} size={25} />
          ) : (
            <Icons.Ionicons
              name="search-outline"
              size={25}
              color={COLORS.red}
            />
          )}
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator
          size={30}
          color={COLORS.red}
          style={{ marginTop: 30 }}
        />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(phar) => phar._id}
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

export default Pharmacies;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  input: {
    height: 40,
    ...FONTS.Regular,
    borderRadius: 10,
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 15,
  },
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
  search: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
