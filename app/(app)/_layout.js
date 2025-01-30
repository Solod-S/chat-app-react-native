import { Tabs, useSegments } from "expo-router";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
} from "@expo/vector-icons";

import { HomeHeader } from "@/components";

export default function Layout() {
  const segments = useSegments();

  // if screen is in the home or live stack, hide the tab bar
  const hide = !(
    segments.includes("home") ||
    segments.includes("profilePage") ||
    segments.includes("userSearch")
  );

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          display: hide ? "none" : "flex",
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
          header: () => <HomeHeader />,
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
