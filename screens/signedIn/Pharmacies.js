import {
  StyleSheet,
  Pressable,
  View,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";

import { COLORS, FONTS } from "../../constants";
import PharmacyItem from "../../components/PharmacyItem";
import LoadingMore from "../../components/LoadingMore";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import { getPharmacies, searchPharmacies } from "../../api";

const Pharmacies = ({ navigation }) => {
  const [pharmacies, setPharmacies] = useState([]);
  const [name, setName] = useState("");
  const [pages, setPages] = useState(0);
  const [skip, setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const { pharmacies, pages } = await getPharmacies(skip);
      setPharmacies(pharmacies);
      setPages(pages);
      setLoading(false);
    })();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const { pharmacies, pages } = await getPharmacies(skip);
    setPharmacies(pharmacies);
    setPages(pages);
    setRefreshing(false);
  };

  const searchProducts = async () => {
    setSearching(true);
    const { pharmacies, pages } = await searchPharmacies(name);
    setPages(pages);
    setPharmacies(pharmacies);
    setSearching(false);
  };

  const loadMore = async () => {
    if (currentPage === pages || pages === 0) return;
    setSkip(currentPage * 20);
    setCurrentPage((prev) => prev + 1);
    setFetching(true);
    const { pharmacies: more } = await getPharmacies(skip);
    setPharmacies(pharmacies.concat(more));
    setFetching(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <TextInput
          placeholder="Search for pharmacies..."
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

      {/* pharmacies */}

      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 10, flex: 1 }}
        renderItem={({ item, index }) => (
          <PharmacyItem index={index} pharmacy={item} />
        )}
        ListEmptyComponent={
          <ListEmptyComponent loading={loading} text="No nearby pharmacies." />
        }
        ListFooterComponent={fetching || loading ? LoadingMore : null}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.red]}
            tintColor={COLORS.red}
          />
        }
      />
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
    backgroundColor: COLORS.gray,
    paddingHorizontal: 15,
    color: COLORS.ltblack,
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
