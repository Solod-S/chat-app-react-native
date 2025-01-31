import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { Image } from "expo-image";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Loading } from "./loading";
import Toast from "react-native-toast-message";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { CustomMenuItems } from "./customMenuItems";
import { Foundation } from "@expo/vector-icons";
import {
  addToFriendsList,
  deleteRoomMessages,
  removeFromFriendsList,
} from "@/utils";
import { useAuth } from "@/context/authContext";

export function ChatRoomHeader({ user, router, myProfile, roomId }) {
  const { refresh } = useAuth();
  const [loading, setLoading] = useState(false);

  const addToFriends = async () => {
    try {
      setLoading(true);
      const data = await addToFriendsList(myProfile.uid, user.userId);
      refresh({ friends: data.friends });
      Toast.show({
        type: "success",
        position: "top",
        text1: "Friend added successfully",
        // text2: "You have successfully added this user to your friends.",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    } catch (error) {
      console.log(`Error in addToFriends :`, error);
      Alert.alert("Add to friends", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromFriends = async () => {
    try {
      setLoading(true);
      const data = await removeFromFriendsList(myProfile.uid, user.userId);
      refresh({ friends: data.friends });
      Toast.show({
        type: "success",
        position: "top",
        text1: "Friend removed successfully",
        // text2: "You have successfully removed this user from your friends.",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    } catch (error) {
      console.log(`Error in addToFriends :`, error);
      Alert.alert(
        "Remove from friends",
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteChat = async () => {
    try {
      setLoading(true);
      // router.replace("home");
      await deleteRoomMessages(roomId);
      Toast.show({
        type: "success",
        position: "top",
        text1: "Chat removed successfully",
        // text2: "You have successfully removed this user from your friends.",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    } catch (error) {
      console.log(`Error in deleteChat :`, error);
      Alert.alert("Chat delete", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack.Screen
      options={{
        title: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()}>
              <Entypo name="chevron-left" size={hp(4)} color="#737373" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <Image
                source={
                  user?.profileUrl
                    ? { uri: user?.profileUrl }
                    : require("../assets/images/avatar_profile.png")
                }
                style={{ height: hp(4.5), aspectRatio: 1, borderRadius: 100 }}
              />
              <Text
                style={{ fontSize: hp(2.5) }}
                className="text-neutral-700 font-medium"
              >
                {user?.username}
              </Text>
            </View>
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center gap-8">
            <Menu>
              <MenuTrigger>
                <Foundation name="indent-more" size={24} color="black" />
              </MenuTrigger>
              <MenuOptions
                optionsContainerStyle={{
                  shadowColor: "black",
                  shadowOpacity: 0.3,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 5,
                  borderWidth: 0.1,
                  borderRadius: 10,
                  width: 180,
                  marginTop: 35,
                  marginLeft: -20,
                }}
              >
                {loading ? (
                  <Loading size={hp(2.8)} />
                ) : myProfile?.friends?.includes(user.userId) ? (
                  <CustomMenuItems
                    text="Remove"
                    action={removeFromFriends}
                    value={null}
                    icon={
                      <AntDesign
                        name="minuscircleo"
                        size={hp(2.5)}
                        color="#737373"
                      />
                    }
                  />
                ) : (
                  <CustomMenuItems
                    text="Add"
                    action={addToFriends}
                    value={null}
                    icon={
                      <AntDesign
                        name="pluscircleo"
                        size={hp(2.5)}
                        color="#737373"
                      />
                    }
                  />
                )}
                <Divider />
                <CustomMenuItems
                  text="Clear history"
                  action={() =>
                    Alert.alert(
                      "Confirm Deletion",
                      "Are you sure you want to delete this chat? Data recovery will not be possible.",
                      [
                        { text: "No", style: "cancel" },
                        { text: "Yes", onPress: () => deleteChat() },
                      ]
                    )
                  }
                  value={null}
                  icon={
                    <AntDesign name="delete" size={hp(2.5)} color="#737373" />
                  }
                />
              </MenuOptions>
            </Menu>
          </View>
        ),
      }}
    ></Stack.Screen>
  );
}

const Divider = () => {
  return <View className="p-[1px] w-full bg-neutral-200"></View>;
};
