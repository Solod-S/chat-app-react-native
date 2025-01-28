import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";
import { startOfMonth, endOfMonth } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChatRoomHeader, MessageList, CustomKeyboardView } from "@/components/";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "@expo/vector-icons/Feather";
import { useAuth } from "../../context/authContext";
import { getRoomId } from "../../utils/getRoomId";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { sendPushNotification } from "../../utils/notificationHelper";

export default function ChatRoom() {
  const router = useRouter();
  const { user } = useAuth();
  const item = useLocalSearchParams();
  const scrollViewRef = useRef(null);
  const textRef = useRef("");
  const inputRef = useRef(null);
  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState([]);

  // get room msgs
  useEffect(() => {
    const roomId = getRoomId(user?.userId, item?.userId);
    setRoomId(roomId);

    createRoomIfNotExist(roomId);

    const now = new Date();
    const startOfLastMonth = startOfMonth(now);
    const endOfLastMonth = endOfMonth(now);

    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");
    const q = query(
      messageRef,
      where("createdAt", ">=", startOfLastMonth),
      where("createdAt", "<=", endOfLastMonth),
      orderBy("createdAt", "asc")
    );

    let unSub = onSnapshot(q, snapshot => {
      let allMessages = snapshot.docs.map(doc => {
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    return unSub;
  }, [user?.userId, item?.userId]);

  // update msgs status
  useEffect(() => {
    const roomId = getRoomId(user?.userId, item?.userId);
    console.log(`roomId`, roomId);
    const docRef = doc(db, "rooms", roomId);
    const messageRef = collection(docRef, "messages");

    // Фильтрация сообщений с isRead: false и userId равным item?.userId
    const unreadQuery = query(
      messageRef,
      where("isRead", "==", false),
      where("userId", "==", item?.userId)
    );

    // Слушатель для обновления статуса прочитанности
    const unsubscribe = onSnapshot(unreadQuery, snapshot => {
      snapshot.docs.forEach(doc => {
        updateDoc(doc.ref, { isRead: true }).catch(error => {
          console.error("Ошибка при обновлении статуса isRead:", error);
        });
      });
    });

    return () => {
      unsubscribe();
    };
  }, [user?.userId, item?.userId]);

  // update scroll view keyboard
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      updateScrollView
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  // update scroll view position
  useEffect(() => {
    updateScrollView();
  }, [messages]);
  const createRoomIfNotExist = async roomId => {
    try {
      await setDoc(doc(db, "rooms", roomId), {
        roomId,
        createdAt: Timestamp.fromDate(new Date()),
      });
    } catch (error) {
      console.log(`Error in createRoomIfNotExist: `, error);
    }
  };

  const handleSendMessage = async () => {
    try {
      let message = textRef.current.trim();

      if (!message) return;
      let tokensArray = [];
      if (item?.tokens) {
        tokensArray = item.tokens.split(",");
      }

      if (tokensArray.length > 0) {
        await sendPushNotification(tokensArray, {
          title: "New message",
          body: message,
          item: user,
        });
      }

      const docRef = doc(db, "rooms", roomId);
      const messageRef = collection(docRef, "messages");

      // clear input
      textRef.current = "";
      if (inputRef) inputRef?.current?.clear();

      const newDoc = await addDoc(messageRef, {
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date()),
        isRead: false,
      });
      console.log("new message id: ", newDoc.id);
    } catch (error) {
      console.log(`Error in handleSendMessage: `, error);
      Alert.alert("Message", error.message);
    }
  };

  const updateScrollView = () => {
    setTimeout(() => {
      // Прокрутка к концу, как только содержимое изменяется
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} myProfile={user} router={router} />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
          <View className="flex-1">
            <MessageList
              scrollViewRef={scrollViewRef}
              handleContentSizeChange={updateScrollView}
              messages={messages}
              currentUser={user}
            />
          </View>
          <View style={{ marginBottom: hp(2.7) }} className="pt-2 mx-3">
            <View className="flex-row justify-between bg-white border border-neutral-300 rounded-full pl-5 p-2">
              <TextInput
                ref={inputRef}
                onChangeText={value => {
                  textRef.current = value;
                }}
                style={{ fontSize: hp(2) }}
                className="flex-1 mr-2"
                placeholder="Type message"
              ></TextInput>
              <TouchableOpacity
                onPress={handleSendMessage}
                onPressOut={() => inputRef.current?.focus()} // предотвращает потерю фокуса и закрытие клавиатуры
                style={{
                  aspectRatio: 1,
                }}
                className="bg-neutral-200 p-2 mr-[1px] rounded-full justify-center items-center"
              >
                <Feather name="send" size={hp(2.7)} color="#737373" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
