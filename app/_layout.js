import "../global.css";
import Toast from "react-native-toast-message";
import { View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "@/context/authContext";
import { useEffect } from "react";
import { MenuProvider } from "react-native-popup-menu";
import * as Notifications from "expo-notifications";

const MainLayout = () => {
  const { isAuthenticated, refresh, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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

  useEffect(() => {
    // Переменные для хранения подписок на уведомления
    let subscription;
    let receivedSubscription;

    // Если пользователь авторизован, включаем уведомления
    if (isAuthenticated) {
      subscription = Notifications.addNotificationResponseReceivedListener(
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

      receivedSubscription = Notifications.addNotificationReceivedListener(
        notification => {
          const { data } = notification.request.content;

          if (data?.screen === "chatRoom" && data?.item?.userId) {
            refresh(); // Делаем рефреш и oбновляем список пользователей
          }
        }
      );
    }

    // Если пользователь не авторизован, удаляем подписки
    return () => {
      if (subscription) subscription.remove();
      if (receivedSubscription) receivedSubscription.remove();
    };
  }, [isAuthenticated]);

  // Installing a Notification Handler
  useEffect(() => {
    console.log("User is authorized, show notification", user?.notification);

    Notifications.setNotificationHandler({
      handleNotification: async () => {
        if (!isAuthenticated) {
          console.log("User is not authorized, do not show notification");
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          };
        }

        return {
          shouldShowAlert: user?.notification ?? false,
          shouldPlaySound: user?.notification ?? false,
          shouldSetBadge: user?.notification ?? false,
        };
      },
    });
  }, [isAuthenticated, user]);

  return (
    <View className="flex-1 bg-white">
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="screens/chatRoom" />
        <Stack.Screen name="index" options={{ headerShown: false }} />
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
