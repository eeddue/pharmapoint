import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS } from "../../constants";
import ActionsModal from "../../components/ActionsModal";
import { useAppContext } from "../../context/AppContext";
import { showToast, updateLocalUser } from "../../helpers";

const PharmacyDetails = ({ route, navigation }) => {
  const { pharmacy } = route.params;
  const { user, setUser } = useAppContext();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    await axios
      .delete(`/pharmacies/${pharmacy._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then(async () => {
        const newUser = await updateLocalUser("delete", pharmacy._id);
        setUser(newUser);
        setVisible(false);
        navigation.popToTop();
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setLoading(false));
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>{pharmacy.name}</Text>
        <View style={{ width: 25 }} />
      </View>
      <ScrollView
        contentContainerStyle={{ flex: 1, padding: 10 }}
        bounces={false}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("CreatePharmacy", { pharmacy })}
          activeOpacity={0.5}
          style={styles.button}
        >
          <Icons.AntDesign name="edit" size={25} color={COLORS.green} />
          <Text style={styles.buttonText}>Edit pharmacy details</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddProduct", { pharmacy })}
          activeOpacity={0.5}
          style={styles.button}
        >
          <Icons.AntDesign name="plus" size={25} />
          <Text style={styles.buttonText}>Add pharmacy products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          activeOpacity={0.5}
          style={styles.button}
        >
          <Icons.SimpleLineIcons name="trash" size={25} color={COLORS.red} />
          <Text style={[styles.buttonText, { color: COLORS.red }]}>
            Delete this pharmacy
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ActionsModal
        visible={visible}
        setVisible={setVisible}
        loading={loading}
        title="Delete pharmacy"
        handleAction={handleDelete}
        text={`Are you sure you want to delete this pharmacy? This action can't be undone.`}
      />
    </View>
  );
};

export default PharmacyDetails;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: { ...FONTS.SemiBold, fontSize: 15 },
  button: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    ...FONTS.Regular,
    fontSize: 15,
  },
});
