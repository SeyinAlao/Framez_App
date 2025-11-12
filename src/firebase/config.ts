import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // optional for storing user data

const firebaseConfig = {
  apiKey: "AIzaSyCcrwtRqmm8lSJgaS76qJKd0Ucf8bnneMY",
  authDomain: "framezapp.firebaseapp.com",
  projectId: "framezapp",
  storageBucket: "framezapp.firebasestorage.app",
  messagingSenderId: "1070793132883",
  appId: "1:1070793132883:web:a19faddd693c3c5df32fa6"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
