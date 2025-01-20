import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useAuth } from "../../context/authContext";

export default function Home() {
  const { logout, user } = useAuth();

  console.log(`user data: `, user);
  const handleLogOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("error in logout:", error.message);
    }
  };

  return (
    <View className="bg-slate-50 flex-1 gap-12 items-center py-4">
      <Text>home</Text>
      <TouchableOpacity onPress={handleLogOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
