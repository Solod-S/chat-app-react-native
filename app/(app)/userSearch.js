import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { query, where, getDocs } from "firebase/firestore"; // Убираем limit и startAfter
import { usersRef } from "../../firebaseConfig";
import { useAuth } from "../../context/authContext";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

const ios = Platform.OS == "ios";

export default function UserSearch() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const openChat = item => {
    router.push({
      pathname: "/screens/chatRoom",
      params: item,
    });
  };

  // const getUsers = async () => {
  //   try {
  //     setLoading(true);

  //     let q = query(usersRef, where("userId", "!=", user?.uid));

  //     const querySnapshot = await getDocs(q);
  //     const data = [];

  //     querySnapshot.forEach(doc => {
  //       const user = doc.data();

  //       if (
  //         searchQuery.trim() === "" ||
  //         user.username.toLowerCase().includes(searchQuery.toLowerCase())
  //       ) {
  //         data.push(user);
  //       }
  //     });

  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error fetching users: ", error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getUsers = async () => {
    try {
      setLoading(true);

      const normalizedSearch = searchQuery.trim().toLowerCase();
      console.log(`normalizedSearch`, normalizedSearch);
      let q = query(
        usersRef,
        where("userId", "!=", user?.uid),
        where("usernameLower", ">=", normalizedSearch)
        // where("usernameLower", "<=", normalizedSearch + "\uf8ff") // Firestore range query
      );

      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setUsers(data);
    } catch (error) {
      console.error("Error getting users: ", error.message);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Oops! Something went wrong. ",
        text2: "Please try again later..",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim().length <= 2) {
      Toast.show({
        type: "info",
        position: "top",
        text1: "Search query to short",
        // text2: "You have successfully added this user to your friends.",
        visibilityTime: 1000,
        autoHide: true,
        bottomOffset: 50,
      });

      return setUsers([]);
    }

    getUsers();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1">
      <View
        className="flex-1 "
        style={{ paddingTop: hp(ios ? 1 : 5), paddingHorizontal: wp(5) }}
      >
        <StatusBar style="dark" />

        <View className="flex-1 ">
          {/* Search Input */}
          <View className="flex-row items-center space-x-2 ">
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity
              className="bg-indigo-500 p-3 rounded-lg"
              onPress={handleSearch}
            >
              <Ionicons name="search" size={18} color="white" />
            </TouchableOpacity>
          </View>

          {/* Results List */}
          {loading ? (
            <ActivityIndicator size="large" color="#4F46E5" className="mt-4" />
          ) : (
            <FlatList
              data={users}
              keyExtractor={item => item.userId}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openChat(item)}>
                  <View
                    key={item.userId}
                    className="flex-row items-center p-4 border-b border-gray-200"
                  >
                    <Image
                      // source={{
                      //   uri: item.profileUrl,
                      // }}
                      source={
                        item?.profileUrl
                          ? { uri: item?.profileUrl }
                          : require("../../assets/images/avatar_profile.png")
                      }
                      className="w-12 h-12 rounded-full mr-4 border border-indigo-100"
                    />
                    <Text className="text-lg font-medium">{item.username}</Text>
                  </View>
                </TouchableOpacity>
              )}
              className="mt-4 flex-1"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
