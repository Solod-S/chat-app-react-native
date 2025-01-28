import "../global.css";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Slot, Stack, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import * as Notifications from "expo-notifications";

const MainLayout = () => {
  const { isAuthenticated, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    //  check if the user is authenticated or not
    if (typeof isAuthenticated == "undefined") return;
    // user in app group
    const inApp = segments[0] == "(app)";
    if (isAuthenticated && !inApp) {
      // if user authenticated
      // and not in (app) => redirect home
      router.replace("home");
    } else if (isAuthenticated == false) {
      // if user is not authenticated
      //  redirect to signIn
      router.replace("signIn");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Обработчик взаимодействия с уведомлением
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const { data } = response.notification.request.content;

        if (data?.screen === "chatRoom" && data?.item) {
          router.push({
            pathname: "/screens/chatRoom",
            params: data.item, // Передача параметров в роутер
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* <Slot />
       */}
      <Stack
      // screenOptions={{
      //   headerShown: false,
      // }}
      >
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/chatRoom" />
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
