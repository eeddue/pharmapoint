import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS } from "../../../constants";
import KeyboardWrapper from "../../../components/KeyboardWrapper";

const Contact = ({ navigation }) => {
  const handleSubmit = async () => {};
  return (
    <KeyboardWrapper>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
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
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.button}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
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
