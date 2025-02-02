import "../global.css";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import { useNotifications } from "@/hooks/useNotifications";
import * as Notifications from "expo-notifications";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useNotifications();

  useEffect(() => {
    // Проверяем авторизацию и перенаправляем пользователя
    if (typeof isAuthenticated === "undefined") return;
    const inApp = segments[0] === "(app)";
    if (isAuthenticated && !inApp) {
      router.replace("home");
    } else if (!isAuthenticated) {
      router.replace("signIn");
    }
  }, [isAuthenticated]);

  return (
    <View className="flex-1 bg-white">
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/chatRoom" />
        <Stack.Screen name="index" />
        <Stack.Screen name="signIn" options={{ headerShown: false }} />
        <Stack.Screen name="signUp" options={{ headerShown: false }} />
      </Stack>
      <Toast />
    </View>
  );
};

export default function RootLayout() {
  return (
    <MenuProvider>
      <AuthContextProvider>
        <MainLayout />
      </AuthContextProvider>
    </MenuProvider>
  );
}
