import { FlatList, View } from "react-native";
import React, { useEffect, useState } from "react";
import ReviewItem from "../../components/ReviewItem";
import { COLORS } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import LoadingMore from "../../components/LoadingMore";
import { getPharmacyReviews } from "../../api";

const Reviews = ({ route }) => {
  const { pharmacy } = route.params;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const unsub = navigation.addListener("focus", async () => {
      const { reviews, pages } = await getPharmacyReviews(pharmacy._id, skip);
      setCurrentPage((prev) => prev + 1);
      setPages(pages);
      setReviews(reviews);
      setLoading(false);
    });

    return unsub;
  }, [navigation]);

  const loadMore = async () => {
    if (currentPage === pages || pages === 0) return;
    setSkip(currentPage * 20);
    setCurrentPage((prev) => prev + 1);
    setFetching(true);
    const { reviews: more } = await getPharmacyReviews(pharmacy._id, skip);
    setReviews(reviews.concat(more));
    setFetching(false);
  };

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <FlatList
        bounces={false}
        data={reviews}
        ListEmptyComponent={
          <ListEmptyComponent
            loading={loading}
            text="No one has reviewed this pharmacy."
          />
        }
        ListFooterComponent={loading || fetching ? LoadingMore : null}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <ReviewItem index={index} review={item} />
        )}
        onEndReached={loadMore}
        contentContainerStyle={{
          backgroundColor: COLORS.white,
          padding: 10,
        }}
      />
    </View>
  );
};

export default Reviews;
