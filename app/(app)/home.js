import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import uniqBy from "lodash.uniqby";
import { useAuth } from "../../context/authContext";
import { ChatList } from "../../components";
import { getDocs, query, where, limit, collection } from "firebase/firestore";
import { usersRef, roomsRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Первичная загрузка пользователей
  useEffect(() => {
    if (user?.userId) {
      getUsers();
    }
  }, [user]);

  // Получение пользователей
  // const getUsers = async () => {
  //   try {
  //     console.log("user.friends:", user.userId);

  //     // Проверяем, есть ли список друзей
  //     if (!user.friends || user.friends.length === 0) {
  //       setUsers([]);
  //       return;
  //     }

  //     const q = query(
  //       usersRef,
  //       where("userId", "!=", user?.userId),
  //       where("userId", "in", user.friends), // Фильтруем только друзей
  //       limit(10)
  //     );

  //     const querySnapshot = await getDocs(q);
  //     const data = querySnapshot.docs.map(doc => doc.data());

  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error fetching users: ", error.message);
  //   }
  // };

  const getUsers = async () => {
    try {
      console.log("user.friends:", user.friends);

      if (!user?.userId) return;

      const friendUsers = []; // Пользователи из списка друзей
      const chatUsers = []; // Пользователи из чатов

      // Шаг 1: Получаем пользователей из списка друзей
      if (user.friends && user.friends.length > 0) {
        const friendsQuery = query(
          usersRef,
          where("userId", "!=", user.userId),
          where("userId", "in", user.friends)
        );

        const friendsSnapshot = await getDocs(friendsQuery);
        friendUsers.push(...friendsSnapshot.docs.map(doc => doc.data()));
      }

      // Шаг 2: Получаем пользователей из чатов
      const roomsQuery = query(
        roomsRef,
        where("roomId", ">=", `${user.userId}-`),
        where("roomId", "<=", `${user.userId}-\uf8ff`) // Проверяем, если ID идет первым
      );

      const reverseRoomsQuery = query(
        roomsRef,
        where("roomId", ">=", `-${user.userId}`),
        where("roomId", "<=", `-${user.userId}\uf8ff`) // Проверяем, если ID идет вторым
      );

      // Выполняем оба запроса параллельно
      const [roomsSnapshot, reverseRoomsSnapshot] = await Promise.all([
        getDocs(roomsQuery),
        getDocs(reverseRoomsQuery),
      ]);

      const roomUsersIds = new Set();

      // Функция для проверки наличия сообщений в комнате
      const checkMessagesInRoom = async roomRef => {
        const messagesCollectionRef = collection(roomRef, "messages");
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        return !messagesSnapshot.empty; // Возвращает true, если есть хотя бы одно сообщение
      };

      // Обработчик для каждой комнаты
      const processRoom = async doc => {
        const roomName = doc.data().roomId;
        const userIds = roomName.split("-");

        console.log("Checking room:", roomName); // Логируем roomId

        // Проверяем, если current user в roomId, либо как первый, либо как второй
        let otherUserId = null;
        if (userIds[0] === user.userId) {
          otherUserId = userIds[1]; // второй пользователь
        } else if (userIds[1] === user.userId) {
          otherUserId = userIds[0]; // первый пользователь
        }

        console.log("otherUserId found:", otherUserId); // Логируем найденного пользователя

        if (otherUserId) {
          const hasMessages = await checkMessagesInRoom(doc.ref);
          console.log(`Room ${roomName} has messages:`, hasMessages); // Логируем результат проверки сообщений
          if (hasMessages) {
            roomUsersIds.add(otherUserId);
          }
        }
      };

      // Обрабатываем обе коллекции комнат
      await Promise.all([
        ...roomsSnapshot.docs.map(processRoom),
        ...reverseRoomsSnapshot.docs.map(processRoom),
      ]);

      // После того как мы собрали все valid chat users, запрашиваем информацию о пользователях
      if (roomUsersIds.size > 0) {
        const chatUsersQuery = query(
          usersRef,
          where("userId", "in", Array.from(roomUsersIds))
        );

        const chatUsersSnapshot = await getDocs(chatUsersQuery);
        chatUsers.push(...chatUsersSnapshot.docs.map(doc => doc.data()));
      }

      // Шаг 3: Создаем уникальный массив пользователей
      const allUsers = uniqBy([...friendUsers, ...chatUsers], "userId");
      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users: ", error.message);
    }
  };

  // Обновление списка (pull-to-refresh)
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await getUsers();
    setRefreshing(false);
  }, [user]);

  return (
    <View className="bg-white flex-1 pt-4">
      <StatusBar style="light" />
      <FlatList
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ChatList currentUser={user} users={[item]} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="flex items-center" style={{ top: hp(30) }}>
            <Text>No users</Text>
          </View>
        )}
      />
    </View>
  );
}
