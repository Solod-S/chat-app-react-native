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

  try {
    await axios.post(expoPushUrl, notifications, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка отправки уведомления:", error);
  }
};

// export const sendPushNotification = async (tokens, message) => {
//   const currentToken = await getExpoPushNotificationToken();

//   if (currentToken) tokens = tokens.filter(token => token !== currentToken);

//   const expoPushUrl = "https://exp.host/--/api/v2/push/send";
//   console.log(`tokens!`, tokens);
//   // Создаем массив сообщений для каждого токена
//   const notifications = tokens.map(token => ({
//     to: token,
//     sound: "default",
//     title: message.title || "Уведомление",
//     body: message.body || "Это ваше сообщение",
//     data: message.data || {},
//   }));

//   try {
//     const response = await axios.post(expoPushUrl, notifications, {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     // console.log("Ответ сервиса Expo:", response.data);
//   } catch (error) {
//     console.error("Ошибка отправки уведомления:", error);
//   }
// };

// Пример вызова функции
// const tokens = [
//   "ExponentPushToken[aWhdZqE-HdNZe9E1yjEbQ8]", // Добавьте больше токенов
//   `ExponentPushToken[8FRx76FptLVWWSCDW_rLqX]`,
// ];

// const message = {
//   title: "Привет!",
//   body: "Это уведомление, отправленное из React Native 🚀",
//   data: { someData: "your data here" },
// };

// sendPushNotification(tokens, message);
