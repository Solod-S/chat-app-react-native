import React from "react";
import { View, Text, Platform } from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { AntDesign, Feather } from "@expo/vector-icons";

import { blurhash } from "@/ustils";
import { useAuth } from "@/context/authContext";
import { CustomMenuItems } from "./customMenuItems";

const ios = Platform.OS == "ios";

export function HomeHeader() {
  const { user, logout } = useAuth();
  const { top } = useSafeAreaInsets();

  const handleProfile = () => {
    return;
  };

  const handleLogOut = async () => {
    await logout();
    return;
  };
  return (
    <View
      style={{
        paddingTop: ios ? top : top + 10,
      }}
      className=" flex-row justify-between px-5 bg-indigo-400 pb-5 rounded-b-3xl shadow"
    >
      <View>
        <Text style={{ fontSize: hp(3) }} className="font-medium text-white">
          Chats
        </Text>
      </View>
      <View>
        <Menu>
          <MenuTrigger
          // customStyles={{
          //   triggerWrapper: {
          //     backgroundColor: "red",
          //   },
          // }}
          >
            <Image
              style={{
                height: hp(4.3),
                aspectRatio: 1,
                borderRadius: 100,
              }}
              source={user?.profileUrl}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={500}
            />
          </MenuTrigger>
          <MenuOptions
            optionsContainerStyle={{
              shadowColor: "black",
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: 5,
              borderWidth: 0.1,
              borderRadius: 10,
              width: 160,
              marginTop: 35,
              marginLeft: -20,
            }}
          >
            <CustomMenuItems
              text="Profile"
              action={handleProfile}
              value={null}
              icon={<Feather name="user" size={hp(2.5)} color="#737373" />}
            />
            <Divider />
            <CustomMenuItems
              text="Sign Out"
              action={handleLogOut}
              value={null}
              icon={<AntDesign name="logout" size={hp(2.5)} color="#737373" />}
            />
          </MenuOptions>
        </Menu>
      </View>
    </View>
  );
}

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
