import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/authContext";

export const useNotifications = () => {
  const { isAuthenticated, refresh, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let subscription;
    let receivedSubscription;

    if (isAuthenticated) {
      subscription = Notifications.addNotificationResponseReceivedListener(
        response => {
          const { data } = response.notification.request.content;
          if (data?.screen === "chatRoom" && data?.item) {
            router.push({
              pathname: "/screens/chatRoom",
              params: data.item,
            });
          }
        }
      );

      receivedSubscription = Notifications.addNotificationReceivedListener(
        notification => {
          const { data } = notification.request.content;

          if (data?.screen === "chatRoom" && data?.item?.userId) {
            refresh();
          }
        }
      );
    }

    return () => {
      if (subscription) subscription.remove();
      if (receivedSubscription) receivedSubscription.remove();
    };
  }, [isAuthenticated]);

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
};
