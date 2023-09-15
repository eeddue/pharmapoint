import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { COLORS, FONTS, SHADOW } from "../../constants";
import * as Icons from "@expo/vector-icons";
import {
  Bubble,
  GiftedChat,
  MessageText,
  Send,
} from "react-native-gifted-chat";

const Chat = ({ route, navigation }) => {
  const { chat } = route.params;

  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "Hello developer",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "React Native",
          avatar: chat.image,
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const handleDelete = () => {
    setVisible((prev) => !prev);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <View style={styles.imageView}>
          <Image source={{ uri: chat.image }} style={styles.image} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {chat.name}
          </Text>
          <Text style={styles.status}>Online</Text>
        </View>
        <TouchableOpacity
          onPress={() => setVisible((prev) => !prev)}
          style={styles.delete}
          activeOpacity={0.5}
        >
          <Icons.SimpleLineIcons name="trash" size={20} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity>
          <Icons.Feather name="plus" size={30} color={COLORS.red} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={props.text}
          onChangeText={props.onTextChanged}
        />

        <Send {...props} disabled={!props.text.trim().length}>
          <Icons.Ionicons name="send" size={35} color={COLORS.red} />
        </Send>
      </View>
    );
  };

  const renderChatEmpty = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.empty}>Your have no recent messages.</Text>
    </View>
  );

  const renderMessageText = (props) => {
    return <MessageText style={styles.message} {...props} />;
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: { backgroundColor: COLORS.red },
          left: { backgroundColor: COLORS.gray },
        }}
      />
    );
  };

  const renderModal = () => {
    return (
      <Modal transparent visible={visible} animationType="slide">
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setVisible((prev) => !prev)}
        />
        <SafeAreaView style={[styles.modal, { padding: 10 }]}>
          <View style={{ padding: 10 }}>
            <View>
              <Text style={styles.bigText}>Delete your chat</Text>
              <Text style={styles.smallText}>
                Are you sure you want to delete your conversation history with{" "}
                <Text style={{ color: COLORS.red }}>{chat.name}</Text>?
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => setVisible((prev) => !prev)}
                style={[styles.action, { backgroundColor: COLORS.gray }]}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleDelete}
                style={[styles.action, { backgroundColor: COLORS.red }]}
              >
                <Text style={[styles.actionText, { color: COLORS.white }]}>
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderHeader()}

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          avatar:
            "https://icon-library.com/images/icon-avatar/icon-avatar-19.jpg",
        }}
        textInputStyle={styles.input}
        renderInputToolbar={renderInputToolbar}
        renderChatEmpty={renderChatEmpty}
        renderChatFooter={() => <View style={{ height: 25 }} />}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        showUserAvatar-
        alwaysShowSend
      />
      {renderModal()}
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  header: {
    padding: 10,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    textAlign: "center",
    ...FONTS.Bold,
    fontSize: 20,
  },
  imageView: {
    height: 45,
    width: 45,
    borderRadius: 50,
    backgroundColor: COLORS.gray,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  name: {
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  status: {
    ...FONTS.Regular,
    fontSize: 12,
    color: COLORS.red,
  },
  footer: {
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    position: "fixed",
    bottom: 25,
  },
  input: {
    ...FONTS.Regular,
    fontSize: 15,
    backgroundColor: COLORS.gray,
    flex: 1,
    height: "100%",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    color: COLORS.ltblack,
  },
  empty: {
    ...FONTS.Regular,
    color: COLORS.ltblack,
  },
  message: {
    ...FONTS.Regular,
    fontSize: 14,
  },
  modal: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    ...SHADOW,
    borderTopColor: COLORS.gray,
    borderTopWidth: 1,
  },
  bigText: {
    fontSize: 20,
    ...FONTS.Bold,
    textAlign: "center",
  },
  smallText: {
    fontSize: 14,
    ...FONTS.Regular,
    textAlign: "center",
    color: COLORS.ltblack,
    marginTop: 20,
    marginBottom: 50,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  action: {
    height: 50,
    flex: 1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontSize: 15,
    ...FONTS.SemiBold,
  },
  delete: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
