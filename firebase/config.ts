import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  
};

let app: FirebaseApp;
let auth;

// ✅ Ensure app initializes only once
if (!getApps().length) {
  app = initializeApp(firebaseConfig);

  // ✅ Initialize Auth with persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} else {
  app = getApp();
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
}

// ✅ Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };