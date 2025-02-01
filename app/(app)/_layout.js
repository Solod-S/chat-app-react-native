import { Tabs, useSegments } from "expo-router";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";
import { HomeHeader } from "@/components";

export default function Layout() {
  const segments = useSegments();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Hide the tab bar only on Android when the keyboard is open
  // Hide the tab bar on unnecessary tabs
  const hideTabs =
    (Platform.OS === "android" && isKeyboardVisible) ||
    !(
      segments.includes("home") ||
      segments.includes("profilePage") ||
      segments.includes("userSearch")
    );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: hideTabs ? "none" : "flex",
        },
        tabBarActiveTintColor: "#6366f1",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          header: () => <HomeHeader />,
          tabBarLabel: "Chats",
          tabBarIcon: ({ color }) => (
            <Entypo name="chat" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="userSearch"
        options={{
          headerShown: false,
          tabBarLabel: "Search",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="search" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profilePage"
        options={{
          headerShown: false,
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="account-circle"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
