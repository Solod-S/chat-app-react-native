import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

import { useAuth } from "../../context/authContext";
import { ChatList, Loading } from "../../components";
import { getDoc, getDocs, query, where } from "firebase/firestore";
import { usersRef } from "../../firebaseConfig";

export default function Home() {
  const { user } = useAuth();

  const [users, setUsers] = useState([1, 2, 3]);

  useEffect(() => {
    console.log(`current userId: `, user?.userId);
    if (user?.userId) getUser();
  }, [user]);

  const getUser = async () => {
    try {
      const q = query(usersRef, where("userId", "!=", user?.userId));
      const querySnapshot = await getDocs(q);
      // console.log(`querySnapshot`, querySnapshot);
      let data = [];
      querySnapshot.forEach(doc => {
        data.push(doc.data());
      });

      setUsers(data);
    } catch (error) {
      console.log(`Error in getUser: `, error.message);
    }
  };

  return (
    <View className="bg-white flex-1 ">
      <StatusBar style="light" />
      {users?.length > 0 ? (
        <ChatList users={users} />
      ) : (
        <View className="flex items-center" style={{ top: hp(30) }}>
          <Loading size={hp(6.5)} />
        </View>
      )}
    </View>
  );
}
