import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { COLORS, FONTS } from "../constants";
import { useAppContext } from "../context/AppContext";
import { AvatarIcon } from "../constants/icons";
import { getFormattedDate } from "../helpers";

const ChatItem = ({ chat }) => {
  const navigation = useNavigation();
  const { user } = useAppContext();
  const receiver = chat?.users.find((us) => us._id !== user._id);
  const members = chat.users.map((member) => member._id);

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => navigation.navigate("Chat", { receiver, members })}
      style={styles.item}
    >
      <View style={styles.imageView}>
        <Image source={AvatarIcon} style={styles.image} />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.name} numberOfLines={1}>
            {receiver.username}
          </Text>
          <Text style={styles.time}>{getFormattedDate(chat.updatedAt)}</Text>
        </View>
        <Text style={styles.message} numberOfLines={1}>
          {chat.lastMessage?.message}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 10,
    backgroundColor: COLORS.white,
    marginTop: 5,
  },
  imageView: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: COLORS.gray,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 40,
    height: 40,
    tintColor: COLORS.ltblack,
  },
  name: {
    fontSize: 16,
    ...FONTS.SemiBold,
  },
  message: {
    marginRight: 10,
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  time: {
    marginLeft: "auto",
    fontSize: 10,
    ...FONTS.Regular,
  },
});
