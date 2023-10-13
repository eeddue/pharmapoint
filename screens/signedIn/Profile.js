import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";
import * as Icons from "@expo/vector-icons";
import { COLORS, FONTS } from "../../constants";
import { AvatarIcon } from "../../constants/icons";
import { more } from "../../data";
import { useAppContext } from "../../context/AppContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AccessDenied from "../../components/AccessDenied";
import { useNavigation } from "@react-navigation/native";
import { showToast } from "../../helpers";
import socket from "../../context/socket";

const renderMore = (role) => {
  const navigation = useNavigation();
  return (
    <View>
      {more.map((item, index) =>
        index === 0 && role !== "pharmacy" ? null : (
          <TouchableOpacity
            onPress={() => navigation.navigate(item.link)}
            activeOpacity={0.5}
            key={index}
            style={[styles.moreItem, { borderTopWidth: index === 0 ? 1 : 0 }]}
          >
            <Image style={styles.itemImage} source={item.icon} />
            <Text style={{ ...FONTS.Regular }}>{item.title}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
};

const Profile = () => {
  const { user, setUser } = useAppContext();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user")
      .then(() => {
        setUser(null);
        socket.disconnect();
      })
      .catch(() =>
        showToast(
          "error",
          "Sorry",
          "There was an error logging out. Please try again."
        )
      );
  };

  if (!user) return <AccessDenied />;

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.white }}
        bounces={false}
      >
        <View style={styles.avatarView}>
          <Image style={styles.avatar} source={AvatarIcon} />
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user.username}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Email address</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.view}>
          <Text style={styles.label}>Joined on</Text>
          <Text style={styles.value}>
            {new Date(user.createdAt).toDateString()}
          </Text>
        </View>

        {renderMore(user.role)}

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleLogout}
          style={[
            styles.view,
            { flexDirection: "row", alignItems: "center", gap: 10 },
          ]}
        >
          <Icons.Feather name="power" size={20} color={COLORS.red} />

          <Text style={[styles.value, { color: COLORS.red }]}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
  avatar: { height: 60, width: 60, tintColor: COLORS.ltblack },
  view: { padding: 10, borderTopColor: COLORS.gray, borderTopWidth: 1 },
  label: {
    ...FONTS.Regular,
    fontSize: 13,
    color: COLORS.ltblack,
    marginBottom: 2,
  },
  value: { ...FONTS.SemiBold, fontSize: 13 },
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
