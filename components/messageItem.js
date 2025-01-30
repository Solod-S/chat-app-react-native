import { View, Text, ScrollView } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export function MessageItem({ message, currentUser }) {
  const formatDate = timestamp => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}`;

    return `${day < 10 ? "0" : ""}${day}.${
      month < 10 ? "0" : ""
    }${month}.${year} ${formattedTime}`;
  };

  const formattedDate = message.createdAt ? formatDate(message.createdAt) : "";

  if (currentUser?.uid === message?.userId) {
    return (
      <View className="flex-row justify-end mb-3 mr-3">
        <View style={{ width: wp(80) }}>
          <View className="flex self-end p-3 bg-indigo-100 border border-neutral-200 rounded-2xl rounded-br-none">
            <Text
              className="font-semibold"
              style={{ fontSize: hp(0.9), color: "#737373", opacity: 0.4 }}
            >
              {message.senderName}
            </Text>
            <Text style={{ fontSize: hp(1.9) }}>{message?.text}</Text>
            {formattedDate && (
              <Text
                style={{
                  fontSize: hp(0.8),
                  color: "#737373",
                  marginTop: 5,
                  opacity: 0.4,
                }}
              >
                {formattedDate}
              </Text>
            )}
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View style={{ width: wp(80) }} className="ml-3 mb-3">
        <View className="flex self-start p-3 px-4 rounded-2xl rounded-bl-none bg-white border border-neutral-200">
          <Text
            className="font-semibold"
            style={{ fontSize: hp(0.9), color: "#737373", opacity: 0.4 }}
          >
            {message.senderName}
          </Text>
          <Text style={{ fontSize: hp(1.9) }}>{message?.text}</Text>
          {formattedDate && (
            <Text
              style={{
                fontSize: hp(0.8),
                color: "#737373",
                marginTop: 5,
                opacity: 0.4,
              }}
            >
              {formattedDate}
            </Text>
          )}
        </View>
      </View>
    );
  }
}
