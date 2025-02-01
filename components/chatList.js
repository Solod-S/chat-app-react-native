import { View, FlatList, Alert, Vibration } from "react-native";
import React, { useState } from "react";
import { ChatItem } from "./chatItem";
import { useRouter } from "expo-router";
import { deleteRoomMessages, getRoomId, removeFromFriendsList } from "@/utils";

import Toast from "react-native-toast-message";
import { useAuth } from "@/context/authContext";

export function ChatList({ users, currentUser }) {
  const { user, refresh } = useAuth();
  const router = useRouter();

  const deleteUser = async userId => {
    try {
      const roomId = getRoomId(user?.uid, userId);
      await deleteRoomMessages(roomId);
      const data = await removeFromFriendsList(user?.uid, userId);
      refresh({ friends: data.friends });

      Toast.show({
        type: "success",
        position: "top",
        text1: "User removed successfully",
        // text2: "You have successfully removed this user from your friends.",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    } catch (error) {
      console.log(`Error in deleteUser:`);
    }
  };

  const handleDelete = userId => {
    Vibration.vibrate(200); // Vibrate for 100ms before showing the Alert
    Alert.alert("Delete user?", "Are you sure you want to delete this chat?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => deleteUser(userId),
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, paddingVertical: 25 }}
        renderItem={({ item, index }) => (
          <ChatItem
            currentUser={currentUser}
            noBorder={index + 1 === users.length}
            router={router}
            index={index}
            item={item}
            onLongPress={() => handleDelete(item.userId)}
          />
        )}
      />
    </View>
  );
}
