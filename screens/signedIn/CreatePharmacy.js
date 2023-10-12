import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import * as Icons from "@expo/vector-icons";
import moment from "moment";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from "@react-navigation/native";

import { COLORS, FONTS } from "../../constants";
import { getCurrentLocation, showToast, updateLocalUser } from "../../helpers";
import { useAppContext } from "../../context/AppContext";

const CreatePharmacy = ({ route }) => {
  const { pharmacy } = route.params;
  const navigation = useNavigation();
  const { user, setUser } = useAppContext();

  const [visible, setVisible] = useState(false);
  const [openingTime, setOpeningTime] = useState(
    pharmacy?.openingTime || new Date()
  );
  const [closingTime, setClosingTime] = useState(
    pharmacy?.closingTime || new Date()
  );
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [getting, setGetting] = useState(false);
  const [location, setLocation] = useState(pharmacy?.location || null);
  const [name, setName] = useState(pharmacy?.name || "");
  const [license, setLicense] = useState(pharmacy?.license_no || "");
  const [id, setId] = useState(pharmacy?.owner_id_no.toString() || "");

  const handleLocation = async () => {
    setGetting(true);
    await getCurrentLocation()
      .then((loc) => setLocation(loc))
      .catch((err) => showToast("error", "Error", err))
      .finally(() => setGetting(false));
  };

  const handleCreate = async () => {
    if (!location || !name.trim() || !license.trim() || !id)
      return showToast("error", "Fields required.", "Fill in all the fields.");

    setLoading(true);
    const data = {
      name: name.trim(),
      license_no: license.trim(),
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      openingTime,
      closingTime,
      owner_id_no: parseInt(id),
    };

    const headers = { Authorization: `Bearer ${user.token}` };

    if (pharmacy) {
      await axios
        .patch(`/pharmacies/${pharmacy._id}`, data, { headers })
        .then(async () => navigation.goBack())
        .catch((error) => showToast("error", "Sorry", error.response.data.msg))
        .finally(() => setLoading(false));
    } else {
      await axios
        .post("/pharmacies", data, { headers })
        .then(async ({ data }) => {
          const newUser = await updateLocalUser("add", data.pharmacy._id);
          setUser(newUser);
          navigation.goBack();
        })
        .catch((error) => showToast("error", "Sorry", error.response.data.msg))
        .finally(() => setLoading(false));
    }
  };

  const togglePicker = (src) => {
    setVisible((prev) => !prev);
    setSource(src);
  };

  const formattedDate = (date) => moment(date).format("h:mm A");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: COLORS.white }}
    >
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} disabled={loading}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>
          {pharmacy ? "Update" : "Register"} Pharmacy
        </Text>
        <View style={{ width: 25 }} />
      </View>

      {/* details */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ paddingHorizontal: 10, flex: 1 }}
      >
        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Pharmacy name</Text>
          <TextInput
            editable={!loading}
            placeholder="Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>National ID</Text>
          <TextInput
            editable={!loading}
            placeholder="6574848"
            style={styles.input}
            value={id}
            keyboardType="number-pad"
            onChangeText={(value) => setId(value.trim())}
          />
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Operating license</Text>
          <TextInput
            editable={!loading}
            placeholder="JVHI8VNG8F"
            style={styles.input}
            value={license}
            onChangeText={setLicense}
          />
        </View>

        <View style={{ marginTop: 15, flexDirection: "row", gap: 10 }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Opening time</Text>
            <Pressable
              style={styles.timeButton}
              onPress={() => togglePicker("opening")}
            >
              <Text style={styles.time}>{formattedDate(openingTime)}</Text>
              <Icons.Entypo name="chevron-small-down" size={20} />
            </Pressable>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Closing time</Text>
            <Pressable
              style={styles.timeButton}
              onPress={() => togglePicker("closing")}
            >
              <Text style={styles.time}>{formattedDate(closingTime)}</Text>
              <Icons.Entypo name="chevron-small-down" size={20} />
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <Text style={styles.label}>Location</Text>
          <TouchableOpacity
            disabled={getting || loading}
            style={[
              styles.getButton,
              { backgroundColor: location ? COLORS.green : COLORS.gray },
            ]}
            onPress={handleLocation}
          >
            {getting ? (
              <ActivityIndicator size={20} color={COLORS.black} />
            ) : (
              <Text
                style={[
                  styles.label,
                  { color: location ? COLORS.white : COLORS.black },
                ]}
              >
                {location ? "We got it" : "Get current location"}
              </Text>
            )}
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
            <Text style={styles.buttonText}>
              {pharmacy ? "Update" : "Create"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
      <DateTimePickerModal
        isVisible={visible}
        mode="time"
        onConfirm={(date) => {
          if (source === "opening") {
            setOpeningTime(date);
          } else {
            setClosingTime(date);
          }
          togglePicker();
        }}
        onCancel={togglePicker}
      />
    </KeyboardAvoidingView>
  );
};

export default CreatePharmacy;

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
    ...FONTS.SemiBold,
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
  timeButton: {
    height: 45,
    borderRadius: 5,
    justifyContent: "space-between",
    backgroundColor: COLORS.gray,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  time: {
    ...FONTS.SemiBold,
    color: COLORS.red,
  },
});
