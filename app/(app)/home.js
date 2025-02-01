import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import uniqBy from "lodash.uniqby";
import { useAuth } from "../../context/authContext";
import { ChatList } from "../../components";
import { getDocs, query, where, collection } from "firebase/firestore";
import { usersRef, roomsRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // follow the updates of friends and chats
  useEffect(() => {
    let interval;

    if (user?.uid) {
      getUsers();
      interval = setInterval(() => {
        getUsers();
      }, 15000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  const getUsers = async () => {
    try {
      if (!user?.uid) return;

      const friendUsers = [];
      const chatUsers = [];

      if (user.friends && user.friends.length > 0) {
        const friendsQuery = query(
          usersRef,
          where("userId", "!=", user.uid),
          where("userId", "in", user.friends)
        );

        const friendsSnapshot = await getDocs(friendsQuery);
        friendUsers.push(
          ...friendsSnapshot.docs.map(doc => ({
            ...doc.data(),
            type: "friend",
          }))
        );
      }

      const roomsQuery = query(
        roomsRef,
        where("participants", "array-contains", user.uid)
      );

      const roomsSnapshot = await getDocs(roomsQuery);
      const roomUsersIds = new Set();

      const checkMessagesInRoom = async roomRef => {
        const messagesCollectionRef = collection(roomRef, "messages");
        const messagesSnapshot = await getDocs(messagesCollectionRef);
        return !messagesSnapshot.empty;
      };

      const processRoom = async doc => {
        const roomName = doc.data().roomId;
        const userIds = roomName.split("-");

        let otherUserId = userIds[0] === user.uid ? userIds[1] : userIds[0];

        if (otherUserId) {
          const hasMessages = await checkMessagesInRoom(doc.ref);
          if (hasMessages) {
            roomUsersIds.add(otherUserId);
          }
        }
      };

      await Promise.all(roomsSnapshot.docs.map(processRoom));

      if (roomUsersIds.size > 0) {
        const chatUsersQuery = query(
          usersRef,
          where("userId", "in", Array.from(roomUsersIds))
        );

        const chatUsersSnapshot = await getDocs(chatUsersQuery);
        chatUsers.push(
          ...chatUsersSnapshot.docs.map(doc => ({
            ...doc.data(),
            type: "chat",
          }))
        );
      }

      const allUsers = uniqBy([...friendUsers, ...chatUsers], "userId");

      // Сортировка: сначала "friend", потом "chat"
      allUsers.sort((a, b) => (a.type === "friend" ? -1 : 1));

      setUsers(allUsers);
    } catch (error) {
      console.error("Error fetching users: ", error.message);
    }
  };

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
        renderItem={({ item, index }) => (
          <View>
            {(index === 0 || users[index - 1]?.type !== item.type) && (
              <Text className="text-lg font-bold color-indigo-100 text-center py-2">
                {item.type === "friend"
                  ? "──────── Friends ────────"
                  : "──────── Other ────────"}
              </Text>
            )}
            <ChatList currentUser={user} users={[item]} />
          </View>
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
