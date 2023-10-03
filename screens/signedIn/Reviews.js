import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ReviewItem from "../../components/ReviewItem";
import { COLORS, FONTS } from "../../constants";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const Reviews = ({ route }) => {
  const navigation = useNavigation();
  const { pharmacy } = route.params;

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      await axios
        .get(`/reviews/${pharmacy._id}`)
        .then(({ data }) => setReviews(data.reviews))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    });

    return () => unsub;
  }, []);

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      {loading ? (
        <View style={{ flex: 1 }}>
          <ActivityIndicator
            color={COLORS.red}
            size={25}
            style={{ marginTop: 30 }}
          />
        </View>
      ) : (
        <FlatList
          bounces={false}
          data={reviews}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>No one has reviewed this pharmacy.</Text>
          )}
          keyExtractor={(item) => item._id}
          renderItem={({ item, index }) => (
            <ReviewItem index={index} review={item} />
          )}
          contentContainerStyle={{
            backgroundColor: COLORS.white,
            padding: 10,
          }}
        />
      )}
    </View>
  );
};

export default Reviews;

const styles = StyleSheet.create({
  empty: {
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 30,
  },
});
