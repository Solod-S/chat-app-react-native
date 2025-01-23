import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ChatRoomHeader, MessageList, CustomKeyboardView } from "@/components/";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Feather from "@expo/vector-icons/Feather";

export default function ChatRoom() {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [messages, setMessages] = useState([]);

  return (
    <CustomKeyboardView inChat={true}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <ChatRoomHeader user={item} router={router} />
        <View className="h-3 border-b border-neutral-300" />
        <View className="flex-1 justify-between bg-neutral-100 overflow-visible">
          <View className="flex-1">
            <MessageList messages={messages} />
          </View>
          <View style={{ marginBottom: hp(2.7) }} className="pt-2 mx-3">
            <View className="flex-row justify-between bg-white border border-neutral-300 rounded-full pl-5 p-2">
              <TextInput
                style={{ fontSize: hp(2) }}
                className="flex-1 mr-2"
                placeholder="Type message"
              />
              <TouchableOpacity
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
