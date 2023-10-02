import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import * as Icons from "@expo/vector-icons";
import {
  Bubble,
  GiftedChat,
  MessageText,
  Send,
} from "react-native-gifted-chat";
import axios from "axios";

import { COLORS, FONTS, SHADOW } from "../../constants";
import { useAppContext } from "../../context/AppContext";
import { useNavigation } from "@react-navigation/native";
import socket from "../../context/socket";
import ActionsModal from "../../components/ActionsModal";
import { AvatarIcon } from "../../constants/icons";
import { showToast } from "../../helpers";

const Chat = ({ route }) => {
  const { receiver } = route.params;
  const { user, onlineUsers, handleChats, onChatDeleted } = useAppContext();
  const navigation = useNavigation();

  const [messages, setMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  const headers = { Authorization: `Bearer ${user.token}` };

  const handleMessages = (msgs) =>
    msgs
      .map((msg) => {
        return {
          _id: msg._id,
          text: msg.message,
          createdAt: msg.createdAt,
          user: {
            _id: msg.sender,
          },
        };
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    (async () => {
      await axios
        .get(`/chats/${receiver._id}`, { headers })
        .then(({ data }) => setMessages(handleMessages(data.messages)))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    })();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      const newMessage = {
        _id: msg._id,
        text: msg.message,
        createdAt: msg.createdAt,
        user: {
          _id: msg.sender,
        },
      };
      handleChats({ receiver: receiver._id, message: msg });
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessage)
      );
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const onSend = useCallback(async (messages = []) => {
    await axios
      .post(
        "/chats",
        { receiver: receiver._id, message: messages[0].text },
        { headers }
      )
      .then(({ data }) => {
        socket.emit("send_message", data.message);
        handleChats({ receiver: receiver._id, message: data.message });

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, messages)
        );
      })
      .catch((error) => alert(error.response.data.msg));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    await axios
      .delete(`/chats/${receiver._id}`, { headers })
      .then(() => {
        onChatDeleted(receiver._id);
        setVisible((prev) => !prev);
        navigation.goBack();
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setDeleting(false));
  };

  const renderHeader = () => {
    const isOnline = onlineUsers.some((user) => user.userId === receiver._id);
    return (
      <View style={styles.header}>
        <Pressable disabled={deleting} onPress={() => navigation.goBack()}>
          <Icons.Ionicons name="arrow-back" size={25} />
        </Pressable>
        <View style={styles.imageView}>
          <Image source={AvatarIcon} style={styles.image} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name} numberOfLines={1}>
            {receiver.name}
          </Text>
          <Text
            style={[
              styles.status,
              { color: isOnline ? COLORS.green : COLORS.red },
            ]}
          >
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
        {messages.length ? (
          <TouchableOpacity
            disabled={deleting}
            onPress={() => setVisible((prev) => !prev)}
            style={styles.delete}
            activeOpacity={0.5}
          >
            <Icons.SimpleLineIcons name="trash" size={20} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderInputToolbar = (props) => {
    return (
      <View style={styles.footer}>
        <TouchableOpacity disabled={deleting}>
          <Icons.Feather name="plus" size={30} color={COLORS.red} />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={props.text}
          onChangeText={props.onTextChanged}
          editable={!deleting}
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

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {renderHeader()}

      {loading ? (
        <ActivityIndicator
          size={25}
          color={COLORS.red}
          style={{ marginTop: 30 }}
        />
      ) : (
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{ _id: user._id }}
          textInputStyle={styles.input}
          renderInputToolbar={renderInputToolbar}
          renderChatEmpty={renderChatEmpty}
          renderChatFooter={() => <View style={{ height: 25 }} />}
          renderBubble={renderBubble}
          renderMessageText={renderMessageText}
          showUserAvatar={false}
          renderAvatar={null}
          alwaysShowSend
          messagesContainerStyle={
            !messages.length && {
              transform: [{ scaleY: -1 }],
            }
          }
        />
      )}
      <ActionsModal
        visible={visible}
        setVisible={setVisible}
        loading={deleting}
        text={`Are you sure you want to delete your conversation history with ${receiver.name}`}
        handleAction={handleDelete}
        title="Delete chat"
      />
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
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: 30, height: 30, tintColor: COLORS.ltblack },
  name: {
    ...FONTS.SemiBold,
    fontSize: 16,
  },
  status: {
    ...FONTS.Regular,
    fontSize: 12,
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
