import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useAuth } from "../../context/authContext";
import { ChatList, Loading } from "../../components";
import { getDocs, query, where, limit, startAfter } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastVisible, setLastVisible] = useState(null);

  // Первичная загрузка пользователей
  useEffect(() => {
    if (user?.userId) {
      getUsers();
    }
  }, [user]);

  // Получение пользователей (с учетом пагинации)
  const getUsers = async (isLoadMore = false) => {
    try {
      let q;
      if (isLoadMore && lastVisible) {
        q = query(
          usersRef,
          where("userId", "!=", user?.userId),
          startAfter(lastVisible),
          limit(10)
        );
      } else {
        q = query(usersRef, where("userId", "!=", user?.userId), limit(10));
      }

      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });

      if (isLoadMore) {
        setUsers(prevUsers => [...prevUsers, ...data]);
      } else {
        setUsers(data);
      }

      // Обновляем lastVisible только если есть документы
      if (!querySnapshot.empty) {
        setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
      }
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

  // Загрузка дополнительных данных (бесконечная прокрутка)
  const loadMoreUsers = async () => {
    if (loadingMore || !lastVisible) return;
    setLoadingMore(true);
    await getUsers(true);
    setLoadingMore(false);
  };

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
        onEndReached={loadMoreUsers}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => (
          <View className="flex items-center" style={{ top: hp(30) }}>
            <Text>No users</Text>
          </View>
        )}
      />
    </View>
  );
}
