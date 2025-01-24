import { View, ScrollView } from "react-native";
import React, { useRef } from "react";
import { MessageItem } from "./messageItem";

export function MessageList({ messages, currentUser }) {
  const scrollViewRef = useRef(null);
  const handleContentSizeChange = () => {
    // Прокрутка к концу, как только содержимое изменяется
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 10 }}
      onContentSizeChange={handleContentSizeChange}
    >
      {messages.map((message, index) => (
        <MessageItem message={message} key={index} currentUser={currentUser} />
      ))}
    </ScrollView>
  );
}
