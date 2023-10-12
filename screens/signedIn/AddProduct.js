import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { COLORS, FONTS, SHADOW } from "../../constants";
import axios from "axios";
import * as Icons from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { pickImage, showToast } from "../../helpers";
import { useAppContext } from "../../context/AppContext";
import { categories } from "../../data";

const AddProduct = ({ route }) => {
  const navigation = useNavigation();
  const { pharmacy } = route.params;
  const { user } = useAppContext();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState("");

  const handleCreate = async () => {
    if (
      !name.trim() ||
      !description.trim() ||
      !price.trim() ||
      !image ||
      !category
    )
      return showToast("error", "Fields required", "Fill in all the fields.");

    const headers = {
      Authorization: `Bearer ${user?.token}`,
      "Content-Type": "multipart/form-data",
    };
    const data = new FormData();
    data.append("name", name.trim());
    data.append("description", description.trim());
    data.append("price", parseInt(price));
    data.append("image", {
      uri: image,
      name: image.split("/").pop(),
      type: "image/jpeg",
    });
    data.append("owner", pharmacy._id);
    data.append("category", category);
    setLoading(true);
    await axios
      .post("/products", data, { headers })
      .then(() => navigation.goBack())
      .catch((error) => showToast("error", "Error", error.response.data.msg))
      .finally(() => setLoading(false));
  };

  const handleVisible = () => setVisible((prev) => !prev);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: COLORS.white }}
      >
        {/* header */}
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} disabled={loading}>
            <Icons.Ionicons name="arrow-back" size={25} />
          </Pressable>
          <Text style={styles.headerText}>Add product</Text>
          <View style={{ width: 25 }} />
        </View>

        {/* details */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingHorizontal: 10, flex: 1 }}
        >
          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Product image</Text>
            <TouchableOpacity
              style={[
                styles.avatarView,
                !image && { justifyContent: "center", alignItems: "center" },
              ]}
              onPress={() => pickImage().then((url) => setImage(url))}
            >
              {image ? (
                <Image style={styles.image} source={{ uri: image }} />
              ) : (
                <Icons.Ionicons color={COLORS.ltblack} name="image" size={30} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>product name</Text>
            <TextInput
              editable={!loading}
              placeholder="Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Product description</Text>
            <TextInput
              editable={!loading}
              placeholder="Description"
              style={[styles.input, { height: 100 }]}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              editable={!loading}
              placeholder="100"
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity style={styles.select} onPress={handleVisible}>
              <View style={styles.selectView}>
                <Text style={styles.selectText}>Select</Text>
              </View>
              {category ? (
                <Text style={styles.selected} numberOfLines={1}>
                  {category}
                </Text>
              ) : null}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            disabled={loading}
            onPress={handleCreate}
          >
            {loading ? (
              <ActivityIndicator size={20} color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Add</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* categories modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable style={{ flex: 1 }} onPress={handleVisible} />
          <View style={styles.categories}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalText}>Select category</Text>
              <Pressable style={styles.close} onPress={handleVisible}>
                <Icons.Feather name="x" size={20} color={COLORS.black} />
              </Pressable>
            </View>
            {/* all categories */}

            {category && (
              <Text
                style={{ margin: 10, ...FONTS.SemiBold, color: COLORS.red }}
              >
                {category}
              </Text>
            )}
            <FlatList
              contentContainerStyle={{ padding: 10 }}
              data={categories}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => {
                const isSelected = item === category;
                const handlePress = () => {
                  setCategory(item);
                  handleVisible();
                };
                return (
                  <TouchableOpacity
                    onPress={handlePress}
                    style={[
                      styles.category,
                      {
                        backgroundColor: isSelected
                          ? COLORS.gray
                          : COLORS.white,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        { color: isSelected ? COLORS.red : COLORS.black },
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default AddProduct;

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
  label: {
    fontSize: 14,
    ...FONTS.Regular,
    marginBottom: 3,
  },
  input: {
    ...FONTS.Regular,
    height: 45,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    color: COLORS.ltblack,
  },
  getButton: {
    height: 45,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    color: COLORS.ltblack,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    height: 50,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
  },
  buttonText: {
    color: COLORS.white,
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  avatarView: {
    height: 100,
    width: 100,
    borderRadius: 30,
    backgroundColor: COLORS.gray,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  select: {
    ...FONTS.Regular,
    height: 45,
    backgroundColor: COLORS.gray,
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  selectView: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: COLORS.ltblack,
  },
  selectText: {
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  selected: {
    ...FONTS.Regular,
    color: COLORS.red,
    marginLeft: 10,
    fontSize: 12,
    marginRight: 70,
  },

  categories: {
    flex: 1,
    backgroundColor: COLORS.white,
    ...SHADOW,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  modalHeader: {
    borderBottomWidth: 0.8,
    borderBottomColor: COLORS.gray,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  modalText: {
    fontSize: 17,
    ...FONTS.SemiBold,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  category: {
    height: 50,
    justifyContent: "center",
    padding: 10,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 14,
    ...FONTS.Regular,
  },
});
