import { db } from "@/firebaseConfig";
import { doc, collection, getDocs, deleteDoc } from "firebase/firestore";

export const deleteRoomMessages = async roomId => {
  try {
    // Ссылка на подколлекцию messages
    const messagesRef = collection(db, "rooms", roomId, "messages");

    // Получаем все документы в подколлекции
    const messagesSnapshot = await getDocs(messagesRef);

    // Удаляем все сообщения в подколлекции
    messagesSnapshot.forEach(async messageDoc => {
      try {
        await deleteDoc(messageDoc.ref);
        console.log(`Message ${messageDoc.id} deleted successfully`);
      } catch (error) {
        console.log(`Error deleting message ${messageDoc.id}:`, error);
      }
    });

    console.log(`All messages in room ${roomId} deleted successfully`);
  } catch (error) {
    console.log(`Error in deleteRoomMessages:`, error);
  }
};
