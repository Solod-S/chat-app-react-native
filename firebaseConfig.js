// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_gfM-IkO9yoBM1G1k4f8X2vpVtCfFTYE",
  authDomain: "fir-chat-9a54e.firebaseapp.com",
  projectId: "fir-chat-9a54e",
  storageBucket: "fir-chat-9a54e.firebasestorage.app",
  messagingSenderId: "45690446527",
  appId: "1:45690446527:web:9b767df1b8249778fddc0a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const usersRef = collection(db, "users");
export const roomsRef = collection(db, "rooms");
