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
import { useAuth } from "@/context/authContext";
import { Loading } from "./loading";
import Toast from "react-native-toast-message";

export function ChatRoomHeader({ user, router, myProfile }) {
  const [loading, setLoading] = useState(false);
  const { addToFriendsList, removeFromFriendsList } = useAuth();

  const addToFriends = async () => {
    try {
      setLoading(true);
      await addToFriendsList(myProfile.userId, user.uid);
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
      await removeFromFriendsList(myProfile.userId, user.uid);
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
                source={user?.profileUrl}
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
            {loading ? (
              <Loading size={hp(2.8)} />
            ) : myProfile?.friends?.includes(user.uid) ? (
              <AntDesign
                name="minuscircleo"
                size={hp(2.8)}
                color="#737373"
                onPress={() => removeFromFriends()}
              />
            ) : (
              <AntDesign
                name="pluscircleo"
                size={hp(2.8)}
                color="#737373"
                onPress={() => addToFriends()}
              />
            )}
          </View>
        ),
      }}
    ></Stack.Screen>
  );
}
