import React from "react";
import { View, Text } from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export function CustomMenuItems({ text, action, value, icon }) {
  return (
    <MenuOption onSelect={() => action(value)}>
      <View
        style={{
          paddingVertical: 6,
          paddingHorizontal: 8,
        }}
        className="px-4 flex-row justify-between items-center"
      >
        <Text
          style={{ fontSize: hp(1.8) }}
          className="font-semibold text-neutral-500"
        >
          {text}
        </Text>
        {icon}
      </View>
    </MenuOption>
  );
}
