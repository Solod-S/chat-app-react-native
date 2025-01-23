import { blurhash } from "@/ustils";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export function ChatItem({ item, index, router, noBorder }) {
  const openChatRoom = () => {
    router.push({ pathname: "/chatRoom", params: item });
  };

  return (
    <TouchableOpacity
      onPress={openChatRoom}
      className={`flex-row justify-between items-center gap-3 mx-3 mb-4 pb-2 ${
        noBorder ? "" : "border-b-[1px] border-b-neutral-200"
      }`}
    >
      <Image
        className="rounded-full"
        style={{
          height: hp(6),
          width: hp(6),
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
            Time
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(1.6) }}
          className="font-medium text-neutral-500"
        >
          Last message
        </Text>
      </View>
    </TouchableOpacity>
  );
}
