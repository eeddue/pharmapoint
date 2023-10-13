import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import axios from "axios";
import { COLORS, FONTS } from "../../../constants";
import KeyboardWrapper from "../../../components/KeyboardWrapper";
import { showToast } from "../../../helpers";
import { useAppContext } from "../../../context/AppContext";

const Contact = ({ navigation }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAppContext();

  const handleSubmit = async () => {
    if (!message || !subject)
      return showToast(
        "error",
        "Missing fields.",
        "Subject and message required."
      );

    setLoading(true);
    const headers = { Authorization: `Bearer ${user?.token}` };
    await axios
      .post("/contact", { subject, message, email: user?.email }, { headers })
      .then(({ data }) => {
        showToast("success", "Sent", data.msg);
        navigation.goBack();
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setLoading(false));
  };

  return (
    <KeyboardWrapper>
      {/* header */}
      <View style={styles.header}>
        <Pressable disabled={loading} onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <Text style={styles.headerText}>Contact us</Text>
        <View style={{ width: 25 }} />
      </View>

      {/* contact details */}
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Text style={styles.text}>
          Write to us and we will get back to you very soon.
        </Text>

        <View style={styles.view}>
          <Text style={styles.label}>Subject</Text>
          <TextInput
            placeholder="Subject"
            placeholderTextColor={COLORS.ltblack}
            style={styles.input}
            autoFocus
            value={subject}
            onChangeText={setSubject}
            editable={!loading}
          />
        </View>

        <View style={styles.view}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            placeholder="Tell us more..."
            placeholderTextColor={COLORS.ltblack}
            style={[styles.input, { minHeight: 200 }]}
            numberOfLines={10}
            textAlignVertical="top"
            multiline
            value={message}
            onChangeText={setMessage}
            editable={!loading}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size={20} color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardWrapper>
  );
};

export default Contact;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  headerText: {
    ...FONTS.SemiBold,
    fontSize: 15,
  },
  text: {
    ...FONTS.Regular,
    marginVertical: 10,
  },
  view: {
    marginTop: 10,
  },
  label: {
    ...FONTS.SemiBold,
    fontSize: 13,
  },
  input: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: COLORS.gray,
    ...FONTS.Regular,
    marginTop: 5,
    color: COLORS.ltblack,
  },
  button: {
    height: 50,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
  },
  buttonText: {
    ...FONTS.SemiBold,
    color: COLORS.white,
  },
});
