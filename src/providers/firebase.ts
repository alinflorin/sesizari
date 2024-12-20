import {initializeApp} from "@firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyA5pggImFMiZ6YeWOxAfpz0R9gmkTwsfRg",
  authDomain: "sesizari-2024.firebaseapp.com",
  projectId: "sesizari-2024",
  storageBucket: "sesizari-2024.firebasestorage.app",
  messagingSenderId: "877120599778",
  appId: "1:877120599778:web:9249ffde20bef4f72090bb",
  measurementId: "G-XVF3ED70LT",
});
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseFirestore = getFirestore(firebaseApp);

export default firebaseApp;