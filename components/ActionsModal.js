import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { COLORS, FONTS, SHADOW } from "../constants";

const ActionsModal = ({
  loading,
  visible,
  setVisible,
  text,
  handleAction,
  title,
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <Pressable
        style={{ flex: 1 }}
        onPress={() => setVisible((prev) => !prev)}
        disabled={loading}
      />
      <SafeAreaView style={[styles.modal, { padding: 10 }]}>
        <View style={{ padding: 10 }}>
          <View>
            <Text style={styles.bigText}>{title}</Text>
            <Text style={styles.smallText}>{text}?</Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              disabled={loading}
              activeOpacity={0.5}
              onPress={() => setVisible((prev) => !prev)}
              style={[styles.action, { backgroundColor: COLORS.gray }]}
            >
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              activeOpacity={0.5}
              onPress={handleAction}
              style={[styles.action, { backgroundColor: COLORS.red }]}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} size={20} />
              ) : (
                <Text style={[styles.actionText, { color: COLORS.white }]}>
                  Confirm
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ActionsModal;

const styles = StyleSheet.create({
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
