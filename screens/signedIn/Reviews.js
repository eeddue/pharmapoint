import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import { Rating } from "react-native-ratings";
import ReviewItem from "../../components/ReviewItem";
import { reviews } from "../../data";
import { COLORS, FONTS, SHADOW } from "../../constants";

const Reviews = ({ route }) => {
  const [visible, setVisible] = useState(false);

  const handleSubmit = () => {
    setVisible((prev) => !prev);
  };

  const ratingCompleted = (rating) => {
    console.log("Rating is: " + rating);
  };

  return (
    <>
      <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
        <FlatList
          data={reviews}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Your have no chats.</Text>
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ReviewItem index={index} review={item} />
          )}
          contentContainerStyle={{
            backgroundColor: COLORS.white,
            padding: 10,
          }}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => setVisible((prev) => !prev)}
        >
          <Text style={styles.buttonText}>Rate and Review</Text>
        </TouchableOpacity>
      </View>
      <Modal transparent animationType="slide" visible={visible}>
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setVisible((prev) => !prev)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.modal}
        >
          <SafeAreaView>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <Text style={styles.headerText}>
                  Leave a review about this pharmacy?
                </Text>
                <Pressable
                  onPress={() => setVisible((prev) => !prev)}
                  style={styles.close}
                >
                  <Icons.Feather name="x" size={25} />
                </Pressable>
              </View>
              <Rating
                onFinishRating={ratingCompleted}
                style={{ paddingVertical: 10 }}
                imageSize={25}
                startingValue={0}
                isDisabled={false}
                ratingColor="orange"
                type="custom"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter review..."
                multiline
                numberOfLines={5}
                textAlignVertical="top"
                autoFocus
              />
              <TouchableOpacity
                style={[styles.button]}
                activeOpacity={0.5}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </>
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
  button: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  buttonText: {
    ...FONTS.SemiBold,
    fontSize: 14,
    color: COLORS.white,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOW,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    padding: 10,
  },
  header: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  headerText: {
    textAlign: "center",
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  close: {
    position: "absolute",
    right: 0,
    top: 10,
  },
  input: {
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 10,
    minHeight: 150,
    ...FONTS.Regular,
    marginTop: 20,
  },
});
