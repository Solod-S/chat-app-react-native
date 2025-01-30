import { View, ActivityIndicator, Platform } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";

export default function StartPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // для нормальной работы пуша и перехода на андроиде
    if (isAuthenticated && router.canGoBack() && Platform.OS === "android") {
      router.dismiss();
    }
  }, [isAuthenticated, router]);

  return (
    <View className="flex-1 justify-center">
      <ActivityIndicator size="large" color="gray" />
    </View>
  );
}
