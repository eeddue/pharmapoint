import { KeyboardAvoidingView, Platform } from "react-native";
import { COLORS } from "../constants";

const KeyboardWrapper = ({ children }) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardWrapper;
