import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getExpoPushNotificationToken } from "../utils";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, seIsAuthenticated] = useState(undefined);

  // responsible for tracking changes in the user's authorization state
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, user => {
      try {
        if (user) {
          console.log(`!!user`, user);
          seIsAuthenticated(true);
          setUser(user);
          updateUserData(user.uid);
        } else {
          seIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.log(`error in unSub`, error);
        seIsAuthenticated(false);
        setUser(null);
      }
    });

    return unSub;
  }, []);

  const updateTokenData = async id => {
    try {
      const token = await getExpoPushNotificationToken();
      if (!token) return;

      const docRef = doc(db, "users", id);
      await updateDoc(docRef, {
        tokens: arrayUnion(token),
      });

      await getDoc(docRef);
    } catch (error) {
      console.log(`Error in updateTokenData :`, error);
    }
  };

  const updateUserData = async id => {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let data = docSnap.data();
      setUser({
        ...user,
        username: data.username,
        profileUrl: data.profileUrl,
        userId: data.userId,
        tokens: data.tokens || [],
        friends: data.friends || [],
      });
    }
  };

  const addToFriendsList = async (userId, friendId) => {
    try {
      const docRef = doc(db, "users", userId);
      await updateDoc(docRef, {
        friends: arrayUnion(friendId),
      });

      const newData = await getDoc(docRef);

      if (newData.exists()) {
        let data = newData.data();

        setUser(prevUser => ({
          ...prevUser,
          friends: data.friends,
        }));
      }
    } catch (error) {
      console.log(`Error in addToFriendsList :`, error);
    }
  };

  const removeFromFriendsList = async (userId, friendId) => {
    try {
      const docRef = doc(db, "users", userId);

      await updateDoc(docRef, {
        friends: arrayRemove(friendId),
      });

      const newData = await getDoc(docRef);

      if (newData.exists()) {
        let data = newData.data();

        setUser(prevUser => ({
          ...prevUser,
          friends: data.friends,
        }));
      }
    } catch (error) {
      console.log(`Error in removeFromFriendsList:`, error);
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateTokenData(userCredential.user.uid);
      return { success: true };
    } catch (error) {
      console.log(`Error login`, error);
      let msg = error.message || "An error occurred";
      if (msg.includes("invalid-email")) msg = "Invalid email";
      if (msg.includes("auth/invalid-credential"))
        msg = "Invalid email or password";
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      console.log(`Error logout`, error);
      return { success: false, message: msg };
    }
  };

  const register = async (email, password, username, profileUrl) => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // No need to do this because we use unSub in useEffect.
      // seIsAuthenticated(response?.user);
      // setUser(user);

      await setDoc(doc(db, "users", response?.user?.uid), {
        username,
        usernameLower: username.toLowerCase(),
        profileUrl,
        userId: response?.user?.uid,
        tokens: [],
        friends: [],
      });
      await updateTokenData(response.user.uid);
      return { success: true, data: response?.user };
    } catch (error) {
      console.log(`Error register`, error);
      let msg = error.message;
      if (msg.includes("invalid-emai")) msg = "Invalid email";
      if (msg.includes("email-already-in-use")) msg = "Email already in use";

      return { success: false, message: msg };
    }
  };

  const updateUserInfo = async (username, profileUrl) => {
    try {
      const userDocRef = doc(db, "users", user?.userId);

      await updateDoc(userDocRef, {
        username: username,
        profileUrl: profileUrl,
        usernameLower: username.toLowerCase(),
      });

      setUser(prevUser => ({
        ...prevUser,
        username: username || prevUser.username,
        profileUrl: profileUrl || prevUser.profileUrl,
        usernameLower:
          username.toLowerCase() || prevUser.username.toLowerCase(),
      }));

      return { success: true };
    } catch (error) {
      console.log("Error updating user info:", error);
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateUserInfo,
        addToFriendsList,
        removeFromFriendsList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContextProvider");
  }
  return value;
};
