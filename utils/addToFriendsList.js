import { db } from "../firebaseConfig";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";

export const addToFriendsList = async (userId, friendId) => {
  try {
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, {
      friends: arrayUnion(friendId),
    });

    const newData = await getDoc(docRef);

    if (newData.exists()) {
      let data = newData.data();

      return data;
    }
  } catch (error) {
    console.log(`Error in addToFriendsList :`, error);
  }
};
