import { View, Text, ScrollView } from "react-native";
import React from "react";
import { MessageItem } from "./messageItem";

export function MessageList({ messages, currentUser }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 10 }}
    >
      {messages.map((message, index) => (
        <MessageItem message={message} key={index} currentUser={currentUser} />
      ))}
    </ScrollView>
  );
}
