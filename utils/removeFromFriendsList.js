import { db } from "../firebaseConfig";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";

export const removeFromFriendsList = async (userId, friendId) => {
  try {
    const docRef = doc(db, "users", userId);

    await updateDoc(docRef, {
      friends: arrayRemove(friendId),
    });

    const newData = await getDoc(docRef);

    if (newData.exists()) {
      let data = newData.data();

      return data;
    }
  } catch (error) {
    console.log(`Error in removeFromFriendsList:`, error);
  }
};
