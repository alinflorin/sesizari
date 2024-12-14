// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyA5pggImFMiZ6YeWOxAfpz0R9gmkTwsfRg",
  authDomain: "sesizari-2024.firebaseapp.com",
  projectId: "sesizari-2024",
  storageBucket: "sesizari-2024.firebasestorage.app",
  messagingSenderId: "877120599778",
  appId: "1:877120599778:web:9249ffde20bef4f72090bb",
  measurementId: "G-XVF3ED70LT",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
