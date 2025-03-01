import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "expo-router";
import { db } from "../../firebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { CustomKeyboardView, Loading } from "../../components";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/authContext";
import Toast from "react-native-toast-message";

export default function ProfilePage() {
  const { saveProfileSettings, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // get user data
  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        if (!user?.uid) return;

        try {
          const userDocRef = doc(db, "users", user?.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const { profileUrl, username, notification } = userDoc.data();
            setProfileUrl(profileUrl);
            setUsername(username);
            setNotificationsEnabled(notification ?? false);
          } else {
            console.log("No such user document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        }
      };

      getUser();
    }, [user?.uid])
  );

  const handleSave = async () => {
    if (!username) {
      Alert.alert("Profile", "Please fill name field");
      return;
    }

    setLoading(true);
    const response = await saveProfileSettings(
      username,
      profileUrl,
      notificationsEnabled
    );
    setLoading(false);

    if (!response.success) {
      Alert.alert("Profile Page", response.message);
    } else {
      Toast.show({
        type: "success",
        position: "top",
        text1: "Your profile has been updated successfully!",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View
        style={{ paddingTop: hp(8), paddingHorizontal: wp(5) }}
        className="flex-1 gap-8"
      >
        <View className="flex-1 justify-center items-center">
          <View
            style={{
              width: wp(40),
              height: wp(40),
              borderRadius: 100,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
              source={
                profileUrl
                  ? { uri: profileUrl }
                  : require("../../assets/images/avatar_profile.png")
              }
            />
          </View>
        </View>

        <View className="gap-10">
          {/* Inputs */}
          <View className="gap-4">
            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="user" size={hp(2.7)} color="gray" />
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={{ fontSize: hp(2) }}
                placeholder="Username"
                placeholderTextColor="gray"
                className="flex-1 font-semibold text-neutral-700"
              />
            </View>

            <View
              style={{ height: hp(7) }}
              className="flex-row gap-4 px-4 bg-neutral-100 items-center rounded-xl"
            >
              <Feather name="image" size={hp(2.7)} color="gray" />
              <TextInput
                value={profileUrl}
                onChangeText={setProfileUrl}
                style={{ fontSize: hp(2) }}
                placeholder="Avatar Url"
                placeholderTextColor="gray"
                className="flex-1 font-semibold text-neutral-700"
              />
              {profileUrl ? (
                <TouchableOpacity onPress={() => setProfileUrl("")}>
                  <Feather name="x-circle" size={hp(2.7)} color="gray" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Notification Toggle */}
          <View className="flex-row justify-between items-center px-4 bg-neutral-100 rounded-xl py-2">
            <Text
              style={{ fontSize: hp(2) }}
              className="font-semibold text-neutral-700"
            >
              Enable Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>

          {/* Submit Button */}
          <View>
            {loading ? (
              <View className="flex-row justify-center">
                <Loading size={hp(6.5)} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleSave}
                style={{ height: hp(6.5) }}
                className="bg-indigo-500 rounded-xl justify-center items-center"
              >
                <Text
                  style={{ fontSize: hp(2.7) }}
                  className="text-white font-bold tracking-wider"
                >
                  Save
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
