import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";

const ios = Platform.OS == "ios";

export function CustomKeyboardView({ children, inChat }) {
  let kavConfig = {};
  let scrollViewConfig = {};
  if (inChat) {
    kavConfig = { keyboardVerticalOffset: 90 };
    scrollViewConfig = { contentContainerStyle: { flex: 1 } };
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      {...kavConfig}
      behavior={ios ? "padding" : "height"}
    >
      <ScrollView
        style={{ flex: 1 }}
        {...scrollViewConfig}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled" // prevents losing focus and closing the keyboard in chat
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
