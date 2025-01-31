import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const getExpoPushNotificationToken = async () => {
  try {
    if (!Device.isDevice) {
      console.log("Push-уведомления работают только на физических устройствах");
      return null;
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Разрешение на уведомления не получено!");
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync(
        "b79d6b93-09be-46a5-95c5-64d85bed66f8"
      )
    ).data;
    // console.log("Разрешение получено", token);
    return token;
  } catch (error) {
    console.log(`error in register for push notifications async`, error);
    return null;
  }
};

export const sendPushNotification = async (tokens, message) => {
  try {
    const currentToken = await getExpoPushNotificationToken();
    if (currentToken) tokens = tokens.filter(token => token !== currentToken);
    const expoPushUrl = "https://exp.host/--/api/v2/push/send";
    const notifications = tokens.map(token => ({
      to: token,
      sound: "default",
      title: message.title || "Notification",
      body: message.body || "",
      data: {
        screen: "chatRoom",
        item: message.item,
      },
    }));
    await axios.post(expoPushUrl, notifications, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка отправки уведомления:", error);
  }
};

// Пример вызова функции
// const tokens = [
//   "ExponentPushToken[8FRx76FptLVWWSCDW_rLqX]", // Добавьте больше токенов
//   `ExponentPushToken[aWhdZqE-HdNZe9E1yjEbQ8]`,
// ];

// const message = {
//   title: "Привет!",
//   body: "Это уведомление, отправленное из React Native 🚀",
//   data: { someData: "your data here" },
// };

// sendPushNotification(tokens, message);
