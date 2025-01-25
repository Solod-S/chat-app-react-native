import { View, FlatList } from "react-native";
import React from "react";
import { ChatItem } from "./chatItem";
import { useRouter } from "expo-router";

export function ChatList({ users, currentUser }) {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={(item, index) => String(index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        renderItem={({ item, index }) => (
          <ChatItem
            currentUser={currentUser}
            noBorder={index + 1 == users.length}
            router={router}
            index={index}
            item={item}
          />
        )}
      />
    </View>
  );
}
