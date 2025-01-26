import "../global.css";
import { View, Text } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
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
            pathname: "/chatRoom",
            params: data.item, // Передача параметров в роутер
          });
        }
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <Slot />
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
