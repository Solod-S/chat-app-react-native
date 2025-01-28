import { db } from "@/firebaseConfig";
import { blurhash, formatDate, getRoomId } from "@/utils";
import { Image } from "expo-image";
import {
  collection,
  doc,
  limit,
  orderBy,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export function ChatItem({ currentUser, item, index, router, noBorder }) {
  const [lastMessage, setLastMessage] = useState(undefined);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const openChatRoom = () => {
    router.push({ pathname: "/screens/chatRoom", params: item });
  };

  // get last msgs
  useEffect(() => {
    const roomId = getRoomId(currentUser?.userId, item?.userId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(messageRef, orderBy("createdAt", "desc"), limit(1));

    let unSub = onSnapshot(q, snapshot => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setLastMessage(allMessages[0] ? allMessages[0] : null);
    });
    return unSub;
  }, [currentUser?.userId, item?.userId]);

  // get unread msgs
  useEffect(() => {
    if (item?.userId) {
      const roomId = getRoomId(currentUser?.userId, item?.userId);
      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");
      const q = query(
        messageRef,
        where("isRead", "==", false),
        where("userId", "==", item?.userId)
      );

      const unSub = onSnapshot(q, snapshot => {
        setUnreadMessages(snapshot.docs.length);
      });

      return unSub;
    }
  }, [currentUser?.userId, item?.userId]);

  const renderLastMessage = () => {
    if (typeof lastMessage == "undefined") return "Loading...";
    if (lastMessage) {
      if (currentUser?.userId == lastMessage?.userId)
        return "You: " + lastMessage?.text;

      return lastMessage?.text;
    } else {
      return "Say Hi 👋";
    }
  };

  const renderTime = () => {
    if (lastMessage) {
      const date = lastMessage?.createdAt;
      const messageDate = new Date(date?.seconds * 1000);
      const today = new Date();

      if (
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear()
      ) {
        return "Today";
      }

      return formatDate(messageDate);
    }
  };

  const renderNotReadMessageCounter = () => {
    if (unreadMessages > 0) {
      if (unreadMessages > 99) return "99+";

      return unreadMessages;
    } else {
      return "";
    }
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between items-center gap-3 mx-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b-[1px] border-b-neutral-200"
      }`}
    >
      <Image
        style={{
          height: hp(6),
          width: hp(6),
          borderRadius: 50,
        }}
        source={{ uri: item?.profileUrl }}
        placeholder={blurhash}
        transition={500}
      />
      <View className="flex-1 gap-1">
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-semibold text-neutral-800"
          >
            {item.username}
          </Text>
          <Text
            style={{ fontSize: hp(1.8) }}
            className="font-medium text-neutral-500"
          >
            {renderTime()}
          </Text>
        </View>
        <View className="flex-row justify-between">
          <Text
            style={{ fontSize: hp(1.6) }}
            className="font-medium text-neutral-500"
          >
            {renderLastMessage()}
          </Text>
          <Text
            style={{
              fontSize: hp(1.6),
              backgroundColor: unreadMessages > 0 ? "#FFD700" : "transparent",
              color: unreadMessages > 0 ? "#000" : "#6B7280",
              padding: 5,
              borderRadius: 50,
            }}
            className={`font-medium ${unreadMessages > 0 ? "font-bold" : ""}`}
          >
            {renderNotReadMessageCounter()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
