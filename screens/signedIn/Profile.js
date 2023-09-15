import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants";
import { AvatarIcon } from "../../constants/icons";
import { pickImage } from "../../helpers";
import { more } from "../../data";

const renderMore = (items) => {
  return (
    <View>
      {more.map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.5}
          key={index}
          style={[styles.moreItem, { borderTopWidth: index === 0 ? 1 : 0 }]}
        >
          <Image style={styles.itemImage} source={item.icon} />
          <Text style={{ ...FONTS.Regular }}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const Profile = () => {
  const [image, setImage] = useState(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.avatarView}>
        {image ? (
          <Image
            style={{ width: "100%", height: "100%", borderRadius: 30 }}
            source={{ uri: image }}
          />
        ) : (
          <Image style={styles.avatar} source={AvatarIcon} />
        )}
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.edit}
          onPress={() => {
            pickImage().then((url) => setImage(url));
          }}
        >
          <Icons.Feather name="edit-2" size={15} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>eeddue</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Email address</Text>
        <Text style={styles.value}>example@abc.com</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.label}>Joined on</Text>
        <Text style={styles.value}>31/12/2022</Text>
      </View>

      {renderMore()}

      <TouchableOpacity
        activeOpacity={0.5}
        style={[
          styles.view,
          { flexDirection: "row", alignItems: "center", gap: 10 },
        ]}
      >
        <Icons.Feather name="power" size={20} color={COLORS.red} />

        <Text style={[styles.value, { color: COLORS.red }]}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  avatarView: {
    height: 100,
    width: 100,
    borderRadius: 30,
    backgroundColor: COLORS.gray,
    alignSelf: "center",
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    height: 60,
    width: 60,
    tintColor: COLORS.ltblack,
  },
  edit: {
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
    position: "absolute",
    bottom: 0,
    right: 0,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  view: {
    padding: 10,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  },
  label: {
    ...FONTS.Regular,
    fontSize: 13,
    color: COLORS.ltblack,
    marginBottom: 2,
  },
  value: {
    ...FONTS.SemiBold,
    fontSize: 15,
  },
  moreItem: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    padding: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
  },
  itemImage: { width: 20, height: 20, tintColor: COLORS.ltblack },
});
