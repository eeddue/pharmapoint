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
import { formatMessages, showToast } from "../../helpers";
import { getChatMessages } from "../../api";

const Chat = ({ route }) => {
  const { receiver, members } = route.params;
  const { user, onlineUsers } = useAppContext();
  const navigation = useNavigation();

  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [visible, setVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [typing, setTyping] = useState(false);

  const isOnline = onlineUsers.some((user) => user.userId === receiver._id);
  const skip = chatMessages.length;
  const headers = { Authorization: `Bearer ${user.token}` };

  useEffect(() => {
    (async () => {
      const { messages, pages } = await getChatMessages(
        receiver._id,
        skip,
        headers
      );
      setChatMessages(formatMessages(messages));
      setTotalPages(pages);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    socket.on("receive_message", (msg) => {
      if (!members.includes(msg.sender)) return;
      const newMessage = {
        _id: msg._id,
        text: msg.message,
        createdAt: msg.createdAt,
        user: {
          _id: msg.sender,
        },
      };
      setChatMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessage)
      );
    });

    socket.on("receiver_typing", (senderId) => {
      if (senderId === receiver._id) {
        setTyping(true);
      }
    });

    socket.on("receiver_done_typing", (senderId) => {
      if (senderId === receiver._id) {
        setTyping(false);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("receiver_typing");
      socket.off("receiver_done_typing");
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
        socket.emit("sender_done_typing", {
          sender: user?._id,
          receiver: receiver._id,
        });
        setChatMessages((previousMessages) =>
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
        setVisible((prev) => !prev);
        navigation.goBack();
      })
      .catch((error) => showToast("error", "Sorry", error.response.data.msg))
      .finally(() => setDeleting(false));
  };

  const loadMoreMessages = async () => {
    if (totalPages === currentPage) return;
    setFetching(true);
    setCurrentPage((prev) => prev + 1);
    const { messages, pages } = await getChatMessages(
      receiver._id,
      skip,
      headers
    );
    const msgs = formatMessages(messages);
    setChatMessages((prev) => prev.concat(msgs));
    setTotalPages(pages);
    setFetching(false);
  };

  const renderHeader = () => {
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
            {receiver.username}
          </Text>
          <Text
            style={[
              styles.status,
              { color: isOnline ? COLORS.green : COLORS.red },
            ]}
            numberOfLines={1}
          >
            {typing ? "Typing..." : isOnline ? "Online" : "Offline"}
          </Text>
        </View>
        {chatMessages.length ? (
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
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={props.text}
          onChangeText={(value) => {
            props.onTextChanged(value);
            if (value.trim().length) {
              socket.emit("sender_typing", {
                sender: user?._id,
                receiver: receiver._id,
              });
            } else {
              socket.emit("sender_done_typing", {
                sender: user?._id,
                receiver: receiver._id,
              });
            }
          }}
          editable={!deleting}
          autoFocus
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
          messages={chatMessages}
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
          scrollToBottom={true}
          scrollToBottomComponent={() => (
            <Icons.AntDesign name="arrowdown" size={20} />
          )}
          alwaysShowSend
          infiniteScroll={true}
          loadEarlier={currentPage < totalPages}
          onLoadEarlier={loadMoreMessages}
          isLoadingEarlier={fetching}
          messagesContainerStyle={
            !chatMessages.length && {
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
    marginRight: 10,
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
