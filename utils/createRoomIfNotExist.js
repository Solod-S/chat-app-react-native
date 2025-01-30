import { db } from "@/firebaseConfig";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const createRoomIfNotExist = async roomId => {
  try {
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      participants: roomId.split("-"),
      createdAt: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.log(`Error in createRoomIfNotExist: `, error);
  }
};
